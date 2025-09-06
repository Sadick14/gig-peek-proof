import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting GigPeek contract deployment...");

  // Get the ContractFactory and Signers here.
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with the account:", deployer.address);
  console.log("💰 Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Deploy GigPeek contract
  const GigPeek = await ethers.getContractFactory("GigPeek");
  console.log("📦 Deploying GigPeek contract...");
  
  const gigPeek = await GigPeek.deploy();
  await gigPeek.waitForDeployment();

  const contractAddress = await gigPeek.getAddress();
  console.log("✅ GigPeek deployed to:", contractAddress);

  // Log deployment details
  console.log("\n📋 Deployment Summary:");
  console.log("=".repeat(50));
  console.log("Contract Address:", contractAddress);
  console.log("Deployer Address:", deployer.address);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  
  // Verify initial state
  console.log("\n🔍 Verifying initial contract state...");
  const totalDeals = await gigPeek.getTotalDeals();
  const contractBalance = await gigPeek.getContractBalance();
  console.log("Total Deals:", totalDeals.toString());
  console.log("Contract Balance:", ethers.formatEther(contractBalance), "ETH");

  console.log("\n🎉 Deployment completed successfully!");
  console.log("💡 Save this address for frontend integration:", contractAddress);
  
  // Instructions for verification
  console.log("\n📋 Next Steps:");
  console.log("1. Verify the contract on Etherscan:");
  console.log(`   npx hardhat verify --network sepolia ${contractAddress}`);
  console.log("2. Update the frontend with the contract address");
  console.log("3. Test the contract functions");

  return contractAddress;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
