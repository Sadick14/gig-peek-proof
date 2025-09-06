import { createConfig, http } from 'wagmi'
import { sepolia, mainnet } from 'wagmi/chains'
import { metaMask, walletConnect, coinbaseWallet, injected } from '@wagmi/connectors'

// WalletConnect Project ID - you can get this from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'your-project-id'

export const config = createConfig({
  chains: [sepolia, mainnet],
  connectors: [
    metaMask({
      dappMetadata: {
        name: 'GigPeek',
        url: 'https://gigpeek.app',
        iconUrl: 'https://gigpeek.app/icon.png',
      },
    }),
    walletConnect({ 
      projectId,
      metadata: {
        name: 'GigPeek',
        description: 'Decentralized gig economy platform with escrow payments',
        url: 'https://gigpeek.app',
        icons: ['https://gigpeek.app/icon.png']
      }
    }),
    coinbaseWallet({
      appName: 'GigPeek',
      appLogoUrl: 'https://gigpeek.app/icon.png',
    }),
    injected({ target: 'metaMask' }),
  ],
  transports: {
    [sepolia.id]: http(`https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY || 'demo'}`),
    [mainnet.id]: http(`https://mainnet.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY || 'demo'}`),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
