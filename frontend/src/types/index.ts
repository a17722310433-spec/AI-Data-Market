// 用户相关类型
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'enterprise' | 'admin';
  balance: number;
  totalEarnings: number;
  createdAt: string;
  isVerified: boolean;
}

// 企业用户类型
export interface EnterpriseUser extends User {
  companyName: string;
  businessLicense: string;
  industry: string;
  website?: string;
  verifiedAt?: string;
}

// 对话数据类型
export interface ConversationData {
  id: string;
  userId: string;
  platform: 'chatgpt' | 'claude' | 'wenxin' | 'other';
  title: string;
  messages: Message[];
  quality: number;
  estimatedValue: number;
  category: string;
  tags: string[];
  duration: number; // 秒
  messageCount: number;
  status: 'pending' | 'processing' | 'evaluated' | 'published' | 'sold';
  uploadedAt: string;
  processedAt?: string;
  fileName: string;
  fileSize: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tokens?: number;
}

// 评估结果类型
export interface EvaluationResult {
  quality: number;
  categories: string[];
  tags: string[];
  estimatedValue: number;
  summary: string;
  insights: string[];
  recommendations: string[];
}

// 订单类型
export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  dataId: string;
  amount: number;
  platformFee: number;
  sellerEarnings: number;
  status: 'pending' | 'paid' | 'delivered' | 'completed' | 'disputed' | 'refunded';
  stripePaymentId?: string;
  createdAt: string;
  paidAt?: string;
  completedAt?: string;
}

// 提现类型
export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  method: 'bank' | 'paypal' | 'crypto';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  bankAccount?: string;
  stripePayoutId?: string;
  createdAt: string;
  processedAt?: string;
}

// 市场数据筛选类型
export interface MarketFilters {
  platform?: string;
  category?: string;
  minQuality?: number;
  maxQuality?: number;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  minMessages?: number;
  maxMessages?: number;
  sortBy?: 'quality' | 'price' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 统计数据类型
export interface DashboardStats {
  totalUsers: number;
  totalDataUploaded: number;
  totalTransactions: number;
  totalVolume: number;
  todayUploads: number;
  todayTransactions: number;
}

export interface UserStats {
  totalUploads: number;
  totalSold: number;
  totalEarnings: number;
  pendingEarnings: number;
  averageQuality: number;
  topCategories: string[];
}

// 上传文件类型
export interface UploadFile {
  name: string;
  size: number;
  type: string;
  platform: string;
}

// 平台配置类型
export interface PlatformConfig {
  name: string;
  icon: string;
  supportedFormats: string[];
  exportInstructions: string;
}

// 支持的平台列表
export const SUPPORTED_PLATFORMS: PlatformConfig[] = [
  {
    name: 'ChatGPT',
    icon: '🤖',
    supportedFormats: ['json', 'html', 'md'],
    exportInstructions: 'Settings → Data controls → Export data'
  },
  {
    name: 'Claude',
    icon: '🧠',
    supportedFormats: ['json', 'csv', 'txt'],
    exportInstructions: 'Settings → Account → Export data'
  },
  {
    name: '文心一言',
    icon: '📝',
    supportedFormats: ['json', 'txt'],
    exportInstructions: '个人中心 → 数据导出'
  },
  {
    name: '其他平台',
    icon: '💬',
    supportedFormats: ['json', 'txt', 'csv'],
    exportInstructions: '支持通用JSON/TXT格式'
  }
];

// 数据分类
export const DATA_CATEGORIES = [
  { id: 'coding', name: '编程开发', icon: '💻', count: 0 },
  { id: 'writing', name: '写作创作', icon: '✍️', count: 0 },
  { id: 'analysis', name: '数据分析', icon: '📊', count: 0 },
  { id: 'research', name: '学术研究', icon: '🔬', count: 0 },
  { id: 'business', name: '商业咨询', icon: '💼', count: 0 },
  { id: 'creative', name: '创意灵感', icon: '🎨', count: 0 },
  { id: 'language', name: '语言学习', icon: '🌍', count: 0 },
  { id: 'other', name: '其他', icon: '📌', count: 0 }
];
