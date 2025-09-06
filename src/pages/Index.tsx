import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletConnection } from "@/components/ui/wallet-connection";
import { 
  Eye, 
  Briefcase, 
  Wrench, 
  Shield, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Users,
  DollarSign,
  Clock,
  ChevronRight,
  Globe,
  Lock,
  TrendingUp
} from "lucide-react";
import { useApp } from "@/context/AppContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, connectWallet, setUserRole, currentRole } = useApp();
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleWalletConnect = (address: string) => {
    connectWallet(address);
    if (address) {
      setShowRoleSelection(true);
    } else {
      // Handle disconnection
      setShowRoleSelection(false);
    }
  };

  const handleRoleSelect = (role: 'client' | 'contractor') => {
    setUserRole(role);
    navigate('/dashboard');
  };

  // If user is already connected and has a role, show role selection anyway
  const shouldShowRoleSelection = user.isConnected && (showRoleSelection || !currentRole);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
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
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
                <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stats</a>
              </nav>
              <WalletConnection
                onConnect={handleWalletConnect}
                isConnected={user.isConnected}
                address={user.address}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {!user.isConnected ? (
          <>
            {/* Hero Section */}
            <section className="relative">
              {/* Background Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
              
              <div className="relative container mx-auto px-6 py-24">
                <div className="max-w-6xl mx-auto text-center">
                  <Badge variant="secondary" className="mb-6 px-4 py-2">
                    <Globe className="w-4 h-4 mr-2" />
                    Live on Sepolia Testnet
                  </Badge>
                  
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                    The Future of{" "}
                    <span className="bg-gradient-primary bg-clip-text text-transparent">
                      Freelance Work
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                    Secure, transparent, and trustless gig economy powered by blockchain technology. 
                    Escrow payments, cryptographic proofs, and smart contracts ensure fair work for everyone.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                    <Button
                      size="lg"
                      className="bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 transition-all duration-300 px-8 py-6 h-auto text-lg group"
                    >
                      Connect Wallet to Start
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="px-8 py-6 h-auto text-lg"
                      onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Learn More
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>

                  {/* Trust Indicators */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">100%</div>
                      <div className="text-sm text-muted-foreground">Secure</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">0%</div>
                      <div className="text-sm text-muted-foreground">Platform Fees</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                      <div className="text-sm text-muted-foreground">Available</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">∞</div>
                      <div className="text-sm text-muted-foreground">Scalable</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-muted/30">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Why Choose <span className="bg-gradient-primary bg-clip-text text-transparent">GigPeek</span>?
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Built on blockchain technology to solve the biggest problems in freelance work
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <Card className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300 group">
                    <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Escrow Protection</h3>
                    <p className="text-muted-foreground">
                      Funds are held in smart contract escrow until work is completed and verified. No more payment disputes.
                    </p>
                  </Card>

                  <Card className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300 group">
                    <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                      <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Cryptographic Proofs</h3>
                    <p className="text-muted-foreground">
                      Submit tamper-proof work evidence with cryptographic hashing. Your work is verifiable and secure.
                    </p>
                  </Card>

                  <Card className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300 group">
                    <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Instant Payments</h3>
                    <p className="text-muted-foreground">
                      Get paid immediately when work is approved. No waiting for bank transfers or payment processing.
                    </p>
                  </Card>

                  <Card className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300 group">
                    <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Global Access</h3>
                    <p className="text-muted-foreground">
                      Work with anyone, anywhere in the world. No borders, no payment restrictions, just pure opportunity.
                    </p>
                  </Card>

                  <Card className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300 group">
                    <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                      <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Zero Platform Fees</h3>
                    <p className="text-muted-foreground">
                      Keep 100% of your earnings. Smart contracts handle everything automatically without middleman fees.
                    </p>
                  </Card>

                  <Card className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300 group">
                    <div className="p-3 bg-primary/10 rounded-xl w-fit mb-6 group-hover:bg-primary/20 transition-colors">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Dispute Resolution</h3>
                    <p className="text-muted-foreground">
                      Built-in dispute mechanism ensures fair resolution when disagreements arise. Transparent and immutable.
                    </p>
                  </Card>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Simple, secure, and transparent process for both clients and contractors
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16">
                  {/* For Clients */}
                  <div>
                    <h3 className="text-3xl font-bold mb-8 text-center">For Clients</h3>
                    <div className="space-y-8">
                      <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Create a Deal</h4>
                          <p className="text-muted-foreground">Set project details, deadline, and escrow ETH for payment</p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Monitor Progress</h4>
                          <p className="text-muted-foreground">Track your project status and communicate with contractors</p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Review & Release</h4>
                          <p className="text-muted-foreground">Verify delivered work and release escrowed payment</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* For Contractors */}
                  <div>
                    <h3 className="text-3xl font-bold mb-8 text-center">For Contractors</h3>
                    <div className="space-y-8">
                      <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold">
                          1
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Browse Deals</h4>
                          <p className="text-muted-foreground">Find projects that match your skills and interests</p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold">
                          2
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Complete Work</h4>
                          <p className="text-muted-foreground">Deliver high-quality work according to requirements</p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold">
                          3
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold mb-2">Submit Proof</h4>
                          <p className="text-muted-foreground">Upload cryptographic proof and get paid instantly</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section id="stats" className="py-24 bg-muted/30">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Scale</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Deployed on Sepolia testnet with enterprise-grade security and performance
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <Card className="p-8 text-center bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
                    <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">19/19</div>
                    <div className="text-muted-foreground">Smart Contract Tests Passing</div>
                  </Card>

                  <Card className="p-8 text-center bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
                    <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">&lt; 1s</div>
                    <div className="text-muted-foreground">Transaction Confirmation</div>
                  </Card>

                  <Card className="p-8 text-center bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
                    <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                      <Globe className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2">100%</div>
                    <div className="text-muted-foreground">Decentralized & Open Source</div>
                  </Card>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
              <div className="relative container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to Transform Your{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Freelance Career
                  </span>?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                  Join the future of work today. Connect your wallet and start your first secure gig.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 transition-all duration-300 px-12 py-6 h-auto text-xl"
                >
                  Get Started Now
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </section>
          </>
        ) : shouldShowRoleSelection ? (
          /* Role Selection */
          <section className="py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                  <Badge variant="secondary" className="mb-6 px-4 py-2">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Wallet Connected Successfully
                  </Badge>
                  <h2 className="text-5xl md:text-6xl font-bold mb-6">Choose Your Role</h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Select how you'll be using GigPeek in this session. You can switch roles anytime.
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                  <Card 
                    className="p-10 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer group hover:scale-105 transform"
                    onClick={() => handleRoleSelect('client')}
                  >
                    <div className="text-center">
                      <div className="p-6 bg-primary/10 rounded-2xl w-fit mx-auto mb-8 group-hover:bg-primary/20 transition-colors group-hover:scale-110 transform">
                        <Briefcase className="w-16 h-16 text-primary" />
                      </div>
                      <h3 className="text-3xl font-bold mb-6">I am a Client</h3>
                      <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                        Post projects, manage contractors, and make secure payments using blockchain escrow.
                      </p>
                      <div className="space-y-3 mb-8 text-sm text-left">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>Create and manage deals</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>Secure escrow payments</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                          <span>Track project progress</span>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 py-4 text-lg group-hover:scale-105 transform transition-all">
                        Enter Client Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </Card>

                  <Card 
                    className="p-10 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300 cursor-pointer group hover:scale-105 transform"
                    onClick={() => handleRoleSelect('contractor')}
                  >
                    <div className="text-center">
                      <div className="p-6 bg-secondary/10 rounded-2xl w-fit mx-auto mb-8 group-hover:bg-secondary/20 transition-colors group-hover:scale-110 transform">
                        <Wrench className="w-16 h-16 text-secondary" />
                      </div>
                      <h3 className="text-3xl font-bold mb-6">I am a Contractor</h3>
                      <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                        Find projects, submit work proofs, and receive instant payments when approved.
                      </p>
                      <div className="space-y-3 mb-8 text-sm text-left">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                          <span>Browse available gigs</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                          <span>Submit cryptographic proofs</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                          <span>Instant payment release</span>
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-glow hover:shadow-glow/80 py-4 text-lg group-hover:scale-105 transform transition-all">
                        Enter Contractor Dashboard
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="text-center mt-12">
                  <p className="text-sm text-muted-foreground">
                    Connected to: <span className="font-mono text-primary">{user.address}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Footer */}
        <footer className="border-t border-border/50 bg-muted/30">
          <div className="container mx-auto px-6 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-primary rounded-xl shadow-glow/50">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      GigPeek
                    </h3>
                    <p className="text-xs text-muted-foreground">Secure Web3 Gigs</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4 max-w-md">
                  The future of freelance work is here. Secure, transparent, and decentralized gig economy powered by blockchain technology.
                </p>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Globe className="w-3 h-3 mr-1" />
                    Sepolia Testnet
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified Contract
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a></li>
                  <li><a href="#stats" className="hover:text-foreground transition-colors">Statistics</a></li>
                  <li><a href="https://sepolia.etherscan.io/address/0xF140271F8C6CF820aB2c9F58ecE55dE273319A95" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Smart Contract</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="https://docs.soliditylang.org/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Solidity Docs</a></li>
                  <li><a href="https://hardhat.org/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Hardhat</a></li>
                  <li><a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Sepolia Faucet</a></li>
                  <li><a href="https://metamask.io/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">MetaMask</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border/50 mt-8 pt-8 text-center">
              <p className="text-sm text-muted-foreground">
                © 2025 GigPeek. Built with 💙 for the decentralized future.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
