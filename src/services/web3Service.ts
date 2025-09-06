import { ethers } from 'ethers';
import { GIGPEEK_ABI, switchToSepolia } from '@/contracts/GigPeek';

// Use environment variable for contract address
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0xF140271F8C6CF820aB2c9F58ecE55dE273319A95';
const SEPOLIA_CHAIN_ID = 11155111;

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  async initialize() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    
    // Check if we're on the correct network
    const network = await this.provider.getNetwork();
    if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
      // Try to switch to Sepolia
      const switched = await switchToSepolia();
      if (!switched) {
        throw new Error('Please switch to Sepolia testnet');
      }
    }

    this.signer = await this.provider.getSigner();
    this.contract = new ethers.Contract(CONTRACT_ADDRESS, GIGPEEK_ABI, this.signer);
    
    return this.signer;
  }

  async createDeal(
    contractorAddress: string,
    title: string,
    description: string,
    deadline: number,
    amount: string
  ) {
    if (!this.contract || !this.signer) {
      throw new Error('Web3 not initialized');
    }

    // Convert amount from ETH to Wei
    const amountWei = ethers.parseEther(amount);
    
    // Combine title and description for the work description
    const workDescription = `${title}\n\n${description}`;
    
    // Call the createDeal function with correct parameters
    const tx = await this.contract.createDeal(
      contractorAddress,
      workDescription,
      { value: amountWei }
    );

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    // Extract deal ID from logs
    const dealCreatedEvent = receipt.logs.find((log: any) => {
      try {
        const parsedLog = this.contract?.interface.parseLog(log);
        return parsedLog?.name === 'DealCreated';
      } catch {
        return false;
      }
    });

    let dealId = null;
    if (dealCreatedEvent) {
      const parsedLog = this.contract.interface.parseLog(dealCreatedEvent);
      dealId = parsedLog?.args[0]; // First argument is dealId
    }

    return {
      txHash: receipt.hash,
      dealId: dealId?.toString(),
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  }

  async submitProof(dealId: string, proofHash: string) {
    if (!this.contract) {
      throw new Error('Web3 not initialized');
    }

    const tx = await this.contract.submitProof(dealId, proofHash);
    const receipt = await tx.wait();
    
    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  }

  async releasePayment(dealId: string) {
    if (!this.contract) {
      throw new Error('Web3 not initialized');
    }

    const tx = await this.contract.releasePayment(dealId);
    const receipt = await tx.wait();
    
    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    };
  }

  async getDeal(dealId: string) {
    if (!this.contract) {
      throw new Error('Web3 not initialized');
    }

    const deal = await this.contract.getDeal(dealId);
    return {
      id: dealId,
      client: deal[0],
      contractor: deal[1],
      amount: ethers.formatEther(deal[2]),
      workDescription: deal[3],
      proofHash: deal[4],
      status: deal[5], // 0=Active, 1=ProofSubmitted, 2=Completed
      createdAt: Number(deal[6]),
      proofSubmittedAt: Number(deal[7])
    };
  }

  async getTotalDeals() {
    if (!this.contract) {
      throw new Error('Web3 not initialized');
    }

    const total = await this.contract.getTotalDeals();
    return Number(total);
  }

  async getDealsByClient(clientAddress: string) {
    if (!this.contract) {
      throw new Error('Web3 not initialized');
    }

    const dealIds = await this.contract.getDealsByClient(clientAddress);
    return dealIds.map((id: any) => Number(id));
  }

  async getDealsByContractor(contractorAddress: string) {
    if (!this.contract) {
      throw new Error('Web3 not initialized');
    }

    const dealIds = await this.contract.getDealsByContractor(contractorAddress);
    return dealIds.map((id: any) => Number(id));
  }

  async getAllDealsForUser(userAddress: string) {
    if (!this.contract) {
      throw new Error('Web3 not initialized');
    }

    try {
      // Get deals where user is client
      const clientDealIds = await this.getDealsByClient(userAddress);
      
      // Get deals where user is contractor
      const contractorDealIds = await this.getDealsByContractor(userAddress);
      
      // Combine all deal IDs
      const allDealIds = [...new Set([...clientDealIds, ...contractorDealIds])];
      
      // Fetch full deal data for each ID
      const deals = await Promise.all(
        allDealIds.map(async (dealId) => {
          const deal = await this.getDeal(dealId.toString());
          return {
            id: dealId.toString(),
            contractorAddress: deal.contractor,
            clientAddress: deal.client, // Add client address
            title: `Deal #${dealId}`, // Generate title since blockchain doesn't store it
            description: deal.workDescription, // Map workDescription to description
            amount: deal.amount,
            deadline: '', // Not stored in current contract version
            status: this.mapBlockchainStatus(deal.status) as 'active' | 'waiting_proof' | 'proof_submitted' | 'completed',
            createdAt: new Date(deal.createdAt * 1000), // Convert from timestamp
            proofHash: deal.proofHash !== '0x0000000000000000000000000000000000000000000000000000000000000000' ? deal.proofHash : undefined,
            transactionHash: undefined, // Will be updated when payments are made
            txHash: undefined, // Will be updated when deals are created
            userRole: deal.client.toLowerCase() === userAddress.toLowerCase() ? 'client' : 'contractor' as 'client' | 'contractor',
          };
        })
      );
      
      return deals;
    } catch (error) {
      console.error('Error fetching user deals:', error);
      return [];
    }
  }

  mapBlockchainStatus(blockchainStatus: number) {
    switch (blockchainStatus) {
      case 0: return 'active';
      case 1: return 'proof_submitted';
      case 2: return 'completed';
      default: return 'active';
    }
  }

  getContractAddress() {
    return CONTRACT_ADDRESS;
  }

  async getBalance() {
    if (!this.signer) {
      throw new Error('Web3 not initialized');
    }

    const address = await this.signer.getAddress();
    const balance = await this.provider!.getBalance(address);
    return ethers.formatEther(balance);
  }
}

// Singleton instance
export const web3Service = new Web3Service();
