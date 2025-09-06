import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Hash, Upload, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Deal {
  id: string;
  contractorAddress: string;
  description: string;
  amount: string;
  status: 'waiting_proof' | 'proof_submitted' | 'completed';
  createdAt: Date;
  proofHash?: string;
}

interface MyGigsProps {
  deals: Deal[];
  onProofSubmitted: (dealId: string, proofHash: string) => void;
}

export function MyGigs({ deals, onProofSubmitted }: MyGigsProps) {
  const [searchDealId, setSearchDealId] = useState("");
  const [foundDeal, setFoundDeal] = useState<Deal | null>(null);
  const [proofPreview, setProofPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSearchDeal = () => {
    if (!searchDealId) {
      toast({
        title: "Enter Deal ID",
        description: "Please enter a deal ID to search.",
        variant: "destructive",
      });
      return;
    }

    const deal = deals.find(d => d.id === searchDealId);
    if (deal) {
      setFoundDeal(deal);
      toast({
        title: "Deal Found!",
        description: `Deal details loaded successfully.`,
      });
    } else {
      toast({
        title: "Deal Not Found",
        description: "No deal found with this ID. Please check and try again.",
        variant: "destructive",
      });
    }
  };

  const generateProofHash = (preview: string) => {
    // Simulate hash generation (in real app, this would use crypto libraries)
    const hash = `0x${Math.random().toString(36).substr(2, 64)}`;
    return hash;
  };

  const handleSubmitProof = async () => {
    if (!proofPreview || !foundDeal) return;

    setIsSubmitting(true);

    // Simulate proof submission
    setTimeout(() => {
      const proofHash = generateProofHash(proofPreview);
      onProofSubmitted(foundDeal.id, proofHash);
      
      toast({
        title: "Proof Submitted Successfully!",
        description: "Your proof has been recorded on the blockchain.",
      });

      setProofPreview("");
      setIsSubmitting(false);
    }, 2000);
  };

  const myActiveGigs = deals.filter(deal => 
    deal.status !== 'completed' && deal.contractorAddress
  );

  return (
    <div className="space-y-8">
      {/* Search for Deal */}
      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">Find Your Gig</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="dealId">Deal ID</Label>
            <div className="flex gap-2">
              <Input
                id="dealId"
                placeholder="Enter Deal ID from client..."
                value={searchDealId}
                onChange={(e) => setSearchDealId(e.target.value)}
                className="font-mono"
              />
              <Button onClick={handleSearchDeal} variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Found Deal Details */}
      {foundDeal && (
        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-success/10 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <h3 className="text-xl font-semibold">Deal Details</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Deal ID</h4>
              <p className="font-mono text-lg">{foundDeal.id}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Payment Amount</h4>
              <p className="text-2xl font-bold text-primary">{foundDeal.amount} ETH</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Work Description</h4>
            <p className="text-foreground bg-muted/50 p-3 rounded-lg">{foundDeal.description}</p>
          </div>

          {foundDeal.status === 'waiting_proof' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="proof">Work Preview/Proof</Label>
                <Textarea
                  id="proof"
                  placeholder="Enter a preview of your work or description for proof generation..."
                  value={proofPreview}
                  onChange={(e) => setProofPreview(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This will be hashed cryptographically as proof of your completed work.
                </p>
              </div>

              <Button
                onClick={handleSubmitProof}
                disabled={!proofPreview || isSubmitting}
                className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 transition-all duration-300"
              >
                <Hash className="w-4 h-4 mr-2" />
                {isSubmitting ? "Submitting Proof..." : "Submit Cryptographic Proof"}
              </Button>
            </div>
          )}

          {foundDeal.status === 'proof_submitted' && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <p className="font-medium text-warning">⏳ Proof Submitted</p>
              <p className="text-sm text-muted-foreground">
                Waiting for client to release payment. Hash: {foundDeal.proofHash}
              </p>
            </div>
          )}

          {foundDeal.status === 'completed' && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <p className="font-medium text-success">✅ Gig Completed</p>
              <p className="text-sm text-muted-foreground">
                Payment has been released to your wallet!
              </p>
            </div>
          )}
        </Card>
      )}

      {/* My Active Gigs */}
      {myActiveGigs.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">My Active Gigs</h3>
          <div className="space-y-4">
            {myActiveGigs.map((deal) => (
              <Card key={deal.id} className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">Gig #{deal.id}</h4>
                    <p className="text-sm text-muted-foreground">
                      {deal.status === 'waiting_proof' && '⏳ Waiting for your proof'}
                      {deal.status === 'proof_submitted' && '✅ Proof submitted, awaiting payment'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{deal.amount} ETH</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{deal.description}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}