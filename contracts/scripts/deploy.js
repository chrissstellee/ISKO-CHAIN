const { ethers } = require("hardhat");

async function main() {
  // Get multiple signers (add more if needed)
  const [deployer] = await ethers.getSigners();

  // Prepare initial admin addresses (can be just the deployer, or more)
  // You can add more addresses as needed!
  const initialAdmins = [deployer.address];

  console.log("Deploying with deployer:", deployer.address);
  console.log("Initial admins:", initialAdmins);

  // Pass initialAdmins to the contract constructor
  const IskoChainCredential = await ethers.getContractFactory("IskoChainCredential");
  const contract = await IskoChainCredential.deploy(initialAdmins);

  await contract.waitForDeployment();

  // Ethers v6: use .getAddress()
  console.log("IskoChainCredential deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
