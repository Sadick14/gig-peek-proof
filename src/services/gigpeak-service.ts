import { ethers } from 'ethers';
import { GIGPEEK_ABI, CONTRACTS } from '@/contracts/GigPeek';

// Web3 Service for interacting with the GigPeek smart contract
export class GigPeekService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
    }
  }

  async connect(): Promise<string[]> {
    if (!this.provider) {
      throw new Error('MetaMask not found. Please install MetaMask.');
    }

    const accounts = await this.provider.send('eth_requestAccounts', []);
    this.signer = await this.provider.getSigner();
    
    // Get current network
    const network = await this.provider.getNetwork();
    const contractInfo = this.getContractInfo(Number(network.chainId));
    
    if (!contractInfo) {
      throw new Error(`Unsupported network. Please switch to Sepolia testnet.`);
    }

    // Initialize contract
    this.contract = new ethers.Contract(
      contractInfo.GigPeek.address,
      GIGPEEK_ABI,
      this.signer
    );

    return accounts;
  }

  private getContractInfo(chainId: number) {
    switch (chainId) {
      case 1337:
        return CONTRACTS.localhost;
      case 11155111:
        return CONTRACTS.sepolia;
      default:
        return null;
    }
  }

  async createDeal(
    contractorAddress: string, 
    title: string, 
    description: string, 
    deadline: number,
    amountInEth: string
  ): Promise<{ txHash: string; dealId: number }> {
    if (!this.contract || !this.signer) {
      throw new Error('Not connected to wallet or contract not initialized');
    }

    try {
      // Convert ETH to Wei
      const amountInWei = ethers.parseEther(amountInEth);
      
      // Call the smart contract
      const tx = await this.contract.createDeal(
        contractorAddress,
        title,
        description,
        deadline,
        { value: amountInWei }
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Find the DealCreated event to get the deal ID
      const dealCreatedEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = this.contract!.interface.parseLog(log);
          return parsed?.name === 'DealCreated';
        } catch {
          return false;
        }
      });

      let dealId = 0;
      if (dealCreatedEvent) {
        const parsed = this.contract.interface.parseLog(dealCreatedEvent);
        dealId = Number(parsed?.args[0] || 0);
      }

      return {
        txHash: receipt.hash,
        dealId
      };
    } catch (error: any) {
      console.error('Error creating deal:', error);
      
      // Handle specific error cases
      if (error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction was rejected by user');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds for transaction');
      } else if (error.message?.includes('user rejected')) {
        throw new Error('Transaction was rejected by user');
      } else {
        throw new Error(`Transaction failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  async getDeal(dealId: number) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const deal = await this.contract.getDeal(dealId);
      return {
        id: Number(deal[0]),
        client: deal[1],
        contractor: deal[2],
        title: deal[3],
        description: deal[4],
        amount: ethers.formatEther(deal[5]),
        deadline: Number(deal[6]),
        isCompleted: deal[7],
        isDisputed: deal[8],
        proofHash: Number(deal[9]),
        proofDescription: deal[10],
        createdAt: Number(deal[11])
      };
    } catch (error) {
      console.error('Error fetching deal:', error);
      throw error;
    }
  }

  async submitProof(dealId: number, proofHash: number, proofDescription: string) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await this.contract.submitProof(dealId, proofHash, proofDescription);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error submitting proof:', error);
      
      if (error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction was rejected by user');
      } else {
        throw new Error(`Failed to submit proof: ${error.message || 'Unknown error'}`);
      }
    }
  }

  async releasePayment(dealId: number) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await this.contract.releasePayment(dealId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error releasing payment:', error);
      
      if (error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction was rejected by user');
      } else {
        throw new Error(`Failed to release payment: ${error.message || 'Unknown error'}`);
      }
    }
  }

  async raiseDispute(dealId: number) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await this.contract.raiseDispute(dealId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error('Error raising dispute:', error);
      
      if (error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction was rejected by user');
      } else {
        throw new Error(`Failed to raise dispute: ${error.message || 'Unknown error'}`);
      }
    }
  }

  async getCurrentAccount(): Promise<string | null> {
    if (!this.provider) return null;
    
    try {
      const signer = await this.provider.getSigner();
      return await signer.getAddress();
    } catch {
      return null;
    }
  }

  async getNetwork() {
    if (!this.provider) return null;
    
    try {
      return await this.provider.getNetwork();
    } catch {
      return null;
    }
  }

  async getBalance(address?: string): Promise<string> {
    if (!this.provider) throw new Error('Provider not available');
    
    const accountAddress = address || await this.getCurrentAccount();
    if (!accountAddress) throw new Error('No account connected');
    
    const balance = await this.provider.getBalance(accountAddress);
    return ethers.formatEther(balance);
  }
}

// Singleton instance
export const gigPeekService = new GigPeekService();
