// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetsManager is Ownable {
    struct Asset {
        uint256 id;
        uint256 price;
        address owner;
        bool registered;
    }

    mapping(uint256 => Asset) public assets;
    mapping(address => mapping(uint256 => bool)) public userPurchases;

    event AssetRegistered(uint256 indexed assetId, uint256 price);
    event AssetPurchased(address indexed user, uint256 indexed assetId);

    modifier assetExists(uint256 assetId) {
        require(assets[assetId].registered, "Asset does not exist");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function registerAsset(uint256 assetId, uint256 price) external {
        require(!assets[assetId].registered, "Asset already registered");
        require(price > 0, "Price must be greater than zero");

        assets[assetId] = Asset({
            owner: msg.sender,
            id: assetId,
            price: price,
            registered: true
        });

        emit AssetRegistered(assetId, price);
    }

    function purchaseAsset(uint256 assetId) external payable assetExists(assetId) {
        Asset memory asset = assets[assetId];
        require(msg.value == asset.price, "Incorrect value sent");

        userPurchases[msg.sender][assetId] = true;

        emit AssetPurchased(msg.sender, assetId);
    }

    function hasPurchasedAsset(address user, uint256 assetId) external view returns (bool) {
        return userPurchases[user][assetId];
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner()).transfer(balance);
    }
}
