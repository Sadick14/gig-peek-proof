import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying GigPeek to Sepolia testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("📝 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  console.log("🌐 Network:", network.name, "- Chain ID:", network.chainId);

  // Check if we're on Sepolia
  if (network.chainId !== 11155111n) {
    console.log("⚠️  Warning: Not on Sepolia testnet (Chain ID: 11155111)");
    console.log("Current Chain ID:", network.chainId);
  }

  // Deploy the contract
  console.log("📦 Deploying GigPeek contract...");
  const GigPeek = await ethers.getContractFactory("GigPeek");
  const gigPeek = await GigPeek.deploy();
  
  console.log("⏳ Waiting for deployment transaction...");
  await gigPeek.waitForDeployment();

  const contractAddress = await gigPeek.getAddress();
  console.log("✅ GigPeek deployed successfully!");
  console.log("📍 Contract address:", contractAddress);

  // Verify initial state
  console.log("\n🔍 Verifying deployment...");
  try {
    const totalDeals = await gigPeek.getTotalDeals();
    const contractBalance = await gigPeek.getContractBalance();
    console.log("✅ Total Deals:", totalDeals.toString());
    console.log("✅ Contract Balance:", ethers.formatEther(contractBalance), "ETH");
  } catch (error) {
    console.log("⚠️  Could not verify contract state:", error);
  }

  // Show deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=".repeat(60));
  console.log("Contract Address:", contractAddress);
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId);
  console.log("Deployer:", deployer.address);
  console.log("Block Explorer:", `https://sepolia.etherscan.io/address/${contractAddress}`);

  console.log("\n📋 Next Steps:");
  console.log("1. Update frontend contract address in src/contracts/GigPeek.ts");
  console.log("2. Verify contract on Etherscan:");
  console.log(`   npx hardhat verify --network sepolia ${contractAddress}`);
  console.log("3. Add some Sepolia ETH to test accounts");
  console.log("4. Test the dApp with real blockchain interactions");

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockExplorer: `https://sepolia.etherscan.io/address/${contractAddress}`,
  };

  console.log("\n💾 Deployment info saved for frontend integration:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
