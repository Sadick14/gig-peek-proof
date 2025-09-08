// Core types for GigPeek platform

export interface User {
  id: string;
  address: string;
  username?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  isConnected: boolean;
  level: FreelancerLevel;
  badges: Badge[];
  rating: number;
  reviewCount: number;
  memberSince: Date;
  completedOrders: number;
  responseTime: string; // e.g., "within 1 hour"
  languages: string[];
  skills: string[];
  portfolio: PortfolioItem[];
  isVerified: boolean;
  isOnline: boolean;
  lastSeen: Date;
}

export interface FreelancerLevel {
  id: string;
  name: 'New Seller' | 'Level 1' | 'Level 2' | 'Top Rated';
  color: string;
  requirements: {
    completedOrders: number;
    rating: number;
    responseRate: number;
    onTimeDelivery: number;
  };
  benefits: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earnedAt: Date;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
  tags: string[];
  createdAt: Date;
}

export interface GigPackage {
  id: string;
  type: 'basic' | 'standard' | 'premium';
  title: string;
  description: string;
  price: string; // in ETH
  deliveryTime: number; // in days
  revisions: number;
  features: string[];
  isPopular?: boolean;
}

export interface Gig {
  id: string;
  sellerId: string;
  seller: User;
  title: string;
  description: string;
  category: Category;
  subcategory?: Subcategory;
  tags: string[];
  images: string[];
  video?: string;
  packages: GigPackage[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isPaused: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalOrders: number;
  inQueue: number;
  impressions: number;
  clicks: number;
  faqs: FAQ[];
  requirements: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Order {
  id: string;
  gigId: string;
  gig: Gig;
  buyerId: string;
  buyer: User;
  sellerId: string;
  seller: User;
  packageType: 'basic' | 'standard' | 'premium';
  selectedPackage: GigPackage;
  customRequirements?: string;
  status: OrderStatus;
  amount: string; // in ETH
  escrowTxHash?: string;
  deliveryDate: Date;
  deliveredAt?: Date;
  requirements: OrderRequirement[];
  deliverables: Deliverable[];
  revisions: Revision[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending_requirements'
  | 'in_progress' 
  | 'delivered'
  | 'revision_requested'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface OrderRequirement {
  id: string;
  question: string;
  answer: string;
  type: 'text' | 'file' | 'multiple_choice';
  isRequired: boolean;
}

export interface Deliverable {
  id: string;
  orderId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  description?: string;
  uploadedAt: Date;
}

export interface Revision {
  id: string;
  orderId: string;
  reason: string;
  description: string;
  requestedBy: string;
  requestedAt: Date;
  respondedAt?: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Review {
  id: string;
  orderId: string;
  gigId: string;
  reviewerId: string;
  reviewer: User;
  revieweeId: string;
  reviewee: User;
  rating: number;
  comment: string;
  images?: string[];
  helpful: number;
  notHelpful: number;
  createdAt: Date;
  response?: ReviewResponse;
}

export interface ReviewResponse {
  id: string;
  reviewId: string;
  comment: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  orderId?: string;
  senderId: string;
  sender: User;
  receiverId: string;
  receiver: User;
  content: string;
  attachments: MessageAttachment[];
  isRead: boolean;
  sentAt: Date;
  editedAt?: Date;
  type: 'text' | 'file' | 'order_update' | 'system';
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage: Message;
  unreadCount: number;
  orderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  deliveryTime?: number[];
  sellerLevel?: string[];
  rating?: number;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'best_selling';
  proDelivery?: boolean;
  localSellers?: boolean;
  onlineSellers?: boolean;
}

export interface Analytics {
  period: 'week' | 'month' | 'year';
  earnings: {
    total: number;
    growth: number;
    chart: DataPoint[];
  };
  orders: {
    total: number;
    completed: number;
    inProgress: number;
    cancelled: number;
    growth: number;
    chart: DataPoint[];
  };
  performance: {
    responseTime: string;
    deliveryTime: string;
    completionRate: number;
    satisfactionRate: number;
  };
  gigs: GigAnalytics[];
}

export interface GigAnalytics {
  gigId: string;
  title: string;
  impressions: number;
  clicks: number;
  clickRate: number;
  orders: number;
  conversionRate: number;
  earnings: number;
  rating: number;
}

export interface DataPoint {
  date: string;
  value: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'order' | 'message' | 'review' | 'payment' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: string;
  isCompleted: boolean;
  isRequired: boolean;
}

// Legacy Deal interface for backward compatibility
export interface Deal {
  id: string;
  contractorAddress: string;
  clientAddress?: string;
  title?: string;
  description: string;
  amount: string;
  deadline?: string;
  status: 'active' | 'waiting_proof' | 'proof_submitted' | 'completed';
  createdAt: Date;
  proofHash?: string;
  txHash?: string;
  transactionHash?: string;
  userRole?: 'client' | 'contractor';
  packages?: GigPackage[];
  selectedPackage?: GigPackage;
  category?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
}