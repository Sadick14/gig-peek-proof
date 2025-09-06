import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/landing/hero";
import { CreateDeal } from "@/components/client/create-deal";
import { MyGigs } from "@/components/contractor/my-gigs";

interface Deal {
  id: string;
  contractorAddress: string;
  description: string;
  amount: string;
  status: 'waiting_proof' | 'proof_submitted' | 'completed';
  createdAt: Date;
  proofHash?: string;
}

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("client");
  const [deals, setDeals] = useState<Deal[]>([]);

  const handleWalletConnect = (address: string) => {
    setIsConnected(true);
    setWalletAddress(address);
  };

  const handleDealCreated = (deal: Deal) => {
    setDeals(prev => [...prev, deal]);
  };

  const handleProofSubmitted = (dealId: string, proofHash: string) => {
    setDeals(prev => 
      prev.map(deal => 
        deal.id === dealId 
          ? { ...deal, status: 'proof_submitted' as const, proofHash }
          : deal
      )
    );
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onConnect={handleWalletConnect}
          isConnected={isConnected}
          address={walletAddress}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <Hero onGetStarted={() => {}} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onConnect={handleWalletConnect}
        isConnected={isConnected}
        address={walletAddress}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main className="container mx-auto px-6 py-8">
        {activeTab === "client" && (
          <CreateDeal 
            onDealCreated={handleDealCreated}
            deals={deals}
          />
        )}
        
        {activeTab === "contractor" && (
          <MyGigs 
            deals={deals}
            onProofSubmitted={handleProofSubmitted}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
