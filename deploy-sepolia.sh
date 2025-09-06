#!/bin/bash

# GigPeek Sepolia Deployment Script
# This script deploys the GigPeek contract to Sepolia testnet

echo "🚀 Starting GigPeek deployment to Sepolia testnet..."

# Check if required environment variables are set
if [ -z "$SEPOLIA_RPC_URL" ]; then
    echo "❌ SEPOLIA_RPC_URL not set. Please set it in .env file"
    echo "Example: SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
    exit 1
fi

if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ PRIVATE_KEY not set. Please set it in .env file"
    echo "Example: PRIVATE_KEY=your_private_key_without_0x"
    exit 1
fi

echo "✅ Environment variables configured"
echo "🌐 Network: Sepolia Testnet"
echo "🔗 RPC URL: $SEPOLIA_RPC_URL"

# Navigate to hardhat directory
cd packages/hardhat

echo "📦 Compiling contracts..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ Compilation failed"
    exit 1
fi

echo "✅ Compilation successful"

echo "🚀 Deploying to Sepolia..."
npm run deploy:sepolia

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

echo "✅ Deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the contract address from the deployment output"
echo "2. Update src/contracts/GigPeek.ts with the new address"
echo "3. Verify the contract on Etherscan:"
echo "   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>"
echo "4. Test the contract on Sepolia testnet"
echo ""
echo "🎉 GigPeek is now live on Sepolia!"
