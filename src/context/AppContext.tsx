import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAccount } from 'wagmi';
import { wagmiWeb3Service } from '@/services/wagmiWeb3Service';

interface Deal {
  id: string;
  contractorAddress: string;
  clientAddress?: string; // Add client address for filtering
  title?: string;
  description: string;
  amount: string;
  deadline?: string;
  status: 'active' | 'waiting_proof' | 'proof_submitted' | 'completed';
  createdAt: Date;
  proofHash?: string;
  txHash?: string;
  transactionHash?: string; // For payment release transaction
  userRole?: 'client' | 'contractor'; // Add user role for filtering
}

interface User {
  address: string;
  isConnected: boolean;
}

type UserRole = 'client' | 'contractor' | null;

interface AppContextType {
  user: User;
  deals: Deal[];
  currentRole: UserRole;
  isLoadingDeals: boolean;
  connectWallet: (address: string) => void;
  setUserRole: (role: UserRole) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
  refreshDeals: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(false);
  
  // Use Wagmi's useAccount hook for wallet connection state
  const { address, isConnected } = useAccount();
  
  // Create user object from Wagmi state
  const user = {
    address: address || "",
    isConnected: isConnected
  };

  // Function to fetch deals from blockchain
  const refreshDeals = async () => {
    if (!isConnected || !address) {
      setDeals([]);
      return;
    }

    setIsLoadingDeals(true);
    try {
      await wagmiWeb3Service.initialize();
      const blockchainDeals = await wagmiWeb3Service.getAllDealsForUser(address);
      setDeals(blockchainDeals);
    } catch (error) {
      console.error('Error fetching deals from blockchain:', error);
      // Keep existing deals if fetch fails
    } finally {
      setIsLoadingDeals(false);
    }
  };

  // Fetch deals when user connects or changes
  useEffect(() => {
    if (isConnected && address) {
      refreshDeals();
    } else {
      setDeals([]);
    }
  }, [isConnected, address]);

  // Legacy connect function for compatibility (Wagmi handles connection automatically)
  const connectWallet = (walletAddress: string) => {
    // This is now handled by Wagmi, but we keep for compatibility
    // The actual connection is managed by MultiWalletConnection component
    console.log('Wallet connection handled by Wagmi:', walletAddress);
  };

  const setUserRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const addDeal = (deal: Deal) => {
    setDeals(prev => [...prev, deal]);
    // Also refresh deals to get the latest from blockchain
    refreshDeals();
  };

  const updateDeal = (dealId: string, updates: Partial<Deal>) => {
    setDeals(prev => 
      prev.map(deal => 
        deal.id === dealId ? { ...deal, ...updates } : deal
      )
    );
  };

  return (
    <AppContext.Provider value={{
      user,
      deals,
      currentRole,
      isLoadingDeals,
      connectWallet,
      setUserRole,
      addDeal,
      updateDeal,
      refreshDeals
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}