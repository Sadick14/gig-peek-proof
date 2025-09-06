import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("GigPeek", function () {
  // We define a fixture to reuse the same setup in every test.
  async function deployGigPeekFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, client, contractor, otherAccount] = await ethers.getSigners();

    const GigPeek = await ethers.getContractFactory("GigPeek");
    const gigPeek = await GigPeek.deploy();

    return { gigPeek, owner, client, contractor, otherAccount };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { gigPeek } = await loadFixture(deployGigPeekFixture);
      expect(await gigPeek.getTotalDeals()).to.equal(0);
    });
  });

  describe("Deal Creation", function () {
    it("Should create a deal successfully", async function () {
      const { gigPeek, client, contractor } = await loadFixture(deployGigPeekFixture);
      
      const dealAmount = ethers.parseEther("0.1");
      const workDescription = "Create a React component for user authentication";
      
      await expect(
        gigPeek.connect(client).createDeal(contractor.address, workDescription, { value: dealAmount })
      )
        .to.emit(gigPeek, "DealCreated")
        .withArgs(0, client.address, contractor.address, dealAmount, workDescription);
      
      expect(await gigPeek.getTotalDeals()).to.equal(1);
      
      const deal = await gigPeek.getDeal(0);
      expect(deal.client).to.equal(client.address);
      expect(deal.contractor).to.equal(contractor.address);
      expect(deal.amount).to.equal(dealAmount);
      expect(deal.workDescription).to.equal(workDescription);
      expect(deal.status).to.equal(0); // Active
      expect(deal.proofHash).to.equal(ethers.ZeroHash);
    });

    it("Should fail to create deal with zero amount", async function () {
      const { gigPeek, client, contractor } = await loadFixture(deployGigPeekFixture);
      
      await expect(
        gigPeek.connect(client).createDeal(contractor.address, "Some work", { value: 0 })
      ).to.be.revertedWith("Deal amount must be greater than 0");
    });

    it("Should fail to create deal with invalid contractor address", async function () {
      const { gigPeek, client } = await loadFixture(deployGigPeekFixture);
      
      await expect(
        gigPeek.connect(client).createDeal(ethers.ZeroAddress, "Some work", { value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Invalid contractor address");
    });

    it("Should fail to create deal with same client and contractor", async function () {
      const { gigPeek, client } = await loadFixture(deployGigPeekFixture);
      
      await expect(
        gigPeek.connect(client).createDeal(client.address, "Some work", { value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Client and contractor cannot be the same");
    });

    it("Should fail to create deal with empty work description", async function () {
      const { gigPeek, client, contractor } = await loadFixture(deployGigPeekFixture);
      
      await expect(
        gigPeek.connect(client).createDeal(contractor.address, "", { value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Work description cannot be empty");
    });

    it("Should track deals for client and contractor", async function () {
      const { gigPeek, client, contractor } = await loadFixture(deployGigPeekFixture);
      
      await gigPeek.connect(client).createDeal(
        contractor.address, 
        "Test work", 
        { value: ethers.parseEther("0.1") }
      );
      
      const clientDeals = await gigPeek.getDealsByClient(client.address);
      const contractorDeals = await gigPeek.getDealsByContractor(contractor.address);
      
      expect(clientDeals.length).to.equal(1);
      expect(clientDeals[0]).to.equal(0);
      expect(contractorDeals.length).to.equal(1);
      expect(contractorDeals[0]).to.equal(0);
    });
  });

  describe("Proof Submission", function () {
    async function createDealFixture() {
      const deployment = await loadFixture(deployGigPeekFixture);
      const { gigPeek, client, contractor } = deployment;
      
      await gigPeek.connect(client).createDeal(
        contractor.address,
        "Create a React component",
        { value: ethers.parseEther("0.1") }
      );
      
      return { ...deployment, dealId: 0 };
    }

    it("Should allow contractor to submit proof", async function () {
      const { gigPeek, contractor, dealId } = await loadFixture(createDealFixture);
      
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("Proof of completed work"));
      
      await expect(
        gigPeek.connect(contractor).submitProof(dealId, proofHash)
      )
        .to.emit(gigPeek, "ProofSubmitted")
        .withArgs(dealId, contractor.address, proofHash);
      
      const deal = await gigPeek.getDeal(dealId);
      expect(deal.status).to.equal(1); // ProofSubmitted
      expect(deal.proofHash).to.equal(proofHash);
      expect(deal.proofSubmittedAt).to.be.greaterThan(0);
    });

    it("Should fail when non-contractor tries to submit proof", async function () {
      const { gigPeek, client, dealId } = await loadFixture(createDealFixture);
      
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("Proof of completed work"));
      
      await expect(
        gigPeek.connect(client).submitProof(dealId, proofHash)
      ).to.be.revertedWith("Only contractor can perform this action");
    });

    it("Should fail to submit proof for non-existent deal", async function () {
      const { gigPeek, contractor } = await loadFixture(deployGigPeekFixture);
      
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("Proof of completed work"));
      
      await expect(
        gigPeek.connect(contractor).submitProof(999, proofHash)
      ).to.be.revertedWith("Deal does not exist");
    });

    it("Should fail to submit empty proof hash", async function () {
      const { gigPeek, contractor, dealId } = await loadFixture(createDealFixture);
      
      await expect(
        gigPeek.connect(contractor).submitProof(dealId, ethers.ZeroHash)
      ).to.be.revertedWith("Proof hash cannot be empty");
    });
  });

  describe("Payment Release", function () {
    async function dealWithProofFixture() {
      const deployment = await loadFixture(deployGigPeekFixture);
      const { gigPeek, client, contractor } = deployment;
      
      const dealAmount = ethers.parseEther("0.1");
      await gigPeek.connect(client).createDeal(
        contractor.address,
        "Create a React component",
        { value: dealAmount }
      );
      
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("Proof of completed work"));
      await gigPeek.connect(contractor).submitProof(0, proofHash);
      
      return { ...deployment, dealId: 0, dealAmount };
    }

    it("Should allow client to release payment", async function () {
      const { gigPeek, client, contractor, dealId, dealAmount } = await loadFixture(dealWithProofFixture);
      
      const contractorBalanceBefore = await ethers.provider.getBalance(contractor.address);
      
      await expect(
        gigPeek.connect(client).releasePayment(dealId)
      )
        .to.emit(gigPeek, "PaymentReleased")
        .withArgs(dealId, contractor.address, dealAmount);
      
      const deal = await gigPeek.getDeal(dealId);
      expect(deal.status).to.equal(2); // Completed
      
      const contractorBalanceAfter = await ethers.provider.getBalance(contractor.address);
      expect(contractorBalanceAfter - contractorBalanceBefore).to.equal(dealAmount);
    });

    it("Should fail when non-client tries to release payment", async function () {
      const { gigPeek, contractor, dealId } = await loadFixture(dealWithProofFixture);
      
      await expect(
        gigPeek.connect(contractor).releasePayment(dealId)
      ).to.be.revertedWith("Only client can perform this action");
    });

    it("Should fail to release payment before proof submission", async function () {
      const { gigPeek, client, contractor } = await loadFixture(deployGigPeekFixture);
      
      await gigPeek.connect(client).createDeal(
        contractor.address,
        "Test work",
        { value: ethers.parseEther("0.1") }
      );
      
      await expect(
        gigPeek.connect(client).releasePayment(0)
      ).to.be.revertedWith("Proof not submitted yet");
    });

    it("Should fail to release payment twice", async function () {
      const { gigPeek, client, dealId } = await loadFixture(dealWithProofFixture);
      
      await gigPeek.connect(client).releasePayment(dealId);
      
      await expect(
        gigPeek.connect(client).releasePayment(dealId)
      ).to.be.revertedWith("Proof not submitted yet");
    });
  });

  describe("View Functions", function () {
    it("Should return correct deal information", async function () {
      const { gigPeek, client, contractor } = await loadFixture(deployGigPeekFixture);
      
      const dealAmount = ethers.parseEther("0.1");
      const workDescription = "Test work description";
      
      await gigPeek.connect(client).createDeal(
        contractor.address,
        workDescription,
        { value: dealAmount }
      );
      
      const deal = await gigPeek.getDeal(0);
      expect(deal.client).to.equal(client.address);
      expect(deal.contractor).to.equal(contractor.address);
      expect(deal.amount).to.equal(dealAmount);
      expect(deal.workDescription).to.equal(workDescription);
    });

    it("Should track contract balance", async function () {
      const { gigPeek, client, contractor } = await loadFixture(deployGigPeekFixture);
      
      const dealAmount = ethers.parseEther("0.1");
      
      expect(await gigPeek.getContractBalance()).to.equal(0);
      
      await gigPeek.connect(client).createDeal(
        contractor.address,
        "Test work",
        { value: dealAmount }
      );
      
      expect(await gigPeek.getContractBalance()).to.equal(dealAmount);
    });
  });

  describe("Integration Tests", function () {
    it("Should handle complete deal lifecycle", async function () {
      const { gigPeek, client, contractor } = await loadFixture(deployGigPeekFixture);
      
      const dealAmount = ethers.parseEther("0.1");
      const workDescription = "Complete React application";
      
      // 1. Create deal
      await gigPeek.connect(client).createDeal(
        contractor.address,
        workDescription,
        { value: dealAmount }
      );
      
      let deal = await gigPeek.getDeal(0);
      expect(deal.status).to.equal(0); // Active
      
      // 2. Submit proof
      const proofHash = ethers.keccak256(ethers.toUtf8Bytes("Application completed with tests"));
      await gigPeek.connect(contractor).submitProof(0, proofHash);
      
      deal = await gigPeek.getDeal(0);
      expect(deal.status).to.equal(1); // ProofSubmitted
      expect(deal.proofHash).to.equal(proofHash);
      
      // 3. Release payment
      const contractorBalanceBefore = await ethers.provider.getBalance(contractor.address);
      await gigPeek.connect(client).releasePayment(0);
      
      deal = await gigPeek.getDeal(0);
      expect(deal.status).to.equal(2); // Completed
      
      const contractorBalanceAfter = await ethers.provider.getBalance(contractor.address);
      expect(contractorBalanceAfter - contractorBalanceBefore).to.equal(dealAmount);
      
      // Contract should have no balance left
      expect(await gigPeek.getContractBalance()).to.equal(0);
    });

    it("Should handle multiple deals correctly", async function () {
      const { gigPeek, client, contractor, otherAccount } = await loadFixture(deployGigPeekFixture);
      
      // Create multiple deals
      await gigPeek.connect(client).createDeal(
        contractor.address,
        "First deal",
        { value: ethers.parseEther("0.1") }
      );
      
      await gigPeek.connect(client).createDeal(
        otherAccount.address,
        "Second deal",
        { value: ethers.parseEther("0.2") }
      );
      
      expect(await gigPeek.getTotalDeals()).to.equal(2);
      
      const clientDeals = await gigPeek.getDealsByClient(client.address);
      expect(clientDeals.length).to.equal(2);
      
      const contractorDeals = await gigPeek.getDealsByContractor(contractor.address);
      expect(contractorDeals.length).to.equal(1);
      expect(contractorDeals[0]).to.equal(0);
    });
  });
});
