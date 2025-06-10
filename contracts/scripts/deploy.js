const {ethers} = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying with:", deployer.address);

    const IskoChainCredential = await ethers.getContractFactory("IskoChainCredential");
    const contract = await IskoChainCredential.deploy();

    // In ethers v6+, use .target for the deployed address
    console.log("IskoChainCredential deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});