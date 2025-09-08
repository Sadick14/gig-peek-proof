import { Category, FreelancerLevel } from '@/types';

export const FREELANCER_LEVELS: FreelancerLevel[] = [
  {
    id: 'new-seller',
    name: 'New Seller',
    color: '#6B7280',
    requirements: {
      completedOrders: 0,
      rating: 0,
      responseRate: 0,
      onTimeDelivery: 0
    },
    benefits: [
      'Create up to 3 active gigs',
      'Basic customer support',
      'Community forum access'
    ]
  },
  {
    id: 'level-1',
    name: 'Level 1',
    color: '#10B981',
    requirements: {
      completedOrders: 10,
      rating: 4.7,
      responseRate: 90,
      onTimeDelivery: 90
    },
    benefits: [
      'Create up to 10 active gigs',
      'Priority customer support',
      'Enhanced gig visibility',
      'Custom gig extras'
    ]
  },
  {
    id: 'level-2',
    name: 'Level 2',
    color: '#3B82F6',
    requirements: {
      completedOrders: 50,
      rating: 4.8,
      responseRate: 95,
      onTimeDelivery: 95
    },
    benefits: [
      'Create up to 20 active gigs',
      'VIP customer support',
      'Featured in search results',
      'Custom gig packages',
      'Bulk order discounts'
    ]
  },
  {
    id: 'top-rated',
    name: 'Top Rated',
    color: '#F59E0B',
    requirements: {
      completedOrders: 100,
      rating: 4.9,
      responseRate: 98,
      onTimeDelivery: 98
    },
    benefits: [
      'Unlimited active gigs',
      'Dedicated account manager',
      'Top placement in search',
      'Early access to new features',
      'Revenue-based rewards',
      'Custom profile badge'
    ]
  }
];

