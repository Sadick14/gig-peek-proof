import { createContext, useContext, useState, ReactNode } from "react";

interface Deal {
  id: string;
  contractorAddress: string;
  description: string;
  amount: string;
  status: 'waiting_proof' | 'proof_submitted' | 'completed';
  createdAt: Date;
  proofHash?: string;
}

interface User {
  address: string;
  isConnected: boolean;
}

interface AppContextType {
  user: User;
  deals: Deal[];
  connectWallet: (address: string) => void;
  addDeal: (deal: Deal) => void;
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({ address: "", isConnected: false });
  const [deals, setDeals] = useState<Deal[]>([]);

  const connectWallet = (address: string) => {
    setUser({ address, isConnected: true });
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
      connectWallet,
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