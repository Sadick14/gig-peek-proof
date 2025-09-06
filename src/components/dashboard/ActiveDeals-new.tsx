import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Briefcase,
  DollarSign,
  User,
  Calendar,
  ExternalLink,
  Shield,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ActiveDeals() {
  const { deals, updateDeal } = useApp();
  const navigate = useNavigate();
  const [loadingDeal, setLoadingDeal] = useState<string | null>(null);

  const activeDeals = deals.filter(deal => deal.status !== 'completed');
  const waitingProofDeals = activeDeals.filter(deal => deal.status === 'active');
  const proofSubmittedDeals = activeDeals.filter(deal => deal.status === 'proof_submitted');

  const releasePayment = async (dealId: string) => {
    setLoadingDeal(dealId);
    
    try {
      toast({
        title: "Releasing Payment...",
        description: "Please confirm the transaction in your wallet",
      });

      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      updateDeal(dealId, { status: 'completed' });
      
      toast({
        title: "Payment Released Successfully!",
        description: `Payment for deal ${dealId.slice(-8)} has been released to the contractor.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to release payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingDeal(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />In Progress</Badge>;
      case 'proof_submitted':
        return <Badge variant="default" className="gap-1"><AlertCircle className="h-3 w-3" />Review Required</Badge>;
      case 'completed':
        return <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-500"><CheckCircle className="h-3 w-3" />Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const DealCard = ({ deal }: { deal: any }) => (
    <Card className="p-6 bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-all duration-300">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{deal.title || 'Untitled Project'}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{deal.description}</p>
          </div>
          {getStatusBadge(deal.status)}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="font-semibold">{deal.amount} ETH</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <User className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Contractor</p>
              <p className="font-mono text-xs">{deal.contractorAddress?.slice(0, 8)}...{deal.contractorAddress?.slice(-4)}</p>
            </div>
          </div>

          {deal.deadline && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Calendar className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="text-xs">{formatDate(deal.deadline)}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Briefcase className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-xs">{formatDate(deal.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border/50">
          {deal.status === 'proof_submitted' && (
            <Button
              onClick={() => releasePayment(deal.id)}
              disabled={loadingDeal === deal.id}
              className="flex-1 bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80"
            >
              {loadingDeal === deal.id ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Releasing...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Release Payment
                </>
              )}
            </Button>
          )}
          
          {deal.txHash && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://sepolia.etherscan.io/tx/${deal.txHash}`, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on Etherscan
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Active Deals</h1>
          <p className="text-muted-foreground">Manage your ongoing projects</p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Active</p>
              <p className="text-2xl font-bold">{activeDeals.length}</p>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Briefcase className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
              <p className="text-2xl font-bold">{proofSubmittedDeals.length}</p>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <AlertCircle className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Value</p>
              <p className="text-2xl font-bold">
                {activeDeals.reduce((sum, deal) => sum + parseFloat(deal.amount || '0'), 0).toFixed(2)} ETH
              </p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Deals Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All Active ({activeDeals.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({waitingProofDeals.length})
          </TabsTrigger>
          <TabsTrigger value="review">
            Need Review ({proofSubmittedDeals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {activeDeals.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-card border-border/50 shadow-card">
              <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Active Deals</h3>
              <p className="text-muted-foreground mb-6">
                You don't have any active deals at the moment.
              </p>
              <Button
                onClick={() => navigate('/dashboard/create-deal')}
                className="bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80"
              >
                Create Your First Deal
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6">
              {activeDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-6">
          {waitingProofDeals.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-card border-border/50 shadow-card">
              <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Deals In Progress</h3>
              <p className="text-muted-foreground">
                All your deals are either completed or waiting for your review.
              </p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {waitingProofDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          {proofSubmittedDeals.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-card border-border/50 shadow-card">
              <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Deals Need Review</h3>
              <p className="text-muted-foreground">
                No contractors have submitted work proof yet.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-medium">
                    {proofSubmittedDeals.length} deal{proofSubmittedDeals.length > 1 ? 's' : ''} waiting for your review
                  </p>
                </div>
                <p className="text-sm text-orange-600/80 mt-1">
                  Review the submitted work and release payment if satisfied.
                </p>
              </div>
              <div className="grid gap-6">
                {proofSubmittedDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
