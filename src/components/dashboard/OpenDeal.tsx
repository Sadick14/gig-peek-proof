import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';

export const OpenDeal = () => {
  const { deals, user } = useApp();
  const [dealId, setDealId] = useState('');
  const [searchedDeal, setSearchedDeal] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const searchDeal = async () => {
    if (!dealId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a deal ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const deal = deals.find(d => d.id.includes(dealId) || dealId.includes(d.id.slice(0, 8)));
      
      if (deal) {
        setSearchedDeal(deal);
        toast({
          title: "Deal Found!",
          description: `Found deal ${deal.id.slice(0, 8)}...`
        });
      } else {
        setSearchedDeal(null);
        toast({
          title: "Deal Not Found",
          description: "No deal found with that ID",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search for deal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting_proof':
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />Action Required</Badge>;
      case 'proof_submitted':
        return <Badge variant="secondary" className="gap-1"><CheckCircle className="h-3 w-3" />Proof Submitted</Badge>;
      case 'completed':
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canWorkOnDeal = (deal: any) => {
    return deal.contractorAddress.toLowerCase() === user.address.toLowerCase();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Open a Deal</h1>
        <p className="text-gray-600 mt-2">
          Enter a deal ID to view details and submit your work.
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Deal
          </CardTitle>
          <CardDescription>
            Enter the deal ID provided by the client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="dealId" className="sr-only">Deal ID</Label>
              <Input
                id="dealId"
                type="text"
                placeholder="Enter deal ID (e.g., deal_1634567890)"
                value={dealId}
                onChange={(e) => setDealId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchDeal()}
              />
            </div>
            <Button onClick={searchDeal} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Deal Details */}
      {searchedDeal && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Deal #{searchedDeal.id.slice(0, 8)}...</CardTitle>
                <CardDescription className="mt-1">
                  Client: {searchedDeal.contractorAddress !== user.address ? 'Not assigned to you' : 'Assigned to you'}
                </CardDescription>
              </div>
              {getStatusBadge(searchedDeal.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Work Description</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {searchedDeal.description}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Payment Amount:</span>
                  <div className="font-medium text-lg">{searchedDeal.amount} ETH</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Created:</span>
                  <div className="text-sm">{new Date(searchedDeal.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {searchedDeal.proofHash && (
                <div>
                  <h4 className="font-medium mb-2">Submitted Proof</h4>
                  <p className="text-sm text-gray-600 bg-green-50 p-2 rounded font-mono">
                    {searchedDeal.proofHash}
                  </p>
                </div>
              )}

              {!canWorkOnDeal(searchedDeal) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      This deal is assigned to a different contractor.
                    </p>
                  </div>
                </div>
              )}

              {canWorkOnDeal(searchedDeal) && searchedDeal.status === 'waiting_proof' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Ready to Submit Proof</h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Complete the work described above and submit your proof to receive payment.
                  </p>
                  <Button 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Feature Coming Soon",
                        description: "Proof submission interface will be available in the My Gigs section."
                      });
                    }}
                  >
                    Submit Proof
                  </Button>
                </div>
              )}

              {canWorkOnDeal(searchedDeal) && searchedDeal.status === 'proof_submitted' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-800">
                      Proof submitted! Waiting for client approval and payment release.
                    </p>
                  </div>
                </div>
              )}

              {canWorkOnDeal(searchedDeal) && searchedDeal.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <p className="text-sm text-green-800">
                      Deal completed! Payment has been released to your wallet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>How to Get Deal IDs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-600">
          <p>• 📧 Clients will share the deal ID with you via email or chat</p>
          <p>• 💬 Look for messages containing text like "deal_1634567890"</p>
          <p>• 🔍 You can enter partial IDs - just the first 8 characters work too</p>
          <p>• ⚡ Once found, you can submit proof of work to get paid</p>
        </CardContent>
      </Card>
    </div>
  );
};
