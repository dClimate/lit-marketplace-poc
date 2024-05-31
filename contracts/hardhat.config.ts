import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-waffle";

require("dotenv").config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY not defined!");

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {},
        amoy: {
            url: process.env.AMOY_RPC!,
            chainId: 80002,
            accounts: [PRIVATE_KEY]
        },
        bscTestnet: {
            url: process.env.BNB_TESTNET_RPC!,
            chainId: 97,
            accounts: [PRIVATE_KEY]
        },
        baseSepolia: {
            url: process.env.BASE_SEPOLIA_RPC!,
            chainId: 84532,
            accounts: [PRIVATE_KEY]
        }
    },
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 1000
            }
        }
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    etherscan: {
        // To list all supported networks:
        // npx hardhat verify --list-networks
        apiKey: {
            baseSepolia: process.env.BASESCAN_KEY!,
            bscTestnet: process.env.BNBSCAN_KEY!,
            amoy: process.env.POLYGONSCAN_KEY!
        },
        customChains: [
            {
                network: "amoy",
                chainId: 80002,
                urls: {
                    apiURL: "https://api-amoy.polygonscan.com/api",
                    browserURL: "https://amoy.polygonscan.com"
                }
            },
            {
                network: "baseSepolia",
                chainId: 84532,
                urls: {
                    apiURL: "https://api-sepolia.basescan.org/api",
                    browserURL: "https://sepolia.basescan.org"
                }
            }
        ]
    }
};

export default config;
