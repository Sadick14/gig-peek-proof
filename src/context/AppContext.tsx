import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAccount } from 'wagmi';
import { wagmiWeb3Service } from '@/services/wagmiWeb3Service';
import { User, Deal, Gig, Order, SearchFilters, Analytics } from '@/types';
import { FREELANCER_LEVELS } from '@/constants';

interface AppContextType {
  // User state
  user: User;
  connectWallet: (address: string) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
  // Legacy deals (for backward compatibility)
  deals: Deal[];
  isLoadingDeals: boolean;
  addDeal: (deal: Deal) => void;
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
  refreshDeals: () => Promise<void>;
  
  // New gig system
  gigs: Gig[];
  isLoadingGigs: boolean;
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  searchGigs: (filters: SearchFilters) => Promise<Gig[]>;
  createGig: (gig: Omit<Gig, 'id' | 'sellerId' | 'seller' | 'createdAt' | 'updatedAt'>) => Promise<Gig>;
  updateGig: (gigId: string, updates: Partial<Gig>) => Promise<void>;
  deleteGig: (gigId: string) => Promise<void>;
  
  // Order management
  orders: Order[];
  isLoadingOrders: boolean;
  createOrder: (gigId: string, packageType: 'basic' | 'standard' | 'premium', requirements?: any) => Promise<Order>;
  updateOrder: (orderId: string, updates: Partial<Order>) => Promise<void>;
  
  // Analytics
  analytics: Analytics | null;
  isLoadingAnalytics: boolean;
  refreshAnalytics: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(false);
  
