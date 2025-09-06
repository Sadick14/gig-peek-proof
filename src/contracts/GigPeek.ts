// GigPeek Smart Contract Configuration
// This file contains contract addresses and ABI for frontend integration

export const CONTRACTS = {
  // Local development (Hardhat Network)
  localhost: {
    chainId: 1337,
    GigPeek: {
      address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      deployedAt: "Latest deployment",
    },
  },
  
  // Sepolia Testnet
  sepolia: {
    chainId: 11155111,
    GigPeek: {
      address: "0xF140271F8C6CF820aB2c9F58ecE55dE273319A95",
      deployedAt: "2025-09-06T06:36:13.745Z",
      blockExplorer: "https://sepolia.etherscan.io/address/0xF140271F8C6CF820aB2c9F58ecE55dE273319A95"
    },
  },
} as const;

// Contract ABI for frontend interaction
export const GIGPEEK_ABI = [
  {
    "inputs": [],
    "name": "getTotalDeals",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_contractor",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_workDescription",
        "type": "string"
      }
    ],
    "name": "createDeal",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_dealId",
        "type": "uint256"
      },
      {
        "internalType": "bytes32",
        "name": "_proofHash",
        "type": "bytes32"
      }
    ],
    "name": "submitProof",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_dealId",
        "type": "uint256"
      }
    ],
    "name": "releasePayment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_dealId",
        "type": "uint256"
      }
    ],
    "name": "getDeal",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "client",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "contractor",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "workDescription",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "proofHash",
            "type": "bytes32"
          },
          {
            "internalType": "enum GigPeek.DealStatus",
            "name": "status",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "createdAt",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "proofSubmittedAt",
            "type": "uint256"
          }
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
    "inputs": [
      {
        "internalType": "address",
        "name": "_client",
        "type": "address"
      }
    ],
    "name": "getDealsByClient",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_contractor",
        "type": "address"
      }
    ],
    "name": "getDealsByContractor",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "dealId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "client",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "contractor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "workDescription",
        "type": "string"
      }
    ],
    "name": "DealCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "dealId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "contractor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "proofHash",
        "type": "bytes32"
      }
    ],
    "name": "ProofSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "dealId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "contractor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PaymentReleased",
    "type": "event"
  }
] as const;

// Helper function to get contract info for current network
export function getContractInfo(chainId: number) {
  switch (chainId) {
    case 1337:
      return CONTRACTS.localhost;
    case 11155111:
      return CONTRACTS.sepolia;
    default:
      console.warn(`Unsupported chain ID: ${chainId}`);
      return CONTRACTS.localhost; // Fallback to localhost
  }
}

// Sepolia Network Configuration for MetaMask
export const SEPOLIA_NETWORK_CONFIG = {
  chainId: "0xaa36a7", // 11155111 in hex
  chainName: "Sepolia Test Network",
  nativeCurrency: {
    name: "Sepolia ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
} as const;

// Helper function to add Sepolia network to MetaMask
export const addSepoliaNetwork = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [SEPOLIA_NETWORK_CONFIG],
      });
      return true;
    } catch (error) {
      console.error("Error adding Sepolia network:", error);
      return false;
    }
  }
  return false;
};

// Helper function to switch to Sepolia network
export const switchToSepolia = async () => {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_NETWORK_CONFIG.chainId }],
      });
      return true;
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        return await addSepoliaNetwork();
      }
      console.error("Error switching to Sepolia network:", error);
      return false;
    }
  }
  return false;
};
