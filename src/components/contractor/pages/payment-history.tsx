import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Calendar, DollarSign } from "lucide-react";
import { useApp } from "@/context/AppContext";

const PaymentHistory = () => {
  const { deals, user } = useApp();
  
  const myCompletedGigs = deals.filter(deal => 
    deal.contractorAddress.toLowerCase() === user.address.toLowerCase() &&
    deal.status === 'completed'
  );

  const totalEarnings = myCompletedGigs.reduce((sum, deal) => sum + parseFloat(deal.amount || '0'), 0);

  if (myCompletedGigs.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-2">Payment History</h1>
        <p className="text-muted-foreground mb-8">No payments received yet</p>
        <Card className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <p className="text-muted-foreground">
            Your payment history will appear here once gigs are completed
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Payment History</h1>
        <p className="text-muted-foreground">
          View all your completed gigs and received payments
        </p>
      </div>

      {/* Total Earnings Card */}
      <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-success/10 rounded-lg">
            <DollarSign className="w-8 h-8 text-success" />
          </div>
          <div>
            <p className="text-3xl font-bold text-success">{totalEarnings.toFixed(3)} ETH</p>
            <p className="text-muted-foreground">Total Earnings from {myCompletedGigs.length} gigs</p>
          </div>
        </div>
      </Card>

      {/* Payment History */}
      <div className="space-y-4">
        {myCompletedGigs.map((gig) => (
          <Card key={gig.id} className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">Gig #{gig.id}</h3>
                  <Badge variant="outline" className="text-success border-success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Payment Received
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  Completed {gig.createdAt.toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-success">{gig.amount} ETH</p>
                <p className="text-xs text-muted-foreground">≈ ${(parseFloat(gig.amount) * 2000).toFixed(2)} USD</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg mb-3">
              {gig.description}
            </p>

            {gig.proofHash && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <p className="text-sm font-medium text-success">Proof Hash</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {gig.proofHash}
                </p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;