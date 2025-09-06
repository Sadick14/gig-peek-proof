import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the GigPeek contract using hardhat-deploy
 */
const deployGigPeek: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network, ethers } = hre;
  const { deploy, log } = deployments;

  const { deployer } = await getNamedAccounts();

  log("🚀 Deploying GigPeek contract...");
  log("📝 Deployer account:", deployer);
  log("🌐 Network:", network.name);

  const deployResult = await deploy("GigPeek", {
    from: deployer,
    args: [], // No constructor arguments
    log: true,
    autoMine: true,
  });

  if (deployResult.newlyDeployed) {
    log("✅ GigPeek deployed to:", deployResult.address);

    // Get the deployed contract to verify initial state
    const gigPeek = await ethers.getContractAt("GigPeek", deployResult.address);
    
    const totalDeals = await gigPeek.getTotalDeals();
    const contractBalance = await gigPeek.getContractBalance();
    
    log("🔍 Initial contract state:");
    log("  - Total Deals:", totalDeals.toString());
    log("  - Contract Balance:", ethers.formatEther(contractBalance), "ETH");

    // Only show verification instructions on live networks
    if (network.name !== "localhost" && network.name !== "hardhat") {
      log("📋 Contract deployed! Next steps:");
      log("1. Verify the contract:");
      log(`   npx hardhat verify --network ${network.name} ${deployResult.address}`);
      log("2. Update frontend with contract address");
      log("3. Test contract functions");
    }
  } else {
    log("♻️  GigPeek contract already deployed at:", deployResult.address);
  }

  log("🎉 GigPeek deployment completed!");
};

export default deployGigPeek;
deployGigPeek.tags = ["GigPeek"];
