import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, Clock, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

const ContractorOverview = () => {
  const navigate = useNavigate();
  const { deals, user } = useApp();

  const myGigs = deals.filter(deal => 
    deal.contractorAddress.toLowerCase() === user.address.toLowerCase()
  );
  const activeGigs = myGigs.filter(deal => deal.status !== 'completed');
  const pendingPayments = myGigs.filter(deal => deal.status === 'proof_submitted');
  const totalEarnings = myGigs
    .filter(deal => deal.status === 'completed')
    .reduce((sum, deal) => sum + parseFloat(deal.amount || '0'), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome to your Contractor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your gigs, submit proof of work, and track earnings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalEarnings.toFixed(3)} ETH</p>
              <p className="text-sm text-muted-foreground">Total Earnings</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeGigs.length}</p>
              <p className="text-sm text-muted-foreground">Gigs In Progress</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingPayments.length}</p>
              <p className="text-sm text-muted-foreground">Pending Payments</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <Button 
            onClick={() => navigate('/contractor/open')}
            className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 transition-all duration-300"
          >
            <Search className="w-4 h-4 mr-2" />
            Open a Deal
          </Button>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <h3 className="text-xl font-semibold mb-4">Recent Gigs</h3>
          {myGigs.length > 0 ? (
            <div className="space-y-2">
              {myGigs.slice(-3).map((gig) => (
                <div key={gig.id} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Gig #{gig.id}</span>
                  <span className="font-medium">{gig.amount} ETH</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No gigs yet</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ContractorOverview;