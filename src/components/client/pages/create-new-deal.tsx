import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Wallet, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const CreateNewDeal = () => {
  const [contractorAddress, setContractorAddress] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { addDeal } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      const newDeal = {
        id: `DEAL_${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        contractorAddress,
        description,
        amount,
        status: 'waiting_proof' as const,
        createdAt: new Date(),
      };

      addDeal(newDeal);
      
      toast({
        title: "Deal Created Successfully!",
        description: `Deal ID: ${newDeal.id}. Share this with your contractor.`,
      });

      // Reset form and navigate to active deals
      setContractorAddress("");
      setDescription("");
      setAmount("");
      setIsCreating(false);
      navigate('/client/active');
    }, 2000);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Deal</h1>
        <p className="text-muted-foreground">
          Set up a new gig with secure escrow payment
        </p>
      </div>

      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Plus className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Deal Details</h2>
        </div>

        <div className="space-y-6">
          <div>
            <Label htmlFor="contractor">Contractor's Wallet Address</Label>
            <Input
              id="contractor"
              placeholder="0x742d35Cc6635C0532925a3b8D40C8C3F8b29B2C1"
              value={contractorAddress}
              onChange={(e) => setContractorAddress(e.target.value)}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the Ethereum wallet address of the contractor
            </p>
          </div>

          <div>
            <Label htmlFor="description">Work Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the work to be completed in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Be specific about deliverables, deadlines, and requirements
            </p>
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
            <p className="text-xs text-muted-foreground mt-1">
              This amount will be locked in escrow until work is completed
            </p>
          </div>

          <Button
            onClick={handleCreateDeal}
            disabled={isCreating}
            className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 transition-all duration-300 h-12"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {isCreating ? "Creating Deal..." : `Fund Escrow & Create Deal (${amount || '0'} ETH)`}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateNewDeal;