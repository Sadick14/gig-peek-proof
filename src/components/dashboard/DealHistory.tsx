import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, DollarSign } from 'lucide-react';

export const DealHistory = () => {
  const { deals } = useApp();

  const completedDeals = deals.filter(deal => deal.status === 'completed');
  const totalSpent = completedDeals.reduce((sum, deal) => sum + parseFloat(deal.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Deal History</h1>
        <p className="text-gray-600 mt-2">
          View all your completed and cancelled deals.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed Deals
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedDeals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Spent
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSpent.toFixed(4)} ETH</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average Deal Size
            </CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedDeals.length > 0 ? (totalSpent / completedDeals.length).toFixed(4) : '0.0000'} ETH
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deals List */}
      <Card>
        <CardHeader>
          <CardTitle>All Completed Deals</CardTitle>
          <CardDescription>
            Your transaction history with contractors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completedDeals.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No Completed Deals</h3>
              <p className="text-gray-600">Your deal history will appear here once you complete some deals.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedDeals.map((deal) => (
                <div key={deal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">Deal #{deal.id.slice(0, 8)}...</h3>
                      <p className="text-sm text-gray-600">
                        Contractor: {deal.contractorAddress.slice(0, 6)}...{deal.contractorAddress.slice(-4)}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Work Description</h4>
                      <p className="text-sm text-gray-600">{deal.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-500">Amount Paid:</span>
                        <span className="ml-2 font-medium">{deal.amount} ETH</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Completed:</span>
                        <span className="ml-2">{new Date(deal.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {deal.proofHash && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Proof Hash</h4>
                        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono">
                          {deal.proofHash}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