export const CATEGORIES: Category[] = [
  {
    id: 'programming',
    name: 'Programming & Tech',
    slug: 'programming-tech',
    description: 'Software development, web development, mobile apps, and technical services',
    icon: '💻',
    subcategories: [
      {
        id: 'web-dev',
        categoryId: 'programming',
        name: 'Web Development',
        slug: 'web-development',
        description: 'Frontend, backend, and full-stack web development'
      },
      {
        id: 'mobile-dev',
        categoryId: 'programming',
        name: 'Mobile Development',
        slug: 'mobile-development',
        description: 'iOS, Android, and cross-platform mobile apps'
      },
      {
        id: 'blockchain',
        categoryId: 'programming',
        name: 'Blockchain & Web3',
        slug: 'blockchain-web3',
        description: 'Smart contracts, DApps, and blockchain development'
      },
      {
        id: 'ai-ml',
        categoryId: 'programming',
        name: 'AI & Machine Learning',
        slug: 'ai-machine-learning',
        description: 'AI models, data science, and machine learning solutions'
      },
      {
        id: 'devops',
        categoryId: 'programming',
        name: 'DevOps & Cloud',
        slug: 'devops-cloud',
        description: 'Infrastructure, deployment, and cloud services'
      }
    ]
  },
  {
    id: 'design',
    name: 'Design & Creative',
    slug: 'design-creative',
    description: 'Graphic design, UI/UX, branding, and creative services',
    icon: '🎨',
    subcategories: [
      {
        id: 'graphic-design',
        categoryId: 'design',
        name: 'Graphic Design',
        slug: 'graphic-design',
        description: 'Logos, branding, print design, and digital graphics'
      },
      {
        id: 'ui-ux',
        categoryId: 'design',
        name: 'UI/UX Design',
        slug: 'ui-ux-design',
        description: 'User interface and user experience design'
      },
      {
        id: 'illustration',
        categoryId: 'design',
        name: 'Illustration',
        slug: 'illustration',
        description: 'Digital and traditional illustrations'
      },
      {
        id: '3d-animation',
        categoryId: 'design',
        name: '3D & Animation',
        slug: '3d-animation',
        description: '3D modeling, animation, and motion graphics'
      }
    ]
  },
  {
    id: 'writing',
    name: 'Writing & Translation',
    slug: 'writing-translation',
    description: 'Content writing, copywriting, translation, and editing services',
    icon: '✍️',
    subcategories: [
      {
        id: 'content-writing',
        categoryId: 'writing',
        name: 'Content Writing',
        slug: 'content-writing',
        description: 'Blog posts, articles, and web content'
      },
      {
        id: 'copywriting',
        categoryId: 'writing',
        name: 'Copywriting',
        slug: 'copywriting',
        description: 'Sales copy, marketing materials, and advertising'
      },
      {
        id: 'translation',
        categoryId: 'writing',
        name: 'Translation',
        slug: 'translation',
        description: 'Document and content translation services'
      },
      {
        id: 'editing',
        categoryId: 'writing',
        name: 'Editing & Proofreading',
        slug: 'editing-proofreading',
        description: 'Content editing, proofreading, and review'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    description: 'SEO, social media, advertising, and marketing services',
    icon: '📈',
    subcategories: [
      {
        id: 'seo',
        categoryId: 'marketing',
        name: 'SEO',
        slug: 'seo',
        description: 'Search engine optimization and organic traffic'
      },
      {
        id: 'social-media',
        categoryId: 'marketing',
        name: 'Social Media Marketing',
        slug: 'social-media-marketing',
        description: 'Social media management and advertising'
      },
      {
        id: 'ppc',
        categoryId: 'marketing',
        name: 'PPC Advertising',
        slug: 'ppc-advertising',
        description: 'Google Ads, Facebook Ads, and paid advertising'
      },
      {
        id: 'email-marketing',
        categoryId: 'marketing',
        name: 'Email Marketing',
        slug: 'email-marketing',
        description: 'Email campaigns and automation'
      }
    ]
  },
  {
    id: 'video',
    name: 'Video & Animation',
    slug: 'video-animation',
    description: 'Video editing, production, and animation services',
    icon: '🎬',
    subcategories: [
      {
        id: 'video-editing',
        categoryId: 'video',
        name: 'Video Editing',
        slug: 'video-editing',
        description: 'Video editing and post-production'
      },
      {
        id: 'animation',
        categoryId: 'video',
        name: 'Animation',
        slug: 'animation',
        description: '2D/3D animation and motion graphics'
      },
      {
        id: 'video-production',
        categoryId: 'video',
        name: 'Video Production',
        slug: 'video-production',
        description: 'Video shooting and production services'
      }
    ]
  },
  {
    id: 'music',
    name: 'Music & Audio',
    slug: 'music-audio',
    description: 'Music production, audio editing, and sound services',
    icon: '🎵',
    subcategories: [
      {
        id: 'music-production',
        categoryId: 'music',
        name: 'Music Production',
        slug: 'music-production',
        description: 'Music composition and production'
      },
      {
        id: 'audio-editing',
        categoryId: 'music',
        name: 'Audio Editing',
        slug: 'audio-editing',
        description: 'Audio editing and mastering'
      },
      {
        id: 'voice-over',
        categoryId: 'music',
        name: 'Voice Over',
        slug: 'voice-over',
        description: 'Voice over and narration services'
      }
    ]
  },
  {
    id: 'business',
    name: 'Business',
    slug: 'business',
    description: 'Business consulting, data entry, and administrative services',
    icon: '💼',
    subcategories: [
      {
        id: 'business-plans',
        categoryId: 'business',
        name: 'Business Plans',
        slug: 'business-plans',
        description: 'Business planning and strategy'
      },
      {
        id: 'data-entry',
        categoryId: 'business',
        name: 'Data Entry',
        slug: 'data-entry',
        description: 'Data entry and processing services'
      },
      {
        id: 'virtual-assistant',
        categoryId: 'business',
        name: 'Virtual Assistant',
        slug: 'virtual-assistant',
        description: 'Administrative and support services'
      }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Personal services, fitness, gaming, and lifestyle content',
    icon: '🌟',
    subcategories: [
      {
        id: 'fitness',
        categoryId: 'lifestyle',
        name: 'Fitness',
        slug: 'fitness',
        description: 'Personal training and fitness coaching'
      },
      {
        id: 'gaming',
        categoryId: 'lifestyle',
        name: 'Gaming',
        slug: 'gaming',
        description: 'Gaming services and coaching'
      },
      {
        id: 'travel',
        categoryId: 'lifestyle',
        name: 'Travel',
        slug: 'travel',
        description: 'Travel planning and guidance'
      }
    ]
  }
];

export const DEFAULT_GIG_PACKAGES = [
  {
    type: 'basic' as const,
    title: 'Basic',
    description: 'Essential package for getting started',
    deliveryTime: 3,
    revisions: 1,
    features: ['Basic delivery', 'Standard support']
  },
  {
    type: 'standard' as const,
    title: 'Standard',
    description: 'Most popular package with additional features',
    deliveryTime: 2,
    revisions: 3,
    features: ['Fast delivery', 'Priority support', 'Source files'],
    isPopular: true
  },
  {
    type: 'premium' as const,
    title: 'Premium',
    description: 'Complete package with all features included',
    deliveryTime: 1,
    revisions: 5,
    features: ['Express delivery', 'VIP support', 'Source files', 'Commercial license', 'Multiple concepts']
  }
];

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'best_selling', label: 'Best Selling' },
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' }
];

export const DELIVERY_TIME_OPTIONS = [
  { value: [1, 1], label: 'Express 24H' },
  { value: [1, 3], label: 'Up to 3 days' },
  { value: [1, 7], label: 'Up to 1 week' },
  { value: [1, 30], label: 'Up to 1 month' }
];

export const SELLER_LEVEL_OPTIONS = [
  { value: 'new-seller', label: 'New Seller' },
  { value: 'level-1', label: 'Level 1' },
  { value: 'level-2', label: 'Level 2' },
  { value: 'top-rated', label: 'Top Rated' }
];