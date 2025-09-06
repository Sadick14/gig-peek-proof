# 🚀 GigPeek Sepolia Deployment Guide

This guide will help you deploy the GigPeek smart contract to Sepolia testnet.

## Prerequisites

### 1. Get Sepolia ETH
You need Sepolia ETH to pay for gas fees. Get some from these faucets:
- **Alchemy Sepolia Faucet**: https://sepoliafaucet.com/
- **Chainlink Faucet**: https://faucets.chain.link/sepolia
- **QuickNode Faucet**: https://faucet.quicknode.com/ethereum/sepolia

### 2. Get RPC URL
Get a free RPC endpoint from:
- **Alchemy**: https://www.alchemy.com/ (Recommended)
- **Infura**: https://infura.io/
- **QuickNode**: https://www.quicknode.com/

### 3. Get Etherscan API Key (Optional)
For contract verification:
- Go to https://etherscan.io/apis
- Create a free account and get an API key

## Configuration

### 1. Set Environment Variables
Edit `packages/hardhat/.env` file:

```bash
# Your Sepolia RPC URL
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Your private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Enable gas reporting
REPORT_GAS=true
```

⚠️ **SECURITY WARNING**: Never commit your private key to git! Use a test account only.

### 2. Verify Configuration
```bash
cd packages/hardhat
npm run compile
```

## Deployment

### Deploy to Sepolia
```bash
cd packages/hardhat
npm run deploy:sepolia
```

### Verify Contract (Optional)
After deployment, verify on Etherscan:
```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Expected Output

✅ **Successful deployment will show:**
```
🚀 Deploying GigPeek to Sepolia testnet...
📝 Deploying with account: 0x...
💰 Account balance: 0.1 ETH
🌐 Network: sepolia - Chain ID: 11155111
📦 Deploying GigPeek contract...
⏳ Waiting for deployment transaction...
✅ GigPeek deployed successfully!
📍 Contract address: 0x...
🔍 Verifying deployment...
✅ Total Deals: 0
✅ Contract Balance: 0.0 ETH

============================================================
🎉 DEPLOYMENT SUCCESSFUL!
============================================================
Contract Address: 0x...
Network: sepolia
Chain ID: 11155111
Block Explorer: https://sepolia.etherscan.io/address/0x...
```

## After Deployment

### 1. Update Frontend
Copy the contract address and update `src/contracts/GigPeek.ts`:
```typescript
sepolia: {
  chainId: 11155111,
  GigPeek: {
    address: "0xYOUR_DEPLOYED_ADDRESS",
    deployedAt: "2025-09-06",
  },
},
```

### 2. Test the Contract
- Visit the contract on Sepolia Etherscan
- Interact with functions using the Web3 interface
- Test with your frontend application

## Troubleshooting

### Common Issues:

**❌ "insufficient funds for intrinsic transaction cost"**
- Get more Sepolia ETH from faucets

**❌ "invalid api key"**  
- Check your RPC URL and API key

**❌ "nonce too high"**
- Reset your MetaMask account or wait a few minutes

**❌ "replacement transaction underpriced"**
- Increase gas price or wait for previous transaction

### Gas Estimation
- Contract deployment: ~1,150,000 gas
- Estimated cost: ~0.001-0.01 ETH (depending on gas price)

## Smart Contract Features

The deployed GigPeek contract includes:

✅ **Core Functions:**
- `createDeal()` - Create escrow deals
- `submitProof()` - Submit work proof
- `releasePayment()` - Release escrowed funds

✅ **View Functions:**
- `getDeal()` - Get deal details
- `getDealsByClient()` - Get client's deals  
- `getDealsByContractor()` - Get contractor's deals
- `getTotalDeals()` - Get total deals count

✅ **Security Features:**
- Reentrancy protection
- Access control modifiers
- Input validation
- Safe ETH transfers

## Need Help?

If you encounter issues:
1. Check the Hardhat documentation
2. Verify your environment variables
3. Ensure you have enough Sepolia ETH
4. Check gas limits and network connectivity

Happy deploying! 🎉
