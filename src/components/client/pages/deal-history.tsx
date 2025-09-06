import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar } from "lucide-react";
import { useApp } from "@/context/AppContext";

const DealHistory = () => {
  const { deals } = useApp();
  const completedDeals = deals.filter(deal => deal.status === 'completed');

  if (completedDeals.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-2">Deal History</h1>
        <p className="text-muted-foreground mb-8">No completed deals yet</p>
        <Card className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <p className="text-muted-foreground">
            Your completed deals will appear here once payments are released
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Deal History</h1>
        <p className="text-muted-foreground">
          View all your completed gig contracts and payments
        </p>
      </div>

      <div className="space-y-4">
        {completedDeals.map((deal) => (
          <Card key={deal.id} className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">Deal #{deal.id}</h3>
                  <Badge variant="outline" className="text-success border-success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  Contractor: {deal.contractorAddress.slice(0, 8)}...{deal.contractorAddress.slice(-6)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-success">{deal.amount} ETH</p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {deal.createdAt.toLocaleDateString()}
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
              {deal.description}
            </p>

            {deal.proofHash && (
              <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                <p className="text-sm font-medium text-success">Proof Hash</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {deal.proofHash}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DealHistory;