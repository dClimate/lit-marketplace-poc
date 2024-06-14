import { BigNumber } from "ethers";
import toast from "react-hot-toast";
import { LitNetwork } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { EvmContractConditions, LitAbility } from "@lit-protocol/types";

export const ASSET_MANAGER_CHAIN = "baseSepolia";
export const ASSET_MANAGER_ADDRESS = "0x8f233919b9c78D00d5661576438b1018F41f9d35";
export const ASSET_MANAGER_ABI = [
    "constructor()",
    "error OwnableInvalidOwner(address owner)",
    "error OwnableUnauthorizedAccount(address account)",
    "event AssetPurchased(address indexed user, uint256 indexed assetId)",
    "event AssetRegistered(uint256 indexed assetId, uint256 price)",
    "event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)",
    "function assets(uint256) view returns (uint256 id, uint256 price, address owner, bool registered)",
    "function hasPurchasedAsset(address user, uint256 assetId) view returns (bool)",
    "function owner() view returns (address)",
    "function purchaseAsset(uint256 assetId) payable",
    "function registerAsset(uint256 assetId, uint256 price)",
    "function renounceOwnership()",
    "function transferOwnership(address newOwner)",
    "function userPurchases(address, uint256) view returns (bool)",
    "function withdraw()"
];

export const getEvmContractConditions = (assetId: BigNumber): EvmContractConditions => [
    {
        contractAddress: ASSET_MANAGER_ADDRESS,
        functionName: "hasPurchased",
        functionParams: [":userAddress", assetId.toString()],
        functionAbi: {
            type: "function",
            stateMutability: "view",
            outputs: [{ type: "bool", name: "", internalType: "bool" }],
            name: "hasPurchasedAsset",
            inputs: [
                { type: "address", name: "user", internalType: "address" },
                { type: "uint256", name: "assetId", internalType: "uint256" }
            ]
        },
        chain: ASSET_MANAGER_CHAIN,
        returnValueTest: { key: "", comparator: "=", value: "true" }
    }
];

export interface IEncryptedData {
    assetId: BigNumber;
    ciphertext: string;
    dataToEncryptHash: string;
}

export const connectToLit = async (): Promise<LitNodeClient> => {
    const client = new LitNodeClient({
        alertWhenUnauthorized: false,
        litNetwork: LitNetwork.Manzano,
        debug: true
    });
    await client.disconnect();
    await toast.promise(client.connect(), {
        loading: "Connecting to Lit Protocol",
        success: "connected",
        error: "ERROR"
    });

    return client;
};
