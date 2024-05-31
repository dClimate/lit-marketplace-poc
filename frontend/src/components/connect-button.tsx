import React, { useEffect } from "react";
import styled from "styled-components";

const WalletBt = styled.div`
    border: 1px solid #555;
    padding: 5px 15px;
    cursor: pointer;
    border-radius: 5px;
    color: #555;
    display: flex;
    flex-direction: column;
    align-elements: center;
`;

const Address = styled.div`
    font-size: 0.875rem;
    text-align: center;
`;

export const ConnectButton = ({
    connectedAddress,
    setConnectedAddress
}: {
    connectedAddress?: string,
    setConnectedAddress: (value?: string) => void;
}) => {

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setConnectedAddress(accounts[0]);
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert("Please install Metamask!");
        }
    };

    const disconnectWallet = () => {
        setConnectedAddress(undefined);
    };

    const shortAddress = () => `${connectedAddress?.substring(0, 5)}...` ?? "";

    useEffect(() => { connectWallet(); }, []);

    return !!connectedAddress
        ? <WalletBt onClick={disconnectWallet}>Connected!<Address>{shortAddress()}</Address></WalletBt>
        : <WalletBt onClick={connectWallet}>Connect</WalletBt>;
};
