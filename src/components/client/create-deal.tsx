import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wallet, Plus, Check } from "lucide-react";
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

interface CreateDealProps {
  onDealCreated: (deal: Deal) => void;
  deals: Deal[];
}

export function CreateDeal({ onDealCreated, deals }: CreateDealProps) {
  const [contractorAddress, setContractorAddress] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateDeal = async () => {
    if (!contractorAddress || !description || !amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to create a deal.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    // Simulate transaction
    setTimeout(() => {
      const newDeal: Deal = {
        id: `DEAL_${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        contractorAddress,
        description,
        amount,
        status: 'waiting_proof',
        createdAt: new Date(),
      };

      onDealCreated(newDeal);
      
      toast({
        title: "Deal Created Successfully!",
        description: `Deal ID: ${newDeal.id}. Share this with your contractor.`,
      });

      // Reset form
      setContractorAddress("");
      setDescription("");
      setAmount("");
      setIsCreating(false);
    }, 2000);
  };

  const handleReleasePayment = (dealId: string) => {
    // This would trigger the smart contract to release funds
    toast({
      title: "Payment Released",
      description: "Funds have been sent to the contractor.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Create New Deal */}
      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">Create New Deal</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="contractor">Contractor's Wallet Address</Label>
            <Input
              id="contractor"
              placeholder="0x742d35Cc6635C0532925a3b8D40C8C3F8b29B2C1"
              value={contractorAddress}
              onChange={(e) => setContractorAddress(e.target.value)}
              className="font-mono"
            />
          </div>

          <div>
            <Label htmlFor="description">Work Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the work to be completed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="amount">Payment Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.001"
              placeholder="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button
            onClick={handleCreateDeal}
            disabled={isCreating}
            className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 transition-all duration-300"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isCreating ? "Creating Deal..." : `Fund Escrow (${amount || '0'} ETH)`}
          </Button>
        </div>
      </Card>

      {/* Active Deals */}
      {deals.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Active Deals</h3>
          <div className="space-y-4">
            {deals.map((deal) => (
              <Card key={deal.id} className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">Deal #{deal.id}</h4>
                    <p className="text-sm text-muted-foreground font-mono">
                      Contractor: {deal.contractorAddress.slice(0, 8)}...{deal.contractorAddress.slice(-6)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{deal.amount} ETH</p>
                    <p className="text-xs text-muted-foreground">
                      {deal.status === 'waiting_proof' && 'Waiting for Proof'}
                      {deal.status === 'proof_submitted' && 'Proof Submitted'}
                      {deal.status === 'completed' && 'Completed'}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{deal.description}</p>

                {deal.status === 'proof_submitted' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                      <p className="text-sm font-medium text-success">Proof Submitted</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        Hash: {deal.proofHash}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleReleasePayment(deal.id)}
                      className="w-full bg-success text-success-foreground hover:bg-success/90"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Release Payment
                    </Button>
                  </div>
                )}

                {deal.status === 'completed' && (
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <p className="text-sm font-medium text-success">✅ Deal Completed</p>
                    <p className="text-xs text-muted-foreground">Payment released successfully</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}