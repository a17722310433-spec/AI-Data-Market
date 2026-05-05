import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
// API_BASE_URL already includes the /api prefix in the route paths, no need to add it again
const API_URL = API_BASE_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-storage');
      if (token) {
        const { state } = JSON.parse(token);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 认证相关API
export const authAPI = {
  register: (data: { email: string; password: string; name: string; role: string }) =>
    api.post('/api/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  
  logout: () => api.post('/api/auth/logout'),
  
  getProfile: () => api.get('/api/auth/profile'),
  
  updateProfile: (data: Partial<{ name: string; avatar: string }>) =>
    api.put('/api/auth/profile', data),
};

// 用户相关API
export const userAPI = {
  getStats: () => api.get('/api/users/stats'),
  
  getEarnings: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/api/users/earnings', { params }),
  
  getBalance: () => api.get('/api/users/balance'),
};

// 数据相关API
export const dataAPI = {
  upload: (formData: FormData) =>
    api.post('/api/data/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getMyData: (params?: { page?: number; limit?: number }) =>
    api.get('/api/data/my', { params }),
  
  getDataById: (id: string) => api.get(`/api/data/${id}`),
  
  evaluateData: (data: { content: string; platform: string }) =>
    api.post('/api/data/evaluate', data),
  
  deleteData: (id: string) => api.delete(`/api/data/${id}`),
  
  getMarketData: (params?: Record<string, any>) =>
    api.get('/api/data/market', { params }),
};

// 订单相关API
export const orderAPI = {
  createOrder: (dataId: string) => api.post('/api/orders', { dataId }),
  
  getMyOrders: (params?: { type: 'buyer' | 'seller'; page?: number; limit?: number }) =>
    api.get('/api/orders', { params }),
  
  getOrderById: (id: string) => api.get(`/api/orders/${id}`),
  
  confirmDelivery: (id: string) => api.post(`/api/orders/${id}/confirm`),
  
  disputeOrder: (id: string, reason: string) =>
    api.post(`/api/orders/${id}/dispute`, { reason }),
};

// 支付相关API
export const paymentAPI = {
  createCheckoutSession: (orderId: string) =>
    api.post('/api/payments/checkout', { orderId }),
  
  getPaymentStatus: (paymentId: string) =>
    api.get(`/api/payments/${paymentId}`),
  
  createWithdrawal: (data: { amount: number; method: string; bankAccount?: string }) =>
    api.post('/api/payments/withdraw', data),
  
  getWithdrawals: () => api.get('/api/payments/withdrawals'),
  
  getTransactions: (params?: { type?: string; startDate?: string; endDate?: string }) =>
    api.get('/api/payments/transactions', { params }),
};

// 企业相关API
export const enterpriseAPI = {
  register: (data: {
    email: string;
    password: string;
    companyName: string;
    businessLicense: string;
    industry: string;
    website?: string;
  }) => api.post('/api/enterprise/register', data),
  
  verify: (data: { verificationDoc: string }) =>
    api.post('/api/enterprise/verify', data),
  
  getVerificationStatus: () => api.get('/api/enterprise/status'),
};

// 统计数据API
export const statsAPI = {
  getDashboardStats: () => api.get('/api/stats/dashboard'),
  
  getMarketStats: () => api.get('/api/stats/market'),
};

export default api;
