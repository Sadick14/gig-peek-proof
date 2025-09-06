import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  ArrowRight,
  Eye,
  Shield,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Overview() {
  const { currentRole, user, deals, isLoadingDeals } = useApp();
  const navigate = useNavigate();

  // Calculate real stats from blockchain data
  const userDeals = deals.filter(deal => 
    currentRole === 'client' 
      ? deal.clientAddress?.toLowerCase() === user.address.toLowerCase()
      : deal.contractorAddress.toLowerCase() === user.address.toLowerCase()
  );

  const activeDeals = userDeals.filter(deal => deal.status === 'active' || deal.status === 'proof_submitted');
  const completedDeals = userDeals.filter(deal => deal.status === 'completed');
  const totalAmount = userDeals.reduce((sum, deal) => sum + parseFloat(deal.amount || '0'), 0);

  const clientStats = [
    { label: "Active Deals", value: activeDeals.length.toString(), icon: Briefcase, color: "text-blue-500" },
    { label: "Total Spent", value: `${totalAmount.toFixed(3)} ETH`, icon: DollarSign, color: "text-green-500" },
    { label: "Completed", value: completedDeals.length.toString(), icon: CheckCircle, color: "text-emerald-500" },
    { label: "Success Rate", value: userDeals.length > 0 ? `${Math.round((completedDeals.length / userDeals.length) * 100)}%` : "0%", icon: TrendingUp, color: "text-purple-500" },
  ];

  const contractorStats = [
    { label: "Active Gigs", value: activeDeals.length.toString(), icon: Briefcase, color: "text-blue-500" },
    { label: "Total Earned", value: `${completedDeals.reduce((sum, deal) => sum + parseFloat(deal.amount || '0'), 0).toFixed(3)} ETH`, icon: DollarSign, color: "text-green-500" },
    { label: "Completed", value: completedDeals.length.toString(), icon: CheckCircle, color: "text-emerald-500" },
    { label: "Rating", value: "4.9★", icon: TrendingUp, color: "text-yellow-500" },
  ];

  const stats = currentRole === 'client' ? clientStats : contractorStats;

  // Get recent deals for activity section
  const recentDeals = userDeals
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
    .map(deal => ({
      id: deal.id,
      title: deal.title || `Deal #${deal.id}`,
      status: getStatusText(deal.status, currentRole),
      amount: `${deal.amount} ETH`,
      time: getTimeAgo(deal.createdAt),
      contractor: deal.contractorAddress
    }));

  function getStatusText(status: string, role: string | null) {
    if (role === 'client') {
      switch (status) {
        case 'active': return 'Waiting for delivery';
        case 'proof_submitted': return 'Ready for review';
        case 'completed': return 'Completed';
        default: return 'Active';
      }
    } else {
      switch (status) {
        case 'active': return 'In progress';
        case 'proof_submitted': return 'Submitted';
        case 'completed': return 'Completed';
        default: return 'Active';
      }
    }
  }

  function getTimeAgo(date: Date) {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {currentRole === 'client' ? 'Client' : 'Contractor'}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Connected as: <span className="font-mono text-primary">{user.address}</span>
          </p>
        </div>
        <Badge variant="secondary" className="px-4 py-2">
          <Eye className="w-4 h-4 mr-2" />
          GigPeek v1.0
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 bg-gradient-card border-border/50 shadow-card hover:shadow-elegant transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 bg-primary/10 rounded-xl ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Quick Actions Card */}
        <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {currentRole === 'client' ? (
              <>
                <Button 
                  onClick={() => navigate('/dashboard/create-deal')}
                  className="w-full justify-between bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Create New Deal
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard/active-deals')}
                  variant="outline" 
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    View Active Deals
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard/deal-history')}
                  variant="outline" 
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Deal History
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => navigate('/dashboard/open-deal')}
                  className="w-full justify-between bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Browse Open Deals
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard/my-gigs')}
                  variant="outline" 
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    My Active Gigs
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard/payment-history')}
                  variant="outline" 
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Payment History
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Platform Status Card */}
        <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
          <h3 className="text-xl font-semibold mb-4">Platform Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Shield className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Smart Contract</p>
                  <p className="text-sm text-muted-foreground">Verified & Secure</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Online
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-full">
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Sepolia Network</p>
                  <p className="text-sm text-muted-foreground">Low gas fees</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                Active
              </Badge>
            </div>

            <div className="pt-4 border-t border-border/50">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => window.open('https://sepolia.etherscan.io/address/0xF140271F8C6CF820aB2c9F58ecE55dE273319A95', '_blank')}
              >
                View Contract on Etherscan
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
        <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {isLoadingDeals ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Loading deals from blockchain...
              </div>
            </div>
          ) : recentDeals.length > 0 ? (
            recentDeals.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {currentRole === 'client' ? `Contractor: ${activity.contractor}` : `Client project`} • {activity.time}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{activity.amount}</p>
                <Badge 
                  variant={activity.status === 'Completed' || activity.status === 'Submitted' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {activity.status}
                </Badge>
              </div>
            </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent activity found
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
