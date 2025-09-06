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
  const { currentRole, user } = useApp();
  const navigate = useNavigate();

  const clientStats = [
    { label: "Active Deals", value: "3", icon: Briefcase, color: "text-blue-500" },
    { label: "Total Spent", value: "12.5 ETH", icon: DollarSign, color: "text-green-500" },
    { label: "Completed", value: "8", icon: CheckCircle, color: "text-emerald-500" },
    { label: "Success Rate", value: "96%", icon: TrendingUp, color: "text-purple-500" },
  ];

  const contractorStats = [
    { label: "Active Gigs", value: "2", icon: Briefcase, color: "text-blue-500" },
    { label: "Total Earned", value: "8.3 ETH", icon: DollarSign, color: "text-green-500" },
    { label: "Completed", value: "15", icon: CheckCircle, color: "text-emerald-500" },
    { label: "Rating", value: "4.9★", icon: TrendingUp, color: "text-yellow-500" },
  ];

  const stats = currentRole === 'client' ? clientStats : contractorStats;

  const recentActivity = [
    {
      id: 1,
      title: "Website Design Project",
      status: currentRole === 'client' ? "Waiting for delivery" : "In progress",
      amount: "2.5 ETH",
      time: "2 hours ago",
      contractor: "0x742d...B2C1"
    },
    {
      id: 2,
      title: "Smart Contract Audit",
      status: currentRole === 'client' ? "Completed" : "Submitted",
      amount: "5.0 ETH",
      time: "1 day ago",
      contractor: "0x1234...5678"
    },
    {
      id: 3,
      title: "Mobile App Development",
      status: currentRole === 'client' ? "Active" : "Accepted",
      amount: "8.0 ETH",
      time: "3 days ago",
      contractor: "0x9876...4321"
    }
  ];

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
          {recentActivity.map((activity) => (
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
          ))}
        </div>
      </Card>
    </div>
  );
}
