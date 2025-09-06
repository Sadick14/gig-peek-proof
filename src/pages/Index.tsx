import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { WalletConnection } from "@/components/ui/wallet-connection";
import { Eye, Briefcase, Wrench } from "lucide-react";
import { useApp } from "@/context/AppContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, connectWallet } = useApp();
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleWalletConnect = (address: string) => {
    connectWallet(address);
    setShowRoleSelection(true);
  };

  const handleRoleSelect = (role: 'client' | 'contractor') => {
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-glow/50">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  GigPeek
                </h1>
                <p className="text-xs text-muted-foreground">Secure Web3 Gigs</p>
              </div>
            </div>
            <WalletConnection
              onConnect={handleWalletConnect}
              isConnected={user.isConnected}
              address={user.address}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20">
        {!user.isConnected ? (
          /* Hero Section */
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                How will you use{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  GigPeek
                </span>{" "}
                today?
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect your wallet to access the secure Web3 freelancing platform
              </p>
            </div>
          </div>
        ) : showRoleSelection ? (
          /* Role Selection */
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Choose Your Role</h2>
              <p className="text-xl text-muted-foreground">
                Select how you'll be using GigPeek in this session
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <Card 
                className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer group"
                onClick={() => handleRoleSelect('client')}
              >
                <div className="text-center">
                  <div className="p-4 bg-primary/10 rounded-xl w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <Briefcase className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">I am a Client</h3>
                  <p className="text-muted-foreground mb-6">
                    Hire and manage gigs. Create deals, escrow funds, and release payments.
                  </p>
                  <Button className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80">
                    Enter Client Dashboard
                  </Button>
                </div>
              </Card>

              <Card 
                className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer group"
                onClick={() => handleRoleSelect('contractor')}
              >
                <div className="text-center">
                  <div className="p-4 bg-primary/10 rounded-xl w-fit mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    <Wrench className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">I am a Contractor</h3>
                  <p className="text-muted-foreground mb-6">
                    Find and complete gigs. Submit proof of work and get paid securely.
                  </p>
                  <Button className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80">
                    Enter Contractor Dashboard
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Index;
