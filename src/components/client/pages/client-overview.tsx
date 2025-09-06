import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

const ClientOverview = () => {
  const navigate = useNavigate();
  const { deals } = useApp();

  const activeDeals = deals.filter(deal => deal.status !== 'completed');
  const totalEscrowed = deals.reduce((sum, deal) => sum + parseFloat(deal.amount || '0'), 0);
  const recentDeals = deals.slice(-3);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to your Client Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your gigs, create new deals, and track payments
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{deals.length}</p>
              <p className="text-sm text-muted-foreground">Total Deals Created</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalEscrowed.toFixed(3)} ETH</p>
              <p className="text-sm text-muted-foreground">Total ETH Escrowed</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeDeals.length}</p>
              <p className="text-sm text-muted-foreground">Active Deals</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <Button 
            onClick={() => navigate('/client/new')}
            className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Deal
          </Button>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          {recentDeals.length > 0 ? (
            <div className="space-y-2">
              {recentDeals.map((deal) => (
                <div key={deal.id} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Deal #{deal.id}</span>
                  <span className="font-medium">{deal.amount} ETH</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No recent activity</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ClientOverview;