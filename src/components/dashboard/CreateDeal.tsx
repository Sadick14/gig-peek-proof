import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Shield,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CreateDeal() {
  const { addDeal } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    contractorAddress: '',
    title: '',
    description: '',
    amount: '',
    deadline: ''
  });
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
      // Simulate smart contract interaction
      toast({
        title: "Creating Deal...",
        description: "Please confirm the transaction in your wallet",
      });

      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newDeal = {
        id: `deal_${Date.now()}`,
        contractorAddress: formData.contractorAddress,
        title: formData.title,
        description: formData.description,
        amount: formData.amount,
        deadline: formData.deadline,
        status: 'active' as const,
        createdAt: new Date(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`
      };

      addDeal(newDeal);
      
      toast({
        title: "Deal Created Successfully!",
        description: `Deal "${formData.title}" has been created and ${formData.amount} ETH has been escrowed.`,
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
      
    } catch (error) {
      console.error('Error creating deal:', error);
      toast({
        title: "Error",
        description: "Failed to create deal. Please try again.",
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
          <h1 className="text-3xl font-bold">Create New Deal</h1>
          <p className="text-muted-foreground">Set up a secure escrow deal with a contractor</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <Card className="p-6 bg-gradient-card border-border/50 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Deal Creation Progress</h3>
          <Badge variant="secondary">{step}/2</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              {step > 1 ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-sm font-medium">Deal Details</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              2
            </div>
            <span className="text-sm font-medium">Review & Create</span>
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
              <h2 className="text-xl font-semibold">Deal Information</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="contractorAddress" className="text-sm font-medium">
                  Contractor Wallet Address *
                </Label>
                <Input
                  id="contractorAddress"
                  placeholder="0x742d35Cc6635C0532925a3b8D40C8C3F8b29B2C1"
                  value={formData.contractorAddress}
                  onChange={(e) => handleInputChange('contractorAddress', e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  The Ethereum address of the contractor who will complete this work
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Project Title *
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Website Design & Development"
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
                  <h3 className="font-semibold text-orange-500 mb-2">Important Information</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your {formData.amount} ETH will be locked in escrow until work completion</li>
                    <li>• Only you can release payment after verifying the delivered work</li>
                    <li>• The contractor cannot access funds until you approve</li>
                    <li>• This transaction will require gas fees on Sepolia testnet</li>
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