  // New gig system state
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoadingGigs, setIsLoadingGigs] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  
  // Use Wagmi's useAccount hook for wallet connection state
  const { address, isConnected } = useAccount();
  
  // Create enhanced user object from Wagmi state (temporary mock for testing)
  const user: User = {
    id: address || "0x742d35Cc4Bf2D4C2c5f5c9b4c1e5B8C9D1f3E6f8",
    address: address || "0x742d35Cc4Bf2D4C2c5f5c9b4c1e5B8C9D1f3E6f8",
    isConnected: isConnected || true, // Mock connection for testing
    displayName: "Alex Chen",
    bio: "Full-stack developer specializing in React, Node.js, and blockchain development. 5+ years of experience building scalable web applications.",
    level: FREELANCER_LEVELS[1], // Level 1 seller
    badges: [
      {
        id: 'verified',
        name: 'Verified Seller',
        description: 'Identity verified seller',
        icon: 'shield-check',
        color: '#10B981',
        earnedAt: new Date('2024-01-01')
      }
    ],
    rating: 4.8,
    reviewCount: 127,
    memberSince: new Date('2023-06-15'),
    completedOrders: 89,
    responseTime: "within 1 hour",
    languages: ["English", "Spanish", "Mandarin"],
    skills: ["React", "Node.js", "TypeScript", "Solidity", "Web3", "UI/UX Design"],
    portfolio: [
      {
        id: 'portfolio-1',
        title: 'DeFi Trading Dashboard',
        description: 'Real-time crypto trading interface with advanced charts',
        imageUrl: '',
        tags: ['React', 'Web3', 'DeFi'],
        createdAt: new Date('2023-12-01')
      }
    ],
    isVerified: true,
    isOnline: true,
    lastSeen: new Date()
  };

  // Function to fetch deals from blockchain
  const refreshDeals = async () => {
    if (!isConnected || !address) {
      console.log('No wallet connected, clearing deals');
      setDeals([]);
      return;
    }

    console.log('Fetching deals for address:', address);
    setIsLoadingDeals(true);
    try {
      console.log('Initializing wagmiWeb3Service...');
      await wagmiWeb3Service.initialize();
      console.log('Fetching deals from blockchain...');
      const blockchainDeals = await wagmiWeb3Service.getAllDealsForUser(address);
      console.log('Fetched deals:', blockchainDeals);
      setDeals(blockchainDeals);
    } catch (error) {
      console.error('Error fetching deals from blockchain:', error);
      // Keep existing deals if fetch fails
    } finally {
      setIsLoadingDeals(false);
    }
  };

  // Fetch deals when user connects or changes
  useEffect(() => {
    if (isConnected && address) {
      refreshDeals();
    } else {
      setDeals([]);
    }
  }, [isConnected, address]);

  // Legacy connect function for compatibility (Wagmi handles connection automatically)
  const connectWallet = (walletAddress: string) => {
    // This is now handled by Wagmi, but we keep for compatibility
    // The actual connection is managed by MultiWalletConnection component
    console.log('Wallet connection handled by Wagmi:', walletAddress);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    // In a real app, this would update the user profile in the backend
    console.log('User profile update:', updates);
  };

  // New gig system functions
  const searchGigs = async (filters: SearchFilters): Promise<Gig[]> => {
    setIsLoadingGigs(true);
    try {
      // Simulate API call - in real app, this would search the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock gigs for now
      const mockGigs: Gig[] = generateMockGigs();
      setGigs(mockGigs);
      return mockGigs;
    } catch (error) {
      console.error('Error searching gigs:', error);
      return [];
    } finally {
      setIsLoadingGigs(false);
    }
  };

  const createGig = async (gigData: Omit<Gig, 'id' | 'sellerId' | 'seller' | 'createdAt' | 'updatedAt'>): Promise<Gig> => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }
    
    const newGig: Gig = {
      ...gigData,
      id: Math.random().toString(36).substr(2, 9),
      sellerId: address,
      seller: user,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setGigs(prev => [...prev, newGig]);
    return newGig;
  };

  const updateGig = async (gigId: string, updates: Partial<Gig>): Promise<void> => {
    setGigs(prev => prev.map(gig => 
      gig.id === gigId ? { ...gig, ...updates, updatedAt: new Date() } : gig
    ));
  };

  const deleteGig = async (gigId: string): Promise<void> => {
    setGigs(prev => prev.filter(gig => gig.id !== gigId));
  };

  const createOrder = async (
    gigId: string, 
    packageType: 'basic' | 'standard' | 'premium', 
    requirements?: any
  ): Promise<Order> => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }
    
    const gig = gigs.find(g => g.id === gigId);
    if (!gig) {
      throw new Error('Gig not found');
    }
    
    const selectedPackage = gig.packages.find(p => p.type === packageType);
    if (!selectedPackage) {
      throw new Error('Package not found');
    }
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      gigId,
      gig,
      buyerId: address,
      buyer: user,
      sellerId: gig.sellerId,
      seller: gig.seller,
      packageType,
      selectedPackage,
      customRequirements: requirements,
      status: 'pending_requirements',
      amount: selectedPackage.price,
      deliveryDate: new Date(Date.now() + selectedPackage.deliveryTime * 24 * 60 * 60 * 1000),
      requirements: [],
      deliverables: [],
      revisions: [],
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>): Promise<void> => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, ...updates, updatedAt: new Date() } : order
    ));
  };

  const refreshAnalytics = async (): Promise<void> => {
    if (!isConnected || !address) return;
    
    setIsLoadingAnalytics(true);
    try {
      // Simulate analytics fetch
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockAnalytics: Analytics = generateMockAnalytics();
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };


  const addDeal = (deal: Deal) => {
    setDeals(prev => [...prev, deal]);
    // Also refresh deals to get the latest from blockchain
    refreshDeals();
  };

  const updateDeal = (dealId: string, updates: Partial<Deal>) => {
    setDeals(prev => 
      prev.map(deal => 
        deal.id === dealId ? { ...deal, ...updates } : deal
      )
    );
  };

  return (
    <AppContext.Provider value={{
      // User state
      user,
      connectWallet,
      updateUserProfile,
      
      // Legacy deals
      deals,
      isLoadingDeals,
      addDeal,
      updateDeal,
      refreshDeals,
      
      // New gig system
      gigs,
      isLoadingGigs,
      searchFilters,
      setSearchFilters,
      searchGigs,
      createGig,
      updateGig,
      deleteGig,
      
      // Order management
      orders,
      isLoadingOrders,
      createOrder,
      updateOrder,
      
      // Analytics
      analytics,
      isLoadingAnalytics,
      refreshAnalytics
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Helper functions to generate mock data
function generateMockGigs(): Gig[] {
  // This would be replaced with actual API calls
  return [
    {
      id: '1',
      sellerId: '0x1234...5678',
      seller: {
        id: '0x1234...5678',
        address: '0x1234...5678',
        username: 'webdev_pro',
        displayName: 'Professional Web Developer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isConnected: false,
        level: FREELANCER_LEVELS[2],
        badges: [],
        rating: 4.9,
        reviewCount: 127,
        memberSince: new Date('2023-01-15'),
        completedOrders: 89,
        responseTime: 'within 1 hour',
        languages: ['English', 'Spanish'],
        skills: ['React', 'TypeScript', 'Node.js'],
        portfolio: [],
        isVerified: true,
        isOnline: true,
        lastSeen: new Date()
      },
      title: 'I will develop a modern React web application with TypeScript',
      description: 'Professional React development with TypeScript, featuring responsive design, clean code, and modern best practices.',
      category: {
        id: 'programming',
        name: 'Programming & Tech',
        slug: 'programming-tech',
        description: 'Software development services',
        icon: '💻',
        subcategories: []
      },
      subcategory: {
        id: 'web-dev',
        categoryId: 'programming',
        name: 'Web Development',
        slug: 'web-development',
        description: 'Frontend and backend web development'
      },
      tags: ['react', 'typescript', 'web-development', 'frontend'],
      images: [
        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop'
      ],
      packages: [
        {
          id: 'basic-1',
          type: 'basic',
          title: 'Basic Website',
          description: 'Simple responsive website with up to 3 pages',
          price: '0.5',
          deliveryTime: 7,
          revisions: 2,
          features: ['Responsive design', '3 pages', 'Basic styling', 'Mobile-friendly']
        },
        {
          id: 'standard-1',
          type: 'standard',
          title: 'Professional Website',
          description: 'Full-featured website with advanced functionality',
          price: '1.2',
          deliveryTime: 14,
          revisions: 3,
          features: ['Responsive design', '7 pages', 'Contact forms', 'SEO optimization', 'Admin panel'],
          isPopular: true
        },
        {
          id: 'premium-1',
          type: 'premium',
          title: 'Enterprise Solution',
          description: 'Complete web application with custom features',
          price: '2.5',
          deliveryTime: 21,
          revisions: 5,
          features: ['Responsive design', 'Unlimited pages', 'Custom functionality', 'Database integration', 'API development', 'Deployment']
        }
      ],
      rating: 4.9,
      reviewCount: 45,
      isActive: true,
      isPaused: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-12-01'),
      totalOrders: 45,
      inQueue: 3,
      impressions: 1250,
      clicks: 89,
      faqs: [
        {
          id: 'faq-1',
          question: 'Do you provide source code?',
          answer: 'Yes, all packages include full source code with documentation.'
        },
        {
          id: 'faq-2',
          question: 'Can you work with my existing design?',
          answer: 'Absolutely! I can work with your designs or create new ones.'
        }
      ],
      requirements: ['Project description', 'Design preferences', 'Content and images']
    }
  ];
}

function generateMockAnalytics(): Analytics {
  return {
    period: 'month',
    earnings: {
      total: 12.5,
      growth: 15.2,
      chart: [
        { date: '2024-11-01', value: 2.1 },
        { date: '2024-11-08', value: 3.2 },
        { date: '2024-11-15', value: 2.8 },
        { date: '2024-11-22', value: 4.4 },
        { date: '2024-11-29', value: 3.7 }
      ]
    },
    orders: {
      total: 23,
      completed: 20,
      inProgress: 3,
      cancelled: 0,
      growth: 8.7,
      chart: [
        { date: '2024-11-01', value: 4 },
        { date: '2024-11-08', value: 6 },
        { date: '2024-11-15', value: 5 },
        { date: '2024-11-22', value: 8 },
        { date: '2024-11-29', value: 7 }
      ]
    },
    performance: {
      responseTime: '2 hours',
      deliveryTime: '3 days',
      completionRate: 95.2,
      satisfactionRate: 98.1
    },
    gigs: [
      {
        gigId: '1',
        title: 'React Web Application',
        impressions: 1250,
        clicks: 89,
        clickRate: 7.1,
        orders: 12,
        conversionRate: 13.5,
        earnings: 8.2,
        rating: 4.9
      }
    ]
  };
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}