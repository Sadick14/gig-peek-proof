import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Clock, Upload } from 'lucide-react';

export const MyGigs = () => {
  const { deals, updateDeal, user } = useApp();
  const [loadingDeal, setLoadingDeal] = useState<string | null>(null);
  const [proofText, setProofText] = useState('');
  const [selectedDeal, setSelectedDeal] = useState<any>(null);

  // Filter deals for current contractor
  const myGigs = deals.filter(deal => deal.contractorAddress.toLowerCase() === user.address.toLowerCase());
  const actionRequiredGigs = myGigs.filter(deal => deal.status === 'waiting_proof');
  const pendingPaymentGigs = myGigs.filter(deal => deal.status === 'proof_submitted');
  const completedGigs = myGigs.filter(deal => deal.status === 'completed');

  const submitProof = async (dealId: string) => {
    if (!proofText.trim()) {
      toast({
        title: "Error",
        description: "Please enter proof of work",
        variant: "destructive"
      });
      return;
    }

    setLoadingDeal(dealId);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock proof hash
      const proofHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      updateDeal(dealId, { 
        status: 'proof_submitted',
        proofHash: proofHash
      });
      
      toast({
        title: "Proof Submitted!",
        description: `Your proof has been submitted for deal ${dealId.slice(0, 8)}....`
      });
      
      setProofText('');
      setSelectedDeal(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit proof. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingDeal(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting_proof':
        return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />Action Required</Badge>;
      case 'proof_submitted':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Pending Payment</Badge>;
      case 'completed':
        return <Badge variant="default" className="gap-1"><CheckCircle className="h-3 w-3" />Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const GigCard = ({ gig }: { gig: any }) => (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Deal #{gig.id.slice(0, 8)}...</CardTitle>
            <CardDescription className="mt-1">
              Created: {new Date(gig.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          {getStatusBadge(gig.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Work Description</h4>
            <p className="text-sm text-gray-600">{gig.description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">Payment:</span>
              <span className="ml-2 font-medium text-lg">{gig.amount} ETH</span>
            </div>
          </div>

          {gig.proofHash && (
            <div>
              <h4 className="font-medium mb-2">Submitted Proof</h4>
              <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono">
                {gig.proofHash}
              </p>
            </div>
          )}
          
          {gig.status === 'waiting_proof' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  className="w-full gap-2"
                  onClick={() => setSelectedDeal(gig)}
                >
                  <Upload className="h-4 w-4" />
                  Submit Proof
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Proof of Work</DialogTitle>
                  <DialogDescription>
                    Provide evidence that you have completed the work for deal #{gig.id.slice(0, 8)}...
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="proof">Proof Description</Label>
                    <Textarea
                      id="proof"
                      placeholder="Describe what you completed, include links to deliverables, screenshots, etc..."
                      value={proofText}
                      onChange={(e) => setProofText(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => submitProof(gig.id)}
                    disabled={loadingDeal === gig.id}
                  >
                    {loadingDeal === gig.id ? 'Submitting...' : 'Submit Proof'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Gigs</h1>
        <p className="text-gray-600 mt-2">
          Manage your assigned gigs and submit proof of completed work.
        </p>
      </div>

      {myGigs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No Gigs Yet</h3>
            <p className="text-gray-600 mb-4">You don't have any assigned gigs at the moment.</p>
            <Button onClick={() => window.location.href = '/dashboard/open-deal'}>
              Open a Deal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="action" className="w-full">
          <TabsList>
            <TabsTrigger value="action">Action Required ({actionRequiredGigs.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Payment ({pendingPaymentGigs.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedGigs.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="action" className="space-y-4">
            {actionRequiredGigs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No gigs requiring action</p>
            ) : (
              actionRequiredGigs.map(gig => (
                <GigCard key={gig.id} gig={gig} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="space-y-4">
            {pendingPaymentGigs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No gigs pending payment</p>
            ) : (
              pendingPaymentGigs.map(gig => (
                <GigCard key={gig.id} gig={gig} />
              ))
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedGigs.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No completed gigs</p>
            ) : (
              completedGigs.map(gig => (
                <GigCard key={gig.id} gig={gig} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
