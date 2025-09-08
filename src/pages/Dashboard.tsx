import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Search, 
  Clock, 
  DollarSign, 
  User, 
  CheckCircle,
  AlertCircle,
  Eye,
  Briefcase,
  TrendingUp,
  Users,
  Star,
  Filter,
  SortDesc
} from 'lucide-react';
import { MultiWalletConnection } from '@/components/ui/multi-wallet-connection';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, deals, isLoadingDeals, refreshDeals } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [newDeal, setNewDeal] = useState({
    contractorAddress: '',
    description: '',
    amount: '',
    deadline: ''
  });

  // If wallet not connected, redirect to home
  if (!user.isConnected) {
    navigate('/');
    return null;
  }

  // Filter deals based on user role in the deal
  const myClientDeals = deals.filter(deal => deal.clientAddress?.toLowerCase() === user.address.toLowerCase());
  const myContractorDeals = deals.filter(deal => deal.contractorAddress.toLowerCase() === user.address.toLowerCase());
  const availableDeals = deals.filter(deal => 
    !deal.contractorAddress || 
    deal.contractorAddress === '0x0000000000000000000000000000000000000000'
  );

  const handleCreateDeal = async () => {
    // Implementation for creating deal
    console.log('Creating deal:', newDeal);
  };

  const handleAcceptDeal = async (dealId: string) => {
    // Implementation for accepting deal
    console.log('Accepting deal:', dealId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-glow/50">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  GigPeek
                </h1>
                <p className="text-xs text-muted-foreground">Freelance Marketplace</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">
                {user.address.slice(0, 6)}...{user.address.slice(-4)}
              </Badge>
              <MultiWalletConnection />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Deals</p>
                  <p className="text-2xl font-bold">{myClientDeals.length + myContractorDeals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <DollarSign className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">
                    {myContractorDeals
                      .filter(deal => deal.status === 'completed')
                      .reduce((sum, deal) => sum + parseFloat(deal.amount || '0'), 0)
                      .toFixed(3)} ETH
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">100%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-2xl font-bold">5.0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Deal
            </TabsTrigger>
            <TabsTrigger value="my-work" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              My Work
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Earnings
            </TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Browse Opportunities</h2>
                <p className="text-muted-foreground">Find gigs that match your skills</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <SortDesc className="w-4 h-4 mr-2" />
                  Sort
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              {availableDeals.length === 0 ? (
                <Card className="p-12 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No available deals</h3>
                  <p className="text-muted-foreground">Check back later for new opportunities</p>
                </Card>
              ) : (
                availableDeals.map((deal) => (
                  <Card key={deal.id} className="bg-gradient-card border-border/50 hover:shadow-elegant transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{deal.title || `Deal #${deal.id}`}</CardTitle>
                          <CardDescription className="mt-2">{deal.description}</CardDescription>
                        </div>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {deal.amount} ETH
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            Client: {deal.clientAddress?.slice(0, 6)}...
                          </div>
                          {deal.deadline && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {deal.deadline}
                            </div>
                          )}
                        </div>
                        <Button onClick={() => handleAcceptDeal(deal.id)}>
                          Accept Deal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Create Deal Tab */}
          <TabsContent value="create" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Create New Deal</h2>
              <p className="text-muted-foreground">Post a new gig and find talented contractors</p>
            </div>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Deal Details</CardTitle>
                <CardDescription>
                  Provide clear requirements and fair compensation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contractor">Contractor Address (Optional)</Label>
                  <Input
                    id="contractor"
                    placeholder="0x... (leave empty for open marketplace)"
                    value={newDeal.contractorAddress}
                    onChange={(e) => setNewDeal({...newDeal, contractorAddress: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the work to be done, requirements, and deliverables..."
                    value={newDeal.description}
                    onChange={(e) => setNewDeal({...newDeal, description: e.target.value})}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Payment Amount (ETH)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.001"
                      placeholder="0.1"
                      value={newDeal.amount}
                      onChange={(e) => setNewDeal({...newDeal, amount: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline (Optional)</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newDeal.deadline}
                      onChange={(e) => setNewDeal({...newDeal, deadline: e.target.value})}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleCreateDeal}
                  className="w-full bg-gradient-primary shadow-glow hover:shadow-glow/80"
                  size="lg"
                >
                  Create Deal & Escrow Funds
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Work Tab */}
          <TabsContent value="my-work" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">My Work</h2>
              <p className="text-muted-foreground">Manage your active deals and projects</p>
            </div>

            <div className="grid gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">As Client</h3>
                {myClientDeals.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Plus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No deals created yet</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {myClientDeals.map((deal) => (
                      <Card key={deal.id} className="bg-gradient-card border-border/50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{deal.title || `Deal #${deal.id}`}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{deal.description}</p>
                              <div className="flex items-center gap-4 mt-3 text-sm">
                                <span>Contractor: {deal.contractorAddress.slice(0, 6)}...</span>
                                <span>Amount: {deal.amount} ETH</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={
                                deal.status === 'completed' ? 'default' :
                                deal.status === 'proof_submitted' ? 'secondary' :
                                'outline'
                              }>
                                {deal.status.replace('_', ' ')}
                              </Badge>
                              {deal.status === 'proof_submitted' && (
                                <Button size="sm">Release Payment</Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-xl font-semibold mb-4">As Contractor</h3>
                {myContractorDeals.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No gigs accepted yet</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {myContractorDeals.map((deal) => (
                      <Card key={deal.id} className="bg-gradient-card border-border/50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{deal.title || `Deal #${deal.id}`}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{deal.description}</p>
                              <div className="flex items-center gap-4 mt-3 text-sm">
                                <span>Client: {deal.clientAddress?.slice(0, 6)}...</span>
                                <span>Amount: {deal.amount} ETH</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={
                                deal.status === 'completed' ? 'default' :
                                deal.status === 'waiting_proof' ? 'secondary' :
                                'outline'
                              }>
                                {deal.status.replace('_', ' ')}
                              </Badge>
                              {deal.status === 'active' && (
                                <Button size="sm">Submit Proof</Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Earnings & History</h2>
              <p className="text-muted-foreground">Track your payments and transaction history</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Total Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-primary">
                    {myContractorDeals
                      .filter(deal => deal.status === 'completed')
                      .reduce((sum, deal) => sum + parseFloat(deal.amount || '0'), 0)
                      .toFixed(3)} ETH
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    From {myContractorDeals.filter(deal => deal.status === 'completed').length} completed gigs
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-secondary">
                    {myContractorDeals
                      .filter(deal => deal.status === 'proof_submitted')
                      .reduce((sum, deal) => sum + parseFloat(deal.amount || '0'), 0)
                      .toFixed(3)} ETH
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    From {myContractorDeals.filter(deal => deal.status === 'proof_submitted').length} submitted proofs
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Escrowed Funds</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-accent">
                    {myClientDeals
                      .filter(deal => deal.status !== 'completed')
                      .reduce((sum, deal) => sum + parseFloat(deal.amount || '0'), 0)
                      .toFixed(3)} ETH
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    In {myClientDeals.filter(deal => deal.status !== 'completed').length} active deals
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deals.filter(deal => 
                    (deal.clientAddress?.toLowerCase() === user.address.toLowerCase() || 
                     deal.contractorAddress.toLowerCase() === user.address.toLowerCase()) &&
                    deal.status === 'completed'
                  ).slice(0, 5).map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between py-3 border-b border-border/20 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{deal.title || `Deal #${deal.id}`}</p>
                          <p className="text-sm text-muted-foreground">
                            {deal.clientAddress?.toLowerCase() === user.address.toLowerCase() ? 'Payment sent' : 'Payment received'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{deal.amount} ETH</p>
                        <p className="text-sm text-muted-foreground">
                          {deal.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {deals.filter(deal => 
                    deal.clientAddress?.toLowerCase() === user.address.toLowerCase() || 
                    deal.contractorAddress.toLowerCase() === user.address.toLowerCase()
                  ).length === 0 && (
                    <div className="text-center py-8">
                      <DollarSign className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No transactions yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;