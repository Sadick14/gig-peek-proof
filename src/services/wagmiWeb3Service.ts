import { ethers } from 'ethers';
import { getAccount, getPublicClient, getWalletClient } from '@wagmi/core';
import { config } from '@/config/wagmi';

// Import the ABI from the generated file
const GIGPEEK_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "dealId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "client", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "contractor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "string", "name": "workDescription", "type": "string"}
    ],
    "name": "DealCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "dealId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "contractor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "PaymentReleased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "dealId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "contractor", "type": "address"},
      {"indexed": false, "internalType": "bytes32", "name": "proofHash", "type": "bytes32"}
    ],
    "name": "ProofSubmitted",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_contractor", "type": "address"},
      {"internalType": "string", "name": "_workDescription", "type": "string"}
    ],
    "name": "createDeal",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_dealId", "type": "uint256"}],
    "name": "getDeal",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "client", "type": "address"},
          {"internalType": "address", "name": "contractor", "type": "address"},
          {"internalType": "uint256", "name": "amount", "type": "uint256"},
          {"internalType": "string", "name": "workDescription", "type": "string"},
          {"internalType": "bytes32", "name": "proofHash", "type": "bytes32"},
          {"internalType": "enum GigPeek.DealStatus", "name": "status", "type": "uint8"},
          {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
          {"internalType": "uint256", "name": "proofSubmittedAt", "type": "uint256"}
        ],
        "internalType": "struct GigPeek.Deal",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_client", "type": "address"}],
    "name": "getDealsByClient",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_contractor", "type": "address"}],
    "name": "getDealsByContractor",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalDeals",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_dealId", "type": "uint256"}],
    "name": "releasePayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_dealId", "type": "uint256"},
      {"internalType": "bytes32", "name": "_proofHash", "type": "bytes32"}
    ],
    "name": "submitProof",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractBalance",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

const CONTRACT_ADDRESS = '0xF140271F8C6CF820aB2c9F58ecE55dE273319A95';

class WagmiWeb3Service {
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;
  private provider: ethers.BrowserProvider | null = null;

  async initialize() {
    try {
      const account = getAccount(config);
      if (!account.address) {
        throw new Error('No wallet connected');
      }

      // Get wallet client for signing transactions
      const walletClient = await getWalletClient(config);
      if (!walletClient) {
        throw new Error('Failed to get wallet client');
      }

      // Get public client for reading
      const publicClient = getPublicClient(config);
      if (!publicClient) {
        throw new Error('Failed to get public client');
      }

      // Create provider from public client
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Create contract instance
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        GIGPEEK_ABI,
        this.signer
      );

      return true;
    } catch (error) {
      console.error('Failed to initialize Web3 service:', error);
      throw error;
    }
  }

  async createDeal(contractorAddress: string, title: string, description: string, deadline: number, amount: string) {
    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    // Convert amount to wei
    const amountWei = ethers.parseEther(amount);

    // Call the smart contract function (only contractorAddress and description)
    const tx = await this.contract.createDeal(contractorAddress, description, {
      value: amountWei
    });

    const receipt = await tx.wait();

    // Parse the DealCreated event to get the deal ID
    const dealCreatedEvent = receipt.logs.find((log: any) => {
      try {
        const parsedLog = this.contract!.interface.parseLog(log);
        return parsedLog?.name === 'DealCreated';
      } catch {
        return false;
      }
    });

    let dealId = null;
    if (dealCreatedEvent) {
      const parsedLog = this.contract.interface.parseLog(dealCreatedEvent);
      dealId = parsedLog?.args[0];
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
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
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
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
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
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const deal = await this.contract.getDeal(dealId);
    return {
      id: dealId,
      client: deal[0],
      contractor: deal[1],
      amount: ethers.formatEther(deal[2]),
      workDescription: deal[3],
      proofHash: deal[4],
      status: deal[5],
      createdAt: Number(deal[6]),
      proofSubmittedAt: Number(deal[7])
    };
  }

  async getTotalDeals() {
    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const total = await this.contract.getTotalDeals();
    return Number(total);
  }

  async getDealsByClient(clientAddress: string) {
    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const dealIds = await this.contract.getDealsByClient(clientAddress);
    return dealIds.map((id: any) => Number(id));
  }

  async getDealsByContractor(contractorAddress: string) {
    if (!this.contract) {
      await this.initialize();
    }

    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    const dealIds = await this.contract.getDealsByContractor(contractorAddress);
    return dealIds.map((id: any) => Number(id));
  }

  async getAllDealsForUser(userAddress: string) {
    if (!this.contract) {
      await this.initialize();
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
            clientAddress: deal.client,
            title: `Deal #${dealId}`,
            description: deal.workDescription,
            amount: deal.amount,
            deadline: '',
            status: this.mapBlockchainStatus(deal.status) as 'active' | 'waiting_proof' | 'proof_submitted' | 'completed',
            createdAt: new Date(deal.createdAt * 1000),
            proofHash: deal.proofHash !== '0x0000000000000000000000000000000000000000000000000000000000000000' ? deal.proofHash : undefined,
            transactionHash: undefined,
            txHash: undefined,
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
    if (!this.provider) {
      await this.initialize();
    }

    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const account = getAccount(config);
    if (!account.address) {
      throw new Error('No wallet connected');
    }

    const balance = await this.provider.getBalance(account.address);
    return ethers.formatEther(balance);
  }
}

// Singleton instance
export const wagmiWeb3Service = new WagmiWeb3Service();
