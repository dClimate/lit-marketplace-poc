import React, { useEffect, useState } from "react";
import styled from "styled-components";
import toast, { Toaster } from "react-hot-toast";
import { UploadStep } from "./components/upload-step";
import { UploadResultStep } from "./components/upload-result-step";
import { DownloadStep } from "./components/download-step";
import { ConnectButton } from "./components/connect-button";
import { IEncryptedData } from "./constants";
import { BigNumber } from "ethers";

const Page = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
`;

const Title = styled.div`
    font-size: 3rem;
    color: #fb4105;
`;

const Subtitle = styled.div`
    font-size: 1.5rem;
    color: #fb4105;
    margin-bottom: 40px;
`;

const ConnectButtonContainer = styled.div`
    position: absolute;
    top: 15px;
    right: 5%;
`;

const Steps = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    column-gap: 24px;
`;

const Arrow = styled.div`
    height: 30px;
    width: 30px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23fb4105' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath stroke='none' d='M0 0h24v24H0z' fill='none'/%3E%3Cpath d='M4 9h8v-3.586a1 1 0 0 1 1.707 -.707l6.586 6.586a1 1 0 0 1 0 1.414l-6.586 6.586a1 1 0 0 1 -1.707 -.707v-3.586h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1z' /%3E%3C/svg%3E");
`;


export const App = () => {
    const [connectedAddress, setConnectedAddress] = useState<string | undefined>();
    const [encryptionResult, setEncryptionResult] = useState<IEncryptedData | undefined>(fetchEncryptedData());

    const setAndSaveEncryptionResult = (result: IEncryptedData) => {
        saveEncryptedDataLocally(result);
        setEncryptionResult(result);
    }

    const clearEncryptionResult = () => {
        deleteEncryptedDataLocally();
        setEncryptionResult(undefined);
    }

    return (
        <Page>
            <Title>Lit Protocol Encryption</Title>
            <Subtitle>Proof of Concept</Subtitle>
            <ConnectButtonContainer>
                <ConnectButton
                    connectedAddress={connectedAddress}
                    setConnectedAddress={setConnectedAddress}
                />
            </ConnectButtonContainer>

            <Steps>
                <UploadStep setEncryptionResult={setAndSaveEncryptionResult} />
                <Arrow />
                <UploadResultStep encryptedData={encryptionResult} clearEncryptionResult={clearEncryptionResult} />
                <Arrow />
                <DownloadStep encryptedData={encryptionResult} connectedAddress={connectedAddress!} />
            </Steps>

            <Toaster position="top-right" />
        </Page>
    );
};

const deleteEncryptedDataLocally = (): void => {
    localStorage.removeItem("LIT_POC_TEST_DATA");
}

const saveEncryptedDataLocally = (data: IEncryptedData): void => {
    const dataToSave = { ...data, assetId: data.assetId.toString() };
    localStorage.setItem("LIT_POC_TEST_DATA", JSON.stringify(dataToSave));
};

const fetchEncryptedData = (): IEncryptedData | undefined => {
    const savedData = localStorage.getItem("LIT_POC_TEST_DATA");
    return !savedData
        ? undefined
        : { ...JSON.parse(savedData), assetId: BigNumber.from(JSON.parse(savedData).assetId) };
};
