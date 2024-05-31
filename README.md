# Marketplace + Lit Protocol - Proof of concept

This small POC is used to study the feasibility of using Lit Protocol in our marketplace.

Using Lit might have various advantages:
- ✅ We would delegate the keys management to Lit, this means that if a provider goes offline, we won't lose access to all their data
- ✅ We won't need providers and chainlink anymore, making the code much more simple and straightforward
- ✅ Encryption/Decryption would happen synchronously on the user's browser

## How to run

The contract addresses and chains have been hardcoded, so you should be able to run it just by executing

```
cd frontend
npm install
npm run dev
```

## Code Overview

The code is split between Contracts and Frontend.

### 📃 Contracts

- there is a deployed contract called AssetsManager in which the user can register assets. Each asset has an id and a price
- users can purchase assets from this contract
- the contract has a hasPurchased(userAddress, assetId) view that can be used by Lit to know if the user has access to the specified asset

### 🐥 Frontend

Split in 3 steps
- **upload**: a file is chosen, the client connects to Lit, encrypts the file on the browser, and "stores" it (on the marketplace it is done on IPFS, here just locally)
- **upload result**: displays the asset id, and the encrypted values and hash
- **download**: the user can purchase the asset (triggers a tx to the contract), and decrypt&download it (connects to lit, decrypts on the client, and downloads it right away)
