import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clock, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

const ActiveDeals = () => {
  const { deals, updateDeal } = useApp();
  const { toast } = useToast();

  const activeDeals = deals.filter(deal => deal.status !== 'completed');
  const waitingProofDeals = activeDeals.filter(deal => deal.status === 'waiting_proof');
  const proofSubmittedDeals = activeDeals.filter(deal => deal.status === 'proof_submitted');

  const handleReleasePayment = (dealId: string) => {
    updateDeal(dealId, { status: 'completed' });
    toast({
      title: "Payment Released",
      description: "Funds have been sent to the contractor.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting_proof':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Waiting for Proof</Badge>;
      case 'proof_submitted':
        return <Badge variant="default"><AlertCircle className="w-3 h-3 mr-1" />Proof Submitted</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (activeDeals.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-2">Active Deals</h1>
        <p className="text-muted-foreground mb-8">You have no active deals</p>
        <Card className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <p className="text-muted-foreground">
            Create your first deal to get started with secure gig work
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Active Deals</h1>
        <p className="text-muted-foreground">
          Manage your ongoing gig contracts and payments
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Active ({activeDeals.length})</TabsTrigger>
          <TabsTrigger value="waiting">Awaiting Proof ({waitingProofDeals.length})</TabsTrigger>
          <TabsTrigger value="submitted">Proof Submitted ({proofSubmittedDeals.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {activeDeals.map((deal) => (
            <Card key={deal.id} className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Deal #{deal.id}</h3>
                    {getStatusBadge(deal.status)}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    Contractor: {deal.contractorAddress.slice(0, 8)}...{deal.contractorAddress.slice(-6)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{deal.amount} ETH</p>
                  <p className="text-xs text-muted-foreground">
                    Created {deal.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
                {deal.description}
              </p>

              {deal.status === 'proof_submitted' && (
                <div className="space-y-3">
                  <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                    <p className="text-sm font-medium text-success">✅ Proof Submitted</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      Hash: {deal.proofHash}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleReleasePayment(deal.id)}
                    className="w-full bg-success text-success-foreground hover:bg-success/90"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Release Payment ({deal.amount} ETH)
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="waiting" className="space-y-4">
          {waitingProofDeals.map((deal) => (
            <Card key={deal.id} className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Deal #{deal.id}</h3>
                    {getStatusBadge(deal.status)}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    Contractor: {deal.contractorAddress.slice(0, 8)}...{deal.contractorAddress.slice(-6)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{deal.amount} ETH</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                {deal.description}
              </p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {proofSubmittedDeals.map((deal) => (
            <Card key={deal.id} className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Deal #{deal.id}</h3>
                    {getStatusBadge(deal.status)}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono">
                    Contractor: {deal.contractorAddress.slice(0, 8)}...{deal.contractorAddress.slice(-6)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{deal.amount} ETH</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
                {deal.description}
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm font-medium text-success">✅ Proof Submitted</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    Hash: {deal.proofHash}
                  </p>
                </div>
                <Button
                  onClick={() => handleReleasePayment(deal.id)}
                  className="w-full bg-success text-success-foreground hover:bg-success/90"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Release Payment ({deal.amount} ETH)
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActiveDeals;