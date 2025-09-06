import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Hash, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const MyGigs = () => {
  const { deals, user, updateDeal } = useApp();
  const { toast } = useToast();
  const [proofText, setProofText] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState<{ [key: string]: boolean }>({});

  const myGigs = deals.filter(deal => 
    deal.contractorAddress.toLowerCase() === user.address.toLowerCase()
  );
  
  const actionRequired = myGigs.filter(deal => deal.status === 'waiting_proof');
  const pendingPayment = myGigs.filter(deal => deal.status === 'proof_submitted');
  const completed = myGigs.filter(deal => deal.status === 'completed');

  const generateProofHash = (preview: string) => {
    // Simulate hash generation
    const hash = `0x${Math.random().toString(36).substr(2, 64)}`;
    return hash;
  };

  const handleSubmitProof = async (dealId: string) => {
    const proof = proofText[dealId];
    if (!proof?.trim()) {
      toast({
        title: "Enter Proof",
        description: "Please enter your work preview before submitting.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(prev => ({ ...prev, [dealId]: true }));

    setTimeout(() => {
      const proofHash = generateProofHash(proof);
      updateDeal(dealId, { 
        status: 'proof_submitted',
        proofHash 
      });
      
      toast({
        title: "Proof Submitted!",
        description: "Your proof has been recorded on the blockchain.",
      });

      setProofText(prev => ({ ...prev, [dealId]: "" }));
      setSubmitting(prev => ({ ...prev, [dealId]: false }));
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting_proof':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Action Required</Badge>;
      case 'proof_submitted':
        return <Badge variant="default"><AlertCircle className="w-3 h-3 mr-1" />Pending Payment</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-success border-success"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (myGigs.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-2">My Gigs</h1>
        <p className="text-muted-foreground mb-8">You have no gigs yet</p>
        <Card className="p-8 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
          <p className="text-muted-foreground">
            Use "Open a Deal" to find gigs assigned to your wallet address
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Gigs</h1>
        <p className="text-muted-foreground">
          Manage your active gigs and submit proof of completed work
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({myGigs.length})</TabsTrigger>
          <TabsTrigger value="action">Action Required ({actionRequired.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Payment ({pendingPayment.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {myGigs.map((gig) => (
            <Card key={gig.id} className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Gig #{gig.id}</h3>
                    {getStatusBadge(gig.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created {gig.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{gig.amount} ETH</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
                {gig.description}
              </p>

              {gig.status === 'waiting_proof' && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`proof-${gig.id}`}>Work Preview/Proof</Label>
                    <Textarea
                      id={`proof-${gig.id}`}
                      placeholder="Describe your completed work or provide a preview..."
                      value={proofText[gig.id] || ""}
                      onChange={(e) => setProofText(prev => ({ ...prev, [gig.id]: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={() => handleSubmitProof(gig.id)}
                    disabled={!proofText[gig.id]?.trim() || submitting[gig.id]}
                    className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 transition-all duration-300"
                  >
                    <Hash className="w-4 h-4 mr-2" />
                    {submitting[gig.id] ? "Submitting..." : "Submit Proof"}
                  </Button>
                </div>
              )}

              {gig.status === 'proof_submitted' && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm font-medium text-warning">⏳ Proof Submitted</p>
                  <p className="text-xs text-muted-foreground font-mono mt-1">
                    Hash: {gig.proofHash}
                  </p>
                </div>
              )}

              {gig.status === 'completed' && (
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm font-medium text-success">✅ Payment Received</p>
                  <p className="text-xs text-muted-foreground">
                    {gig.amount} ETH sent to your wallet
                  </p>
                </div>
              )}
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="action" className="space-y-4">
          {actionRequired.map((gig) => (
            <Card key={gig.id} className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Gig #{gig.id}</h3>
                    {getStatusBadge(gig.status)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{gig.amount} ETH</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
                {gig.description}
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor={`proof-${gig.id}`}>Work Preview/Proof</Label>
                  <Textarea
                    id={`proof-${gig.id}`}
                    placeholder="Describe your completed work or provide a preview..."
                    value={proofText[gig.id] || ""}
                    onChange={(e) => setProofText(prev => ({ ...prev, [gig.id]: e.target.value }))}
                    rows={3}
                  />
                </div>
                <Button
                  onClick={() => handleSubmitProof(gig.id)}
                  disabled={!proofText[gig.id]?.trim() || submitting[gig.id]}
                  className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80 transition-all duration-300"
                >
                  <Hash className="w-4 h-4 mr-2" />
                  {submitting[gig.id] ? "Submitting..." : "Submit Proof"}
                </Button>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {pendingPayment.map((gig) => (
            <Card key={gig.id} className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Gig #{gig.id}</h3>
                    {getStatusBadge(gig.status)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{gig.amount} ETH</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
                {gig.description}
              </p>

              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm font-medium text-warning">⏳ Proof Submitted</p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  Hash: {gig.proofHash}
                </p>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completed.map((gig) => (
            <Card key={gig.id} className="p-6 bg-gradient-card border-border/50 backdrop-blur-sm shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">Gig #{gig.id}</h3>
                    {getStatusBadge(gig.status)}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-success">{gig.amount} ETH</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 p-3 bg-muted/50 rounded-lg">
                {gig.description}
              </p>

              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <p className="text-sm font-medium text-success">✅ Payment Received</p>
                <p className="text-xs text-muted-foreground">
                  {gig.amount} ETH sent to your wallet
                </p>
              </div>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyGigs;