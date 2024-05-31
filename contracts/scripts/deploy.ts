import hre, { ethers } from "hardhat";

async function deploy() {
    console.log("Deploying AssetsManager");

    const AssetsManagerContract = await ethers.getContractFactory("AssetsManager");
    const assetsManager = await AssetsManagerContract.deploy();
    await assetsManager.deployed();

    console.log(`Contract deployed at ${assetsManager.address}`);

    console.log("Waiting a bit for the changes to propagate...");
    await wait(10000);

    console.log("Verifying AssetsManager");

    try {
        await hre.run("verify:verify", { address: assetsManager.address });
    } catch (error) {
        console.log("AssetsManager VERIFICATION FAILED");
        console.log(error);
        return;
    }

    console.log("AssetsManager verified");
}

function wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

deploy().catch((error) => {
    console.error(error);
});
