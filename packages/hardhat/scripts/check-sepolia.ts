import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Checking Sepolia connection and account status...");

  try {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    const network = await ethers.provider.getNetwork();
    
    console.log("📝 Account address:", deployer.address);
    console.log("🌐 Network:", network.name);
    console.log("🆔 Chain ID:", network.chainId);
    
    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    const balanceEth = ethers.formatEther(balance);
    
    console.log("💰 Account balance:", balanceEth, "ETH");
    
    if (parseFloat(balanceEth) < 0.01) {
      console.log("⚠️  Low balance! You need Sepolia ETH for deployment.");
      console.log("🚰 Get Sepolia ETH from:");
      console.log("   - https://sepoliafaucet.com/");
      console.log("   - https://faucets.chain.link/sepolia");
      console.log("   - https://faucet.quicknode.com/ethereum/sepolia");
    } else {
      console.log("✅ Sufficient balance for deployment!");
    }
    
    // Check network
    if (network.chainId !== 11155111n) {
      console.log("❌ Not connected to Sepolia testnet!");
      console.log("   Expected Chain ID: 11155111");
      console.log("   Current Chain ID:", network.chainId);
    } else {
      console.log("✅ Connected to Sepolia testnet!");
    }
    
    // Get latest block to test connection
    const latestBlock = await ethers.provider.getBlockNumber();
    console.log("📦 Latest block:", latestBlock);
    
    console.log("\n🎯 Ready for deployment!");
    
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error(error);
    console.log("\n💡 Troubleshooting:");
    console.log("1. Check your SEPOLIA_RPC_URL in .env");
    console.log("2. Check your PRIVATE_KEY in .env");
    console.log("3. Ensure your RPC endpoint is working");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
