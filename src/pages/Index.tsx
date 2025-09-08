import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MultiWalletConnection } from "@/components/ui/multi-wallet-connection";
import { 
  Eye, 
  Shield, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Users,
  DollarSign,
  ChevronRight,
  Globe,
  Lock,
  TrendingUp,
  Briefcase,
  Clock
} from "lucide-react";
import { useApp } from "@/context/AppContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, connectWallet } = useApp();

  const handleWalletConnect = (address: string) => {
    connectWallet(address);
    if (address) {
      navigate('/dashboard');
    }
  };

  // If user is already connected, redirect to dashboard
  if (user.isConnected) {
    navigate('/dashboard');
    return null;
  }

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
                <p className="text-xs text-muted-foreground">Web3 Freelance Marketplace</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
                <a href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Stats</a>
              </nav>
              <MultiWalletConnection onConnect={handleWalletConnect} />
            </div>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
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
                Web3 Freelance{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Marketplace
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Find work, hire talent, and get paid instantly. One unified platform for both clients and contractors
                with built-in escrow, cryptographic proofs, and zero platform fees.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <MultiWalletConnection 
                  onConnect={handleWalletConnect}
                  className="px-8 py-6 h-auto text-lg group bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80"
                />
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
                <h3 className="text-2xl font-bold mb-4">Unified Dashboard</h3>
                <p className="text-muted-foreground">
                  One platform for everything. Browse gigs, create deals, manage work, and track earnings all in one place.
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
                Simple, secure, and transparent process in one unified platform
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              {/* For Everyone */}
              <div>
                <h3 className="text-3xl font-bold mb-8 text-center">One Platform, Every Role</h3>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Connect & Browse</h4>
                      <p className="text-muted-foreground">Connect your wallet and browse available gigs or post new opportunities</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Work & Create</h4>
                      <p className="text-muted-foreground">Accept gigs or create deals with secure escrow protection</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Earn & Pay</h4>
                      <p className="text-muted-foreground">Submit proofs, release payments, and track your earnings</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-3xl font-bold mb-8 text-center">Why Choose GigPeek</h3>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Zero Platform Fees</h4>
                      <p className="text-muted-foreground">Keep 100% of your earnings with no middleman fees</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Instant Payments</h4>
                      <p className="text-muted-foreground">Get paid immediately when work is approved</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary font-bold">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2">Global Access</h4>
                      <p className="text-muted-foreground">Work with anyone, anywhere in the world</p>
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
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to revolutionize your{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  freelance career
                </span>?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                Join the future of work. Connect your wallet and start earning or hiring today.
              </p>
              <MultiWalletConnection 
                onConnect={handleWalletConnect}
                className="bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 transition-all duration-300 px-12 py-6 h-auto text-xl"
              />
            </div>
          </div>
        </section>

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
                    <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      GigPeek
                    </h1>
                    <p className="text-xs text-muted-foreground">Web3 Freelance Marketplace</p>
                  </div>
                </div>
                <p className="text-muted-foreground max-w-md">
                  The first truly decentralized freelance marketplace. Zero fees, instant payments, 
                  cryptographic proofs, and global access.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Platform</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a></li>
                  <li><a href="#stats" className="hover:text-foreground transition-colors">Stats</a></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Resources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
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