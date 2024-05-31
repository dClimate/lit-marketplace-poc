import React, { useEffect, useState } from "react";
import { Card, CardTitle } from "./shared-styles";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { ASSET_MANAGER_ABI, ASSET_MANAGER_ADDRESS, IEncryptedData, ASSET_MANAGER_CHAIN, connectToLit, getEvmContractConditions } from "../constants";
import { BigNumber, Contract, providers, utils } from "ethers";
import toast from "react-hot-toast";

const Form = styled.form`
    display: flex;
    flex-direction: column;
    row-gap: 25px;
    padding-right: 30px;
    max-width: 350px;
`;

export const FormInput = styled.div`
    color: #000;
    display: flex;
    flex-direction: column;
    row-gap: 4px;
    line-height: 20px;
    font-size: 1rem;
`;

export const Label = styled.label`
    color: #111827;
    font-size: 0.875rem;
    font-weight: 500;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const Input = styled.input`
    border-radius: 6px;
    border: 1px solid #d1d5db;
    padding: 10px;
    font-size: 0.875rem;
    outline: none;

    &::placeholder {
        color: #808080;
        font-size: 14px;
        font-weight: 400;
    }
`;

const Button = styled.button`
    width: 100%;
    background-color: #37ae8b;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 20px;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 24px; /* 150% */
    cursor: pointer;

    &: disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`;


export const UploadStep = ({ setEncryptionResult }: { setEncryptionResult: (data: IEncryptedData) => void; }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty, isValid, isSubmitting },
    } = useForm();

    const uploadAndEncrypt = async (data: any) => {
        const file = data.file[0];
        const assetId = generateRandomAssetId();

        // connect to lit protocol
        const client = await connectToLit();

        // get the signature from the user
        const nonce = await client.getLatestBlockhash();
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: ASSET_MANAGER_CHAIN, switchChain: true, nonce });

        // encrypt the file
        const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptFile(
            {
                evmContractConditions: getEvmContractConditions(assetId),
                file,
                chain: ASSET_MANAGER_CHAIN,
                authSig
            },
            client
        );

        // Add the asset to the contract
        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const price = utils.parseEther("0.001");
        const assetManagerContract = new Contract(ASSET_MANAGER_ADDRESS, ASSET_MANAGER_ABI, signer);
        const tx = await assetManagerContract.registerAsset(assetId, price);
        await toast.promise(
            tx.wait(),
            { loading: "Writing asset id and price onchain", success: "Write successful", error: "ERROR" }
        );

        setEncryptionResult({ assetId, ciphertext, dataToEncryptHash });
    };

    const generateRandomAssetId = () => BigNumber.from(utils.randomBytes(32));

    return <Card>
        <CardTitle>Upload</CardTitle>

        <Form onSubmit={handleSubmit(uploadAndEncrypt)}>
            {/* File */}
            <FormInput>
                <Label>Dataset File</Label>
                <Input
                    type="file"
                    {...register("file", { required: true })}
                />
                {errors.file && <div>Please add a file</div>}
            </FormInput>

            {/* Submit button */}
            <Button disabled={!isDirty || !isValid || isSubmitting} type="submit">
                Encrypt and Upload
            </Button>
        </Form>
    </Card>;
};
