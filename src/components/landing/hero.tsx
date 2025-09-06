import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Zap, Eye, ArrowRight, CheckCircle } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-web3-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-web3-secondary/10 rounded-full blur-3xl" />

      <section className="relative container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Content */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Secure Gig Work with{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Blockchain Escrow
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              GigPeek revolutionizes freelance work with cryptographic proof submission 
              and smart contract escrow. Get paid securely, work with confidence.
            </p>
          </div>

          {/* CTA Button */}
          <div className="mb-16">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 transition-all duration-300 px-8 py-4 h-auto text-lg group"
            >
              Connect Wallet to Start
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300">
              <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Escrow</h3>
              <p className="text-muted-foreground">
                Funds are locked in smart contracts until work is completed and verified
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300">
              <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cryptographic Proof</h3>
              <p className="text-muted-foreground">
                Submit work previews with cryptographic hashes for secure verification
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card hover:shadow-elegant transition-all duration-300">
              <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Payments</h3>
              <p className="text-muted-foreground">
                Automatic payment release once proof is verified by the client
              </p>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-sm">Ethereum Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-sm">Smart Contract Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-sm">Zero Platform Fees</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}