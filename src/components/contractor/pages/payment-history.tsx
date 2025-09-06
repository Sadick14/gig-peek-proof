import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, DollarSign, ExternalLink, Copy } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { toast } from "@/hooks/use-toast";

const PaymentHistory = () => {
  const { deals, user } = useApp();
  
  const myCompletedGigs = deals.filter(deal => 
    deal.contractorAddress.toLowerCase() === user.address.toLowerCase() &&
    deal.status === 'completed'
  );

  const totalEarnings = myCompletedGigs.reduce((sum, deal) => sum + parseFloat(deal.amount || '0'), 0);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const openEtherscan = (hash: string) => {
    window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank');
  };

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
          <div className="flex-1">
            <p className="text-3xl font-bold text-success">{totalEarnings.toFixed(4)} ETH</p>
            <p className="text-muted-foreground">Total Earnings from {myCompletedGigs.length} gigs</p>
            <p className="text-sm text-muted-foreground">
              ≈ ${(totalEarnings * 3500).toFixed(2)} USD <span className="text-xs opacity-60">(approx.)</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Average per gig</p>
            <p className="text-xl font-semibold text-success">
              {myCompletedGigs.length > 0 ? (totalEarnings / myCompletedGigs.length).toFixed(4) : '0.0000'} ETH
            </p>
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
              <div className="space-y-3">
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-success">Proof Hash</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(gig.proofHash!, 'Proof hash')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    {gig.proofHash}
                  </p>
                </div>

                {/* Transaction Details */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Payment Transaction</p>
                    {gig.transactionHash && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEtherscan(gig.transactionHash!)}
                        className="h-6 text-xs"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                  {gig.transactionHash ? (
                    <p className="text-xs text-muted-foreground font-mono break-all">
                      {gig.transactionHash}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Transaction hash not available
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentHistory;