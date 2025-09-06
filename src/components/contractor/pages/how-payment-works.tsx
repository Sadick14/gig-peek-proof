import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Wallet, 
  FileCheck, 
  CheckCircle, 
  DollarSign,
  Shield,
  Clock,
  Hash,
  ExternalLink 
} from "lucide-react";

const HowPaymentWorks = () => {
  const openEtherscan = () => {
    window.open('https://sepolia.etherscan.io/address/0xF140271F8C6CF820aB2c9F58ecE55dE273319A95', '_blank');
  };

  const steps = [
    {
      icon: Wallet,
      title: "Client Creates Deal",
      description: "Client creates a gig deal and funds are automatically escrowed in our smart contract",
      status: "Funds Secured",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
    {
      icon: FileCheck,
      title: "You Submit Proof",
      description: "Complete the work and submit cryptographic proof via blockchain transaction",
      status: "Work Verified",
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20"
    },
    {
      icon: CheckCircle,
      title: "Client Approves",
      description: "Client reviews your work and releases payment from escrow",
      status: "Payment Released",
      color: "bg-green-500/10 text-green-600 border-green-500/20"
    },
    {
      icon: DollarSign,
      title: "You Get Paid",
      description: "ETH is automatically transferred to your connected wallet",
      status: "Funds Received",
      color: "bg-success/10 text-success border-success/20"
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Escrow Protection",
      description: "Funds are held securely in smart contract until work is completed"
    },
    {
      icon: Hash,
      title: "Cryptographic Proof",
      description: "Your work is verified using blockchain-based proof of completion"
    },
    {
      icon: Clock,
      title: "Instant Payments",
      description: "Receive ETH directly to your wallet immediately upon approval"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">How Payment Works</h1>
        <p className="text-muted-foreground">
          Understand the secure, blockchain-powered payment process for contractors
        </p>
      </div>

      {/* Smart Contract Info */}
      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-1">Secured by Smart Contract</h3>
            <p className="text-muted-foreground">
              All payments are handled by our verified smart contract on Ethereum Sepolia testnet
            </p>
          </div>
          <Button variant="outline" onClick={openEtherscan} className="gap-2">
            <ExternalLink className="w-4 h-4" />
            View Contract
          </Button>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Contract Address</p>
          <p className="font-mono text-sm">0xF140271F8C6CF820aB2c9F58ecE55dE273319A95</p>
        </div>
      </Card>

      {/* Payment Process Steps */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Payment Process</h2>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {index + 1}. {step.title}
                        </h3>
                        <Badge variant="outline" className={step.color}>
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Security Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
        <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">When do I get paid?</h3>
            <p className="text-muted-foreground text-sm">
              You receive payment immediately after the client releases funds from escrow. 
              The ETH is transferred directly to your connected wallet via blockchain transaction.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">What if the client doesn't release payment?</h3>
            <p className="text-muted-foreground text-sm">
              Our smart contract includes built-in dispute resolution mechanisms. 
              If work is submitted correctly, the funds can be released automatically after a timeout period.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Are there any fees?</h3>
            <p className="text-muted-foreground text-sm">
              GigPeek doesn't charge platform fees. You only pay standard Ethereum gas fees 
              for blockchain transactions, which are typically very low on Sepolia testnet.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Can I track my payments?</h3>
            <p className="text-muted-foreground text-sm">
              Yes! Every payment generates a blockchain transaction hash that you can 
              view on Etherscan for complete transparency and verification.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HowPaymentWorks;
