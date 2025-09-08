import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { wagmiWeb3Service } from '@/services/wagmiWeb3Service';
import { 
  ArrowLeft, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Package {
  id: string;
  name: string;
  description: string;
  price: string;
  deliveryTime: number;
  revisions: number;
}

export function CreateDeal() {
  const { addDeal, refreshDeals } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
  });
  const [packages, setPackages] = useState<Package[]>([
    { id: '1', name: 'Basic', description: '', price: '', deliveryTime: 3, revisions: 1 },
    { id: '2', name: 'Standard', description: '', price: '', deliveryTime: 5, revisions: 3 },
    { id: '3', name: 'Premium', description: '', price: '', deliveryTime: 7, revisions: 5 }
  ]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    return formData.contractorAddress && 
           formData.title && 
           formData.description && 
           formData.amount && 
           parseFloat(formData.amount) > 0;
  };

  const validateStep2 = () => {
    const deadlineDate = new Date(formData.deadline);
    const now = new Date();
    return formData.deadline && deadlineDate > now;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 1) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields with valid data",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) {
      toast({
        title: "Invalid Deadline",
        description: "Please select a future date for the deadline",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Connect to wallet first
      toast({
        title: "Connecting to Wallet...",
        description: "Please ensure MetaMask is connected and on Sepolia testnet",
      });

      await wagmiWeb3Service.initialize();
      
      // Convert deadline to timestamp
      const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
      
      toast({
        title: "Creating Deal...",
        description: "Please confirm the transaction in MetaMask. This will escrow your ETH.",
      });

      // Create deal on blockchain
      const result = await wagmiWeb3Service.createDeal(
        formData.contractorAddress,
        formData.title,
        formData.description,
        deadlineTimestamp,
        formData.amount
      );
      
      // Refresh deals from blockchain to get the latest data
      await refreshDeals();
      
      toast({
        title: "Deal Created Successfully!",
        description: (
          <div className="space-y-3">
            <p>Deal "{formData.title}" has been created and {formData.amount} ETH has been escrowed.</p>
            <div className="flex items-center gap-2">
              <p className="text-xs opacity-75">Transaction: {result.txHash.slice(0, 10)}...</p>
              <button
                onClick={() => window.open(`https://sepolia.etherscan.io/tx/${result.txHash}`, '_blank')}
                className="text-xs underline opacity-75 hover:opacity-100 flex items-center gap-1"
              >
                View on Etherscan <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ),
      });

      // Reset form
      setFormData({
        contractorAddress: '',
        title: '',
        description: '',
        amount: '',
        deadline: ''
      });
      setStep(1);
      
      // Navigate to active deals
      setTimeout(() => {
        navigate('/dashboard/active-deals');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating deal:', error);
      toast({
        title: "Transaction Failed",
        description: error.message || "Failed to create deal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Create New Gig</h1>
          <p className="text-muted-foreground">Create a gig listing with multiple packages for clients</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Gig Creation Progress</h3>
          <Badge variant="secondary">{step}/3</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-sm font-medium">Gig Details</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {step > 2 ? <CheckCircle className="w-4 h-4" /> : '2'}
            </div>
            <span className="text-sm font-medium">Packages</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {step > 3 ? <CheckCircle className="w-4 h-4" /> : '3'}
            </div>
            <span className="text-sm font-medium">Review</span>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Gig Information</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Gig Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., I will design a professional website"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  A clear, catchy title for your gig
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Input
                  id="category"
                  placeholder="e.g., Web Development, Graphic Design"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The category your gig belongs to
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Gig Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you'll deliver, your process, and any requirements..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Detailed description of your service and deliverables
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium">
                  Tags (optional)
                </Label>
                <Input
                  id="tags"
                  placeholder="e.g., react, nodejs, responsive"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated tags to help clients find your gig
                </p>
              </div>
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Project Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the work to be completed, deliverables, and any specific requirements..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Payment Amount (ETH) *
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.000"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="pr-12"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                    ETH
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  This amount will be held in escrow until the work is completed
                </p>
              </div>

              <Button
                type="button"
                onClick={handleNext}
                className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80"
                disabled={!validateStep1()}
              >
                Continue to Review
              </Button>
            </div>
          </Card>
        )}

        {step === 2 && (
          <>
            {/* Review Card */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Review Deal Details</h2>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Contractor</p>
                    <p className="font-mono text-sm">{formData.contractorAddress}</p>
                  </div>
                  <div className="p-4 bg-background/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Payment Amount</p>
                    <p className="text-lg font-semibold text-primary">{formData.amount} ETH</p>
                  </div>
                </div>

                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Project Title</p>
                  <p className="font-medium">{formData.title}</p>
                </div>

                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{formData.description}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-sm font-medium">
                    Project Deadline *
                  </Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>
            </Card>

            {/* Warning Card */}
            <Card className="p-6 bg-gradient-card border-border/50 shadow-card border-orange-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-500 mb-2">Blockchain Transaction</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your {formData.amount} ETH will be locked in the smart contract escrow</li>
                    <li>• MetaMask will prompt you to confirm the transaction</li>
                    <li>• Gas fees will be required for the Sepolia testnet transaction</li>
                    <li>• Only you can release payment after verifying delivered work</li>
                    <li>• The smart contract ensures secure and trustless execution</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back to Edit
              </Button>
              <Button
                type="submit"
                disabled={loading || !validateStep2()}
                className="flex-1 bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow/80"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Deal...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Create Deal & Escrow Funds
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
