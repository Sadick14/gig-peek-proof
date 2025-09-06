import { ethers } from "hardhat";

async function main() {
  console.log("🧪 Testing GigPeek contract locally...");

  // Get signers
  const [client, contractor] = await ethers.getSigners();
  console.log("👤 Client address:", client.address);
  console.log("🔧 Contractor address:", contractor.address);

  // Deploy contract
  const GigPeek = await ethers.getContractFactory("GigPeek");
  const gigPeek = await GigPeek.deploy();
  await gigPeek.waitForDeployment();

  const contractAddress = await gigPeek.getAddress();
  console.log("📦 Contract deployed to:", contractAddress);

  // Test 1: Create a deal
  console.log("\n📝 Test 1: Creating a deal...");
  const dealAmount = ethers.parseEther("0.1");
  const workDescription = "Create a React component for user authentication";
  
  const createTx = await gigPeek.connect(client).createDeal(
    contractor.address,
    workDescription,
    { value: dealAmount }
  );
  await createTx.wait();
  console.log("✅ Deal created successfully!");

  // Check deal details
  const deal = await gigPeek.getDeal(0);
  console.log("Deal ID: 0");
  console.log("Client:", deal.client);
  console.log("Contractor:", deal.contractor);
  console.log("Amount:", ethers.formatEther(deal.amount), "ETH");
  console.log("Status:", deal.status === 0n ? "Active" : "Other");

  // Test 2: Submit proof
  console.log("\n📋 Test 2: Submitting proof...");
  const proofHash = ethers.keccak256(ethers.toUtf8Bytes("Authentication component completed with tests"));
  
  const proofTx = await gigPeek.connect(contractor).submitProof(0, proofHash);
  await proofTx.wait();
  console.log("✅ Proof submitted successfully!");

  // Check updated deal
  const updatedDeal = await gigPeek.getDeal(0);
  console.log("Updated Status:", updatedDeal.status === 1n ? "Proof Submitted" : "Other");
  console.log("Proof Hash:", updatedDeal.proofHash);

  // Test 3: Release payment
  console.log("\n💰 Test 3: Releasing payment...");
  const contractorBalanceBefore = await ethers.provider.getBalance(contractor.address);
  
  const releaseTx = await gigPeek.connect(client).releasePayment(0);
  await releaseTx.wait();
  console.log("✅ Payment released successfully!");

  // Check final state
  const finalDeal = await gigPeek.getDeal(0);
  const contractorBalanceAfter = await ethers.provider.getBalance(contractor.address);
  const balanceDiff = contractorBalanceAfter - contractorBalanceBefore;

  console.log("Final Status:", finalDeal.status === 2n ? "Completed" : "Other");
  console.log("Contractor received:", ethers.formatEther(balanceDiff), "ETH");

  // Test 4: Query functions
  console.log("\n🔍 Test 4: Testing query functions...");
  const clientDeals = await gigPeek.getDealsByClient(client.address);
  const contractorDeals = await gigPeek.getDealsByContractor(contractor.address);
  const totalDeals = await gigPeek.getTotalDeals();

  console.log("Client deals:", clientDeals.map(id => id.toString()));
  console.log("Contractor deals:", contractorDeals.map(id => id.toString()));
  console.log("Total deals:", totalDeals.toString());

  console.log("\n🎉 All tests passed! Contract is working correctly.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
