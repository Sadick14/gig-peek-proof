import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Plus, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  Star,
  Eye,
  MessageCircle,
  Bell,
  Settings,
  User,
  BarChart3,
  Zap,
  Award,
  Clock,
  CheckCircle,
  Filter
} from 'lucide-react';
import { MultiWalletConnection } from '@/components/ui/multi-wallet-connection';
import { GigCard } from '@/components/gigs/GigCard';
import { GigCreationWizard } from '@/components/gigs/GigCreationWizard';
import { MarketplaceSearch } from '@/components/marketplace/MarketplaceSearch';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewSummary } from '@/components/reviews/ReviewSummary';
import { ChatInterface } from '@/components/messaging/ChatInterface';
import { ConversationList } from '@/components/messaging/ConversationList';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import { useNavigate } from 'react-router-dom';
import { Gig, SearchFilters, Review, Conversation, Message, User as UserType } from '@/types';

const EnhancedDashboard = () => {
  const { 
    user, 
    gigs, 
    isLoadingGigs, 
    searchFilters, 
    setSearchFilters, 
    searchGigs,
    orders,
    analytics,
    refreshAnalytics
  } = useApp();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [marketplaceGigs, setMarketplaceGigs] = useState<Gig[]>([]);
  const [showGigCreation, setShowGigCreation] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  
  // Mock data for reviews and conversations
  const [mockReviews] = useState<Review[]>([
    {
      id: '1',
      orderId: 'order-1',
      gigId: 'gig-1',
      reviewerId: 'reviewer-1',
      reviewer: {
        id: 'reviewer-1',
        address: '0x123...',
        displayName: 'Alice Johnson',
        avatar: '',
        isConnected: true,
        level: { id: '1', name: 'Level 1', color: '#3B82F6', requirements: { completedOrders: 10, rating: 4.5, responseRate: 90, onTimeDelivery: 95 }, benefits: [] },
        badges: [],
        rating: 4.8,
        reviewCount: 25,
        memberSince: new Date('2023-01-15'),
        completedOrders: 15,
        responseTime: 'within 1 hour',
        languages: ['English'],
        skills: [],
        portfolio: [],
        isVerified: true,
        isOnline: true,
        lastSeen: new Date()
      },
      revieweeId: user.id,
      reviewee: user,
      rating: 5,
      comment: 'Outstanding work! The design exceeded my expectations and was delivered ahead of schedule. Highly recommend this seller.',
      helpful: 12,
      notHelpful: 1,
      createdAt: new Date('2024-01-10')
    }
  ]);
  
  const [mockConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      participants: [
        user,
        {
          id: 'user-2',
          address: '0x456...',
          displayName: 'Bob Smith',
          avatar: '',
          isConnected: true,
          level: { id: '2', name: 'Level 2', color: '#8B5CF6', requirements: { completedOrders: 50, rating: 4.7, responseRate: 95, onTimeDelivery: 98 }, benefits: [] },
          badges: [],
          rating: 4.9,
          reviewCount: 42,
          memberSince: new Date('2022-08-20'),
          completedOrders: 58,
          responseTime: 'within 30 minutes',
          languages: ['English', 'Spanish'],
          skills: [],
          portfolio: [],
          isVerified: true,
          isOnline: false,
          lastSeen: new Date('2024-01-15T10:30:00')
        }
      ],
      lastMessage: {
        id: 'msg-1',
        senderId: 'user-2',
        sender: {} as any,
        receiverId: user.id,
        receiver: user,
        content: 'Hi! I\'m interested in your web development services. Can we discuss the requirements?',
        attachments: [],
        isRead: false,
        sentAt: new Date('2024-01-15T11:45:00'),
        type: 'text'
      },
      unreadCount: 2,
      orderId: 'order-123',
      createdAt: new Date('2024-01-15T09:00:00'),
      updatedAt: new Date('2024-01-15T11:45:00')
    }
  ]);
  
  const [mockMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      orderId: 'order-123',
      senderId: 'user-2',
      sender: mockConversations[0].participants[1],
      receiverId: user.id,
      receiver: user,
      content: 'Hi! I\'m interested in your web development services. Can we discuss the requirements?',
      attachments: [],
      isRead: false,
      sentAt: new Date('2024-01-15T11:45:00'),
      type: 'text'
    },
    {
      id: 'msg-2',
      orderId: 'order-123',
      senderId: user.id,
      sender: user,
      receiverId: 'user-2',
      receiver: mockConversations[0].participants[1],
      content: 'Hello! I\'d be happy to help with your project. What kind of website are you looking to build?',
      attachments: [],
      isRead: true,
      sentAt: new Date('2024-01-15T11:50:00'),
      type: 'text'
    }
  ]);

  // If wallet not connected, redirect to home
  if (!user.isConnected) {
    navigate('/');
    return null;
  }

  // Load initial marketplace data
  useEffect(() => {
    handleSearch();
    refreshAnalytics();
  }, []);

  const handleSearch = async () => {
    const results = await searchGigs(searchFilters);
    setMarketplaceGigs(results);
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleViewGig = (gig: Gig) => {
    // Navigate to gig details page
    console.log('View gig:', gig.id);
  };

  const handleContactSeller = (sellerId: string) => {
    // Open messaging interface
    console.log('Contact seller:', sellerId);
    setActiveTab('messages');
    // TODO: Create or find conversation with seller
  };

  const handleToggleFavorite = (gigId: string) => {
    // Toggle favorite status
    console.log('Toggle favorite:', gigId);
    // TODO: Implement favorite functionality
  };

  const handleReviewHelpful = (reviewId: string) => {
    console.log('Mark review helpful:', reviewId);
    // TODO: Implement review helpful functionality
  };

  const handleReviewNotHelpful = (reviewId: string) => {
    console.log('Mark review not helpful:', reviewId);
    // TODO: Implement review not helpful functionality
  };

  const handleReplyToReview = (reviewId: string) => {
    console.log('Reply to review:', reviewId);
    // TODO: Implement review reply functionality
  };

  const handleCompleteOnboarding = (userData: Partial<UserType>) => {
    console.log('Complete onboarding:', userData);
    // TODO: Update user profile with onboarding data
    setShowOnboarding(false);
  };

  const handleGigCreated = (gig: Gig) => {
    setMarketplaceGigs(prev => [gig, ...prev]);
    setActiveTab('my-gigs');
  };

  const myGigs = gigs.filter(gig => gig.sellerId === user.address);
  const myOrders = orders.filter(order => 
    order.buyerId === user.address || order.sellerId === user.address
  );

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
                <p className="text-xs text-muted-foreground">Professional Marketplace</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">
                    {analytics?.earnings.total.toFixed(2) || '0.00'} ETH
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">{user.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Badge 
                    variant="outline" 
                    style={{ 
                      borderColor: user.level.color,
                      color: user.level.color 
                    }}
                  >
                    {user.level.name}
                  </Badge>
                </div>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">3</Badge>
              </Button>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {user.address.slice(0, 6)}...{user.address.slice(-4)}
                </Badge>
                <MultiWalletConnection />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Marketplace</span>
            </TabsTrigger>
            <TabsTrigger value="my-gigs" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">My Gigs</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Marketplace Tab */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Discover Services</h2>
                <p className="text-muted-foreground">Find the perfect freelancer for your project</p>
              </div>
              <Button onClick={() => setShowGigCreation(true)} className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Gig
              </Button>
            </div>

            <MarketplaceSearch
              filters={searchFilters}
              onFiltersChange={handleFiltersChange}
              onSearch={handleSearch}
              isLoading={isLoadingGigs}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalResults={marketplaceGigs.length}
            />

            {/* Gig Grid */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {isLoadingGigs ? (
                // Loading skeleton
                Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="bg-gradient-card border-border/50">
                    <div className="aspect-[4/3] bg-muted animate-pulse" />
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                      <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))
              ) : marketplaceGigs.length > 0 ? (
                marketplaceGigs.map((gig) => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    onViewGig={handleViewGig}
                    onContactSeller={handleContactSeller}
                    onToggleFavorite={handleToggleFavorite}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <Card className="p-12 text-center">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No gigs found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or explore different categories
                    </p>
                    <Button variant="outline" onClick={() => handleFiltersChange({})}>
                      Clear Filters
                    </Button>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* My Gigs Tab */}
          <TabsContent value="my-gigs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">My Gigs</h2>
                <p className="text-muted-foreground">Manage your service offerings</p>
              </div>
              <Button 
                className="bg-gradient-primary"
                onClick={() => setShowGigCreation(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Gig
              </Button>
            </div>

            {myGigs.length === 0 ? (
              <Card className="p-12 text-center">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Start Selling Your Services</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first gig and start earning cryptocurrency
                </p>
                <Button 
                  className="bg-gradient-primary"
                  onClick={() => setShowGigCreation(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Gig
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myGigs.map((gig) => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    onViewGig={handleViewGig}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Orders</h2>
              <p className="text-muted-foreground">Track your purchases and sales</p>
            </div>

            {myOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-4">
                  Your purchases and sales will appear here
                </p>
                <Button onClick={() => setActiveTab('marketplace')}>
                  Browse Marketplace
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {myOrders.map((order) => (
                  <Card key={order.id} className="bg-gradient-card border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{order.gig.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {order.selectedPackage.title} Package
                          </p>
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <span>
                              {order.buyerId === user.address ? 'Seller' : 'Buyer'}: 
                              {order.buyerId === user.address 
                                ? order.seller.displayName || `${order.seller.address.slice(0, 6)}...`
                                : order.buyer.displayName || `${order.buyer.address.slice(0, 6)}...`
                              }
                            </span>
                            <span>Amount: {order.amount} ETH</span>
                            <span>Due: {order.deliveryDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={
                            order.status === 'completed' ? 'default' :
                            order.status === 'in_progress' ? 'secondary' :
                            'outline'
                          }>
                            {order.status.replace('_', ' ')}
                          </Badge>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Messages</h2>
              <p className="text-muted-foreground">Communicate with buyers and sellers</p>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
              {/* Conversation List */}
              <div className="lg:col-span-2">
                <ConversationList
                  conversations={mockConversations}
                  selectedConversationId={selectedConversationId}
                  onSelectConversation={setSelectedConversationId}
                  onSearch={(query) => console.log('Search conversations:', query)}
                />
              </div>

              {/* Chat Interface */}
              <div className="lg:col-span-3">
                {selectedConversationId ? (
                  <ChatInterface
                    messages={mockMessages}
                    currentUser={user}
                    otherUser={mockConversations[0].participants[1]}
                    onSendMessage={(content, attachments) => {
                      console.log('Send message:', { content, attachments });
                      // TODO: Implement real message sending
                    }}
                    onFileUpload={(files) => {
                      console.log('Upload files:', files);
                      // TODO: Implement file upload
                    }}
                  />
                ) : (
                  <Card className="h-[600px] bg-gradient-card border-border/50 flex items-center justify-center">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
                      <p className="text-muted-foreground">
                        Choose a conversation to start messaging
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Analytics</h2>
              <p className="text-muted-foreground">Track your performance and earnings</p>
            </div>

            {analytics ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.earnings.total.toFixed(3)} ETH</div>
                    <div className="text-xs text-green-500">+{analytics.earnings.growth}% this month</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.orders.total}</div>
                    <div className="text-xs text-green-500">+{analytics.orders.growth}% this month</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.performance.responseTime}</div>
                    <div className="text-xs text-muted-foreground">Average response</div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.performance.satisfactionRate}%</div>
                    <div className="text-xs text-green-500">Excellent rating</div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Complete your first order to see analytics
                </p>
                <Button onClick={() => setActiveTab('marketplace')}>
                  Browse Marketplace
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">Profile Settings</h2>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Card */}
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Your Profile</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowOnboarding(true)}
                      >
                        Complete Setup
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={user.avatar} alt={user.displayName} />
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {user.displayName?.charAt(0) || user.address.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">
                          {user.displayName || `User ${user.address.slice(0, 6)}...`}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{user.level.name}</Badge>
                          {user.isVerified && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {user.bio || 'No bio available. Complete your profile to get more orders.'}
                        </p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{user.completedOrders}</div>
                        <div className="text-sm text-muted-foreground">Orders</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{user.rating.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{user.responseTime}</div>
                        <div className="text-sm text-muted-foreground">Response</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Reviews */}
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      Recent Reviews
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mockReviews.length > 0 ? (
                      <div className="space-y-4">
                        {mockReviews.slice(0, 3).map((review) => (
                          <ReviewCard
                            key={review.id}
                            review={review}
                            onHelpful={handleReviewHelpful}
                            onNotHelpful={handleReviewNotHelpful}
                            onReply={handleReplyToReview}
                            showReplyButton={true}
                          />
                        ))}
                        <Button variant="outline" className="w-full">
                          View All Reviews
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No reviews yet</h3>
                        <p className="text-sm text-muted-foreground">
                          Complete your first order to receive reviews
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Review Summary */}
                <ReviewSummary reviews={mockReviews} />

                {/* Skills */}
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {user.skills && user.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-muted-foreground mb-3">
                          Add skills to help clients find you
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowOnboarding(true)}
                        >
                          Add Skills
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Languages */}
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle>Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.languages.map((language) => (
                        <Badge key={language} variant="outline">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Gig Creation Wizard */}
      {showGigCreation && (
        <GigCreationWizard
          onClose={() => setShowGigCreation(false)}
          onSuccess={handleGigCreated}
        />
      )}

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <OnboardingWizard
            currentUser={user}
            onComplete={handleCompleteOnboarding}
            onSkip={() => setShowOnboarding(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EnhancedDashboard;