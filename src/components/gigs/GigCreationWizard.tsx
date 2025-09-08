import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Plus, 
  X, 
  Upload, 
  Eye, 
  Save, 
  Send,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
  Clock,
  RefreshCw,
  Star,
  DollarSign,
  Package
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Gig, GigPackage } from '@/types';
import { CATEGORIES, DEFAULT_GIG_PACKAGES } from '@/constants';

interface GigCreationWizardProps {
  onClose?: () => void;
  onSuccess?: (gig: Gig) => void;
}

export function GigCreationWizard({ onClose, onSuccess }: GigCreationWizardProps) {
  const { user, createGig } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [gigData, setGigData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    tags: [] as string[],
    images: [] as string[],
    video: '',
    packages: DEFAULT_GIG_PACKAGES.map((pkg, index) => ({
      ...pkg,
      id: `pkg-${index + 1}`,
      price: index === 0 ? '0.1' : index === 1 ? '0.25' : '0.5'
    })),
    faqs: [{ question: '', answer: '' }],
    requirements: ['Project description']
  });

  const [newTag, setNewTag] = useState('');
  const [draggedImage, setDraggedImage] = useState<number | null>(null);

  const steps = [
    { id: 1, title: 'Overview', description: 'Basic gig information' },
    { id: 2, title: 'Pricing', description: 'Package tiers and pricing' },
    { id: 3, title: 'Gallery', description: 'Images and videos' },
    { id: 4, title: 'Details', description: 'FAQs and requirements' },
    { id: 5, title: 'Publish', description: 'Review and publish' }
  ];

  const selectedCategory = CATEGORIES.find(cat => cat.id === gigData.category);

  const addTag = () => {
    if (newTag.trim() && !gigData.tags.includes(newTag.trim())) {
      setGigData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setGigData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const updatePackage = (index: number, updates: Partial<GigPackage>) => {
    setGigData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === index ? { ...pkg, ...updates } : pkg
      )
    }));
  };

  const addFAQ = () => {
    setGigData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: '', answer: '' }]
    }));
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    setGigData(prev => ({
      ...prev,
      faqs: prev.faqs.map((faq, i) => 
        i === index ? { ...faq, [field]: value } : faq
      )
    }));
  };

  const removeFAQ = (index: number) => {
    setGigData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    setGigData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setGigData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => 
        i === index ? value : req
      )
    }));
  };

  const removeRequirement = (index: number) => {
    setGigData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const category = CATEGORIES.find(cat => cat.id === gigData.category);
      const subcategory = category?.subcategories.find(sub => sub.id === gigData.subcategory);

      const newGig = await createGig({
        title: gigData.title,
        description: gigData.description,
        category: category!,
        subcategory,
        tags: gigData.tags,
        images: gigData.images.length > 0 ? gigData.images : [
          'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop'
        ],
        video: gigData.video,
        packages: gigData.packages,
        rating: 0,
        reviewCount: 0,
        isActive: true,
        isPaused: false,
        totalOrders: 0,
        inQueue: 0,
        impressions: 0,
        clicks: 0,
        faqs: gigData.faqs.filter(faq => faq.question && faq.answer).map((faq, index) => ({
          id: `faq-${index + 1}`,
          ...faq
        })),
        requirements: gigData.requirements.filter(req => req.trim())
      });

      onSuccess?.(newGig);
      onClose?.();
    } catch (error) {
      console.error('Error creating gig:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return gigData.title && gigData.description && gigData.category;
      case 2:
        return gigData.packages.every(pkg => pkg.price && pkg.deliveryTime);
      case 3:
        return true; // Images are optional
      case 4:
        return true; // FAQs are optional
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-card border-border/50">
        <CardHeader className="border-b border-border/20">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Create New Gig</CardTitle>
              <CardDescription>
                Step {currentStep} of {steps.length}: {steps.find(s => s.id === currentStep)?.title}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.id}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Step 1: Overview */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Gig Title *</Label>
                <Input
                  id="title"
                  placeholder="I will create a professional website for your business"
                  value={gigData.title}
                  onChange={(e) => setGigData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-2"
                  maxLength={80}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {gigData.title.length}/80 characters
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your service in detail..."
                  value={gigData.description}
                  onChange={(e) => setGigData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-2 min-h-[120px]"
                  maxLength={1200}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {gigData.description.length}/1200 characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select value={gigData.category} onValueChange={(value) => 
                    setGigData(prev => ({ ...prev, category: value, subcategory: '' }))
                  }>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <div>
                    <Label>Subcategory</Label>
                    <Select value={gigData.subcategory} onValueChange={(value) => 
                      setGigData(prev => ({ ...prev, subcategory: value }))
                    }>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory.subcategories.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div>
                <Label>Tags</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {gigData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Pricing */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Set Your Package Pricing</h3>
                <p className="text-muted-foreground">
                  Offer different tiers to attract more buyers
                </p>
              </div>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="standard">Standard</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                </TabsList>

                {gigData.packages.map((pkg, index) => (
                  <TabsContent key={pkg.type} value={pkg.type} className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          <CardTitle className="text-lg capitalize">{pkg.type}</CardTitle>
                          {pkg.isPopular && (
                            <Badge variant="secondary">Most Popular</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Package Name</Label>
                          <Input
                            value={pkg.title}
                            onChange={(e) => updatePackage(index, { title: e.target.value })}
                            placeholder={`${pkg.type} Package`}
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={pkg.description}
                            onChange={(e) => updatePackage(index, { description: e.target.value })}
                            placeholder="Describe what's included in this package"
                            className="mt-2"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              Price (ETH)
                            </Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={pkg.price}
                              onChange={(e) => updatePackage(index, { price: e.target.value })}
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Delivery (days)
                            </Label>
                            <Input
                              type="number"
                              value={pkg.deliveryTime}
                              onChange={(e) => updatePackage(index, { deliveryTime: parseInt(e.target.value) })}
                              className="mt-2"
                            />
                          </div>

                          <div>
                            <Label className="flex items-center gap-1">
                              <RefreshCw className="w-4 h-4" />
                              Revisions
                            </Label>
                            <Input
                              type="number"
                              value={pkg.revisions}
                              onChange={(e) => updatePackage(index, { revisions: parseInt(e.target.value) })}
                              className="mt-2"
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Features</Label>
                          <div className="mt-2 space-y-2">
                            {pkg.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex gap-2">
                                <Input
                                  value={feature}
                                  onChange={(e) => {
                                    const newFeatures = [...pkg.features];
                                    newFeatures[featureIndex] = e.target.value;
                                    updatePackage(index, { features: newFeatures });
                                  }}
                                  placeholder="Feature description"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newFeatures = pkg.features.filter((_, i) => i !== featureIndex);
                                    updatePackage(index, { features: newFeatures });
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updatePackage(index, { features: [...pkg.features, ''] })}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Feature
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}

          {/* Step 3: Gallery */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Add Images & Videos</h3>
                <p className="text-muted-foreground">
                  Show your work with high-quality visuals
                </p>
              </div>

              <Card className="border-dashed border-2 border-border/50">
                <CardContent className="p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
                  <p className="text-muted-foreground mb-4">
                    Add up to 10 images to showcase your work
                  </p>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Images
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-dashed border-2 border-border/50">
                <CardContent className="p-8 text-center">
                  <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Add Video (Optional)</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload a video to better explain your service
                  </p>
                  <Input
                    placeholder="Video URL or upload"
                    value={gigData.video}
                    onChange={(e) => setGigData(prev => ({ ...prev, video: e.target.value }))}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {gigData.faqs.map((faq, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <Label className="text-sm font-medium">FAQ #{index + 1}</Label>
                          {gigData.faqs.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFAQ(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <Input
                          placeholder="Question"
                          value={faq.question}
                          onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                        />
                        <Textarea
                          placeholder="Answer"
                          value={faq.answer}
                          onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                          className="min-h-[80px]"
                        />
                      </CardContent>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={addFAQ}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add FAQ
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Requirements from Buyer</h3>
                <div className="space-y-2">
                  {gigData.requirements.map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder="What do you need from the buyer?"
                        value={requirement}
                        onChange={(e) => updateRequirement(index, e.target.value)}
                      />
                      {gigData.requirements.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addRequirement}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Requirement
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Publish */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold">Review Your Gig</h3>
                <p className="text-muted-foreground">
                  Make sure everything looks perfect before publishing
                </p>
              </div>

              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-2">{gigData.title}</h4>
                  <p className="text-muted-foreground mb-4">{gigData.description}</p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {gigData.packages.map((pkg) => (
                      <Card key={pkg.type} className="border-border/50">
                        <CardContent className="p-4">
                          <h5 className="font-medium capitalize">{pkg.type}</h5>
                          <p className="text-2xl font-bold">{pkg.price} ETH</p>
                          <p className="text-sm text-muted-foreground">
                            {pkg.deliveryTime} day delivery
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {gigData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>

        <div className="border-t border-border/20 p-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            {currentStep === steps.length ? (
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || !canProceed()}
                className="bg-gradient-primary"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Publish Gig
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}