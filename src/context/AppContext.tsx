import { createContext, useContext, useState, ReactNode } from "react";

interface Deal {
  id: string;
  contractorAddress: string;
  title?: string;
  description: string;
  amount: string;
  deadline?: string;
  status: 'active' | 'waiting_proof' | 'proof_submitted' | 'completed';
  createdAt: Date;
  proofHash?: string;
  txHash?: string;
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
  connectWallet: (address: string) => void;
  setUserRole: (role: UserRole) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({ address: "", isConnected: false });
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  
  // Sample deals for demo purposes
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: 'deal_1734567890',
      contractorAddress: '0x742d35Cc6644C4532B69d78af923aF3Cfd3abb3e',
      title: 'React Authentication Component',
      description: 'Create a React component for user authentication with wallet connection',
      amount: '0.1',
      status: 'active',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    },
    {
      id: 'deal_1734567891',
      contractorAddress: '0x8ba1f109551bD432803012645Hac136c5603a3',
      title: 'Smart Contract Development',
      description: 'Design and implement a smart contract for escrow payments',
      amount: '0.25',
      status: 'proof_submitted',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      proofHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
    },
    {
      id: 'deal_1734567892',
      contractorAddress: '0x742d35Cc6644C4532B69d78af923aF3Cfd3abb3e',
      title: 'Landing Page Design',
      description: 'Build a responsive landing page with Tailwind CSS',
      amount: '0.05',
      status: 'completed',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // completed 2 days ago
      proofHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
    }
  ]);

  const connectWallet = (address: string) => {
    if (address) {
      setUser({ address, isConnected: true });
    } else {
      // Handle disconnection
      setUser({ address: "", isConnected: false });
      setCurrentRole(null); // Reset role when disconnecting
    }
  };

  const setUserRole = (role: UserRole) => {
    setCurrentRole(role);
  };

  const addDeal = (deal: Deal) => {
    setDeals(prev => [...prev, deal]);
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
      connectWallet,
      setUserRole,
      addDeal,
      updateDeal
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