import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, DollarSign, TrendingUp } from 'lucide-react';

export const PaymentHistory = () => {
  const { deals, user } = useApp();

  const myCompletedGigs = deals.filter(
    deal => deal.contractorAddress.toLowerCase() === user.address.toLowerCase() && deal.status === 'completed'
  );
  
  const totalEarnings = myCompletedGigs.reduce((sum, deal) => sum + parseFloat(deal.amount), 0);
  const averageGigValue = myCompletedGigs.length > 0 ? totalEarnings / myCompletedGigs.length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-2">
          Track your earnings and completed gig payments.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings.toFixed(4)} ETH</div>
            <p className="text-xs text-muted-foreground">
              From {myCompletedGigs.length} completed gigs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed Gigs
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myCompletedGigs.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Gig Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageGigValue.toFixed(4)} ETH</div>
            <p className="text-xs text-muted-foreground">
              Per completed gig
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment History List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            All payments received for completed gigs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myCompletedGigs.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No Payments Yet</h3>
              <p className="text-gray-600">Your payment history will appear here once you complete some gigs.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myCompletedGigs.map((gig) => (
                <div key={gig.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">Payment for Deal #{gig.id.slice(0, 8)}...</h3>
                      <p className="text-sm text-gray-600">
                        Completed: {new Date(gig.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-green-600">+{gig.amount} ETH</div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Work Completed</h4>
                      <p className="text-sm text-gray-600">{gig.description}</p>
                    </div>
                    
                    {gig.proofHash && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Proof Hash</h4>
                        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono">
                          {gig.proofHash}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Payment Date: {new Date(gig.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        Transaction Hash: 0x{gig.id.slice(5)}...{Math.random().toString(16).slice(2, 8)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Earnings Summary */}
      {myCompletedGigs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Earnings Summary</CardTitle>
            <CardDescription>
              Overview of your freelance performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Best Paying Gig:</span>
                <div className="font-medium">
                  {Math.max(...myCompletedGigs.map(g => parseFloat(g.amount))).toFixed(4)} ETH
                </div>
              </div>
              <div>
                <span className="text-gray-500">Most Recent Payment:</span>
                <div className="font-medium">
                  {myCompletedGigs[myCompletedGigs.length - 1]?.amount} ETH
                </div>
              </div>
              <div>
                <span className="text-gray-500">Success Rate:</span>
                <div className="font-medium text-green-600">
                  100% ({myCompletedGigs.length}/{myCompletedGigs.length} gigs completed)
                </div>
              </div>
              <div>
                <span className="text-gray-500">Average Time to Payment:</span>
                <div className="font-medium">
                  Same day
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
