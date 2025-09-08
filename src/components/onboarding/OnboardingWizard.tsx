import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Briefcase, 
  Star,
  Upload,
  Camera,
  Plus,
  X
} from 'lucide-react';
import { User as UserType, OnboardingStep } from '@/types';
import { cn } from '@/lib/utils';

interface OnboardingWizardProps {
  currentUser: UserType;
  onComplete: (userData: Partial<UserType>) => void;
  onSkip?: () => void;
  className?: string;
}

export function OnboardingWizard({
  currentUser,
  onComplete,
  onSkip,
  className
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Partial<UserType>>({
    displayName: currentUser.displayName || '',
    bio: currentUser.bio || '',
    avatar: currentUser.avatar || '',
    skills: currentUser.skills || [],
    languages: currentUser.languages || ['English'],
    portfolio: currentUser.portfolio || []
  });

  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Create Your Profile',
      description: 'Tell us about yourself to build trust with clients',
      component: 'ProfileStep',
      isCompleted: false,
      isRequired: true
    },
    {
      id: 'skills',
      title: 'Add Your Skills',
      description: 'Help clients find you by listing your expertise',
      component: 'SkillsStep',
      isCompleted: false,
      isRequired: true
    },
    {
      id: 'portfolio',
      title: 'Showcase Your Work',
      description: 'Add portfolio items to demonstrate your capabilities',
      component: 'PortfolioStep',
      isCompleted: false,
      isRequired: false
    },
    {
      id: 'complete',
      title: 'Ready to Go!',
      description: 'Your profile is set up and ready to start earning',
      component: 'CompleteStep',
      isCompleted: false,
      isRequired: true
    }
  ];

  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(userData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateUserData = (updates: Partial<UserType>) => {
    setUserData(prev => ({ ...prev, ...updates }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !userData.skills?.includes(newSkill.trim())) {
      updateUserData({
        skills: [...(userData.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    updateUserData({
      skills: userData.skills?.filter(skill => skill !== skillToRemove) || []
    });
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !userData.languages?.includes(newLanguage.trim())) {
      updateUserData({
        languages: [...(userData.languages || []), newLanguage.trim()]
      });
      setNewLanguage('');
    }
  };

  const removeLanguage = (languageToRemove: string) => {
    updateUserData({
      languages: userData.languages?.filter(lang => lang !== languageToRemove) || []
    });
  };

  const renderProfileStep = () => (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-24 h-24">
            <AvatarImage src={userData.avatar} alt="Profile" />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {userData.displayName?.charAt(0) || currentUser.address.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            variant="outline"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Upload a professional photo to build trust with clients
        </p>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name *</Label>
        <Input
          id="displayName"
          placeholder="Your professional name"
          value={userData.displayName || ''}
          onChange={(e) => updateUserData({ displayName: e.target.value })}
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio *</Label>
        <Textarea
          id="bio"
          placeholder="Describe your experience, expertise, and what makes you unique..."
          value={userData.bio || ''}
          onChange={(e) => updateUserData({ bio: e.target.value })}
          rows={4}
        />
        <p className="text-sm text-muted-foreground">
          {userData.bio?.length || 0}/1000 characters
        </p>
      </div>
    </div>
  );

  const renderSkillsStep = () => (
    <div className="space-y-6">
      {/* Skills */}
      <div className="space-y-4">
        <div>
          <Label>Your Skills *</Label>
          <p className="text-sm text-muted-foreground">
            Add skills that clients can search for
          </p>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="e.g., React, Logo Design, Content Writing"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
          />
          <Button onClick={addSkill} disabled={!newSkill.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {userData.skills && userData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {userData.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="gap-1 pr-1"
              >
                {skill}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeSkill(skill)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <div>
          <Label>Languages</Label>
          <p className="text-sm text-muted-foreground">
            What languages do you speak?
          </p>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Spanish, French, German"
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
          />
          <Button onClick={addLanguage} disabled={!newLanguage.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {userData.languages && userData.languages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {userData.languages.map((language) => (
              <Badge
                key={language}
                variant="outline"
                className="gap-1 pr-1"
              >
                {language}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeLanguage(language)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderPortfolioStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Add Portfolio Items</h3>
        <p className="text-muted-foreground">
          Showcase your best work to attract more clients
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-32 border-dashed">
          <div className="text-center">
            <Plus className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Add Portfolio Item</p>
          </div>
        </Button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold mb-2">Welcome to GigPeek!</h3>
        <p className="text-muted-foreground">
          Your profile is ready. You can now start creating gigs and earning cryptocurrency.
        </p>
      </div>

      <div className="bg-muted/30 rounded-lg p-6 space-y-4">
        <h4 className="font-semibold">What's next?</h4>
        <div className="space-y-2 text-sm text-left">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Create your first gig</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Set competitive pricing</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Start receiving orders</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderProfileStep();
      case 1:
        return renderSkillsStep();
      case 2:
        return renderPortfolioStep();
      case 3:
        return renderCompleteStep();
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return userData.displayName?.trim() && userData.bio?.trim();
      case 1:
        return userData.skills && userData.skills.length > 0;
      case 2:
        return true; // Portfolio is optional
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Card className={cn("max-w-2xl mx-auto bg-gradient-card border-border/50", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {steps[currentStep].title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {steps[currentStep].description}
            </p>
          </div>
          {onSkip && currentStep < steps.length - 1 && (
            <Button variant="ghost" size="sm" onClick={onSkip}>
              Skip Setup
            </Button>
          )}
        </div>
        
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t border-border/50">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index <= currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-gradient-primary"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Complete Setup
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}