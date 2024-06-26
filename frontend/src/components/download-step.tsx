import React from "react";
import { Card, CardTitle } from "./shared-styles";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { ASSET_MANAGER_ABI, ASSET_MANAGER_ADDRESS, IEncryptedData, ASSET_MANAGER_CHAIN, connectToLit, getEvmContractConditions } from "../constants";
import styled from "styled-components";
import { Contract, providers, utils } from "ethers";
import toast from "react-hot-toast";

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

export const DownloadStep = (
    { encryptedData, connectedAddress }:
        { encryptedData?: IEncryptedData; connectedAddress: string; }
) => {

    const purchaseAsset = async () => {
        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const assetManagerContract = new Contract(ASSET_MANAGER_ADDRESS, ASSET_MANAGER_ABI, signer);

        const hasPurchased = await assetManagerContract.hasPurchasedAsset(
            await signer.getAddress(),
            encryptedData!.assetId
        );
        if (hasPurchased) {
            toast.error("You already purchased this asset");
            return;
        }

        const price = utils.parseEther("0.001");
        const tx = await assetManagerContract.purchaseAsset(encryptedData!.assetId, { value: price });
        await toast.promise(
            tx.wait(),
            { loading: "Purchasing asset", success: "Purchase successful", error: "ERROR" }
        );
    };

    const decryptAndDownload = async () => {
        // connect to lit protocol
        const client = await connectToLit();

        // get the signature from the user
        const nonce = await client.getLatestBlockhash();
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: ASSET_MANAGER_CHAIN, switchChain: true, nonce });

        // decrypt file
        try {
            const decryptedFile = await LitJsSdk.decryptToFile(
                {
                    evmContractConditions: getEvmContractConditions(encryptedData!.assetId),
                    ciphertext: encryptedData!.ciphertext,
                    dataToEncryptHash: encryptedData!.dataToEncryptHash,
                    authSig,
                    chain: ASSET_MANAGER_CHAIN,
                },
                client
            );
            downloadUint8Array(decryptedFile);
        } catch (error) {
            const stringifiedError = JSON.stringify(error);
            const isAccessControlError = stringifiedError.includes("not permitted to access this content")
            const isRateLimitError = !isAccessControlError && stringifiedError.includes("Rate limit exceeded")

            const text = isAccessControlError
                ? "It seems you do not have access to this content. Did you purchase the asset?"
                : isRateLimitError
                ? "Rate limit exceeded. Did you purchase the Capacity Credits?"
                : "Something went wrong during the decryption";

            console.log(stringifiedError);
            toast.error(text);
        }
    };

    const downloadUint8Array = (decryptedFile: Uint8Array) => {
        const blob = new Blob([decryptedFile], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Dataset";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return <Card>
        <CardTitle>Download</CardTitle>

        {
            !encryptedData
                ? "Upload a file first..."
                : <>
                    <Button onClick={purchaseAsset}>Purchase</Button>
                    <br />
                    <Button onClick={decryptAndDownload}>Decrypt and Download</Button>
                </>

        }
    </Card>;
};
