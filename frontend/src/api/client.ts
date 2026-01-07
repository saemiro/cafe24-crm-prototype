import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'https://crm-api.saemiro.com/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Types
export interface DashboardStats {
  totalCustomers: number;
  totalCustomersChange: number;
  monthlyRevenue: number;
  monthlyRevenueChange: number;
  totalOrders: number;
  totalOrdersChange: number;
  activeCustomers: number;
  activeCustomersChange: number;
}

export interface RevenueChartData {
  month: string;
  revenue: number;
  orders: number;
}

export interface SegmentDistribution {
  segment: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  items: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface TopCustomer {
  id: string;
  name: string;
  email: string;
  segment: string;
  totalOrders: number;
  totalRevenue: number;
  lastOrderDate: string;
}

export interface RfmSegment {
  segment: string;
  description: string;
  count: number;
  percentage: number;
  avgRecency: number;
  avgFrequency: number;
  avgMonetary: number;
  color: string;
  r: number;
  f: number;
  m: number;
}

export interface FunnelStep {
  step: string;
  label: string;
  value: number;
  percentage: number;
  dropoff: number;
  previousValue?: number;
}

export interface CohortRow {
  cohort: string;
  totalUsers: number;
  retention: number[];
}

export interface ClvPrediction {
  customerId: string;
  currentClv: number;
  predictedClv: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  segment: string;
  rfmScore: { r: number; f: number; m: number };
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  lastOrderDate: string;
  createdAt: string;
  tags: string[];
}

export interface CustomerDetail extends Customer {
  address?: string;
  birthDate?: string;
  gender?: string;
  clv: number;
  predictedClv: number;
  churnRisk: number;
  productAffinities: { category: string; score: number }[];
}

export interface Order {
  id: string;
  orderNumber: string;
  amount: number;
  items: { name: string; quantity: number; price: number }[];
  status: string;
  createdAt: string;
}

export interface ProductRecommendation {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  score: number;
  reason: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'kakao';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  targetSegment: string;
  targetCount: number;
  sentCount: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export const api = {
  // Auth
  getAuthUrl: (mallId: string) =>
    apiClient.get<{ authorization_url: string }>('/auth/cafe24/authorize', {
      params: { mallId },
    }),

  exchangeToken: (mallId: string, code: string) =>
    apiClient.post('/auth/cafe24/token', { mall_id: mallId, code }),

  // AI
  chat: (query: string, model?: string) =>
    apiClient.post<{ response: string; model: string }>('/ai/chat', { query, model }),

  getInsight: (query: string) =>
    apiClient.post<{ insight: string; query: string }>('/ai/insight', { query }),

  // Dashboard
  getDashboardStats: () =>
    apiClient.get<DashboardStats>('/dashboard/stats'),

  getRevenueChart: (period?: string) =>
    apiClient.get<RevenueChartData[]>('/dashboard/revenue-chart', { params: { period } }),

  getSegmentDistribution: () =>
    apiClient.get<SegmentDistribution[]>('/dashboard/segment-distribution'),

  getRecentOrders: (limit?: number) =>
    apiClient.get<RecentOrder[]>('/dashboard/recent-orders', { params: { limit } }),

  getTopCustomers: (limit?: number) =>
    apiClient.get<TopCustomer[]>('/dashboard/top-customers', { params: { limit } }),

  // Analytics
  getRfmAnalysis: () =>
    apiClient.get<RfmSegment[]>('/analytics/rfm'),

  getFunnelData: (period?: string) =>
    apiClient.get<FunnelStep[]>('/analytics/funnel', { params: { period } }),

  getCohortData: (months?: number) =>
    apiClient.get<CohortRow[]>('/analytics/cohort', { params: { months } }),

  getClvPrediction: (customerId?: string) =>
    apiClient.get<ClvPrediction[]>('/analytics/clv', { params: { customerId } }),

  // Customers
  getCustomers: (params?: { page?: number; size?: number; segment?: string; search?: string }) =>
    apiClient.get<PaginatedResponse<Customer>>('/customers', { params }),

  getCustomerDetail: (id: string) =>
    apiClient.get<CustomerDetail>(`/customers/${id}`),

  getCustomerOrders: (id: string, params?: { page?: number; size?: number }) =>
    apiClient.get<PaginatedResponse<Order>>(`/customers/${id}/orders`, { params }),

  getCustomerRecommendations: (id: string) =>
    apiClient.get<ProductRecommendation[]>(`/customers/${id}/recommendations`),

  updateCustomerTags: (id: string, tags: string[]) =>
    apiClient.put(`/customers/${id}/tags`, { tags }),

  // Products & Recommendations
  getProductRecommendations: (params?: { category?: string; limit?: number }) =>
    apiClient.get<ProductRecommendation[]>('/recommendations/products', { params }),

  getFrequentlyBoughtTogether: (productId?: string) =>
    apiClient.get<{ products: ProductRecommendation[]; confidence: number }[]>('/recommendations/frequently-bought-together', { params: { productId } }),

  getCategoryRecommendations: () =>
    apiClient.get<{ category: string; products: ProductRecommendation[] }[]>('/recommendations/by-category'),

  // Campaigns
  getCampaigns: (params?: { page?: number; size?: number; status?: string }) =>
    apiClient.get<PaginatedResponse<Campaign>>('/campaigns', { params }),

  getCampaign: (id: string) =>
    apiClient.get<Campaign>(`/campaigns/${id}`),

  createCampaign: (data: Partial<Campaign>) =>
    apiClient.post<Campaign>('/campaigns', data),

  updateCampaign: (id: string, data: Partial<Campaign>) =>
    apiClient.put<Campaign>(`/campaigns/${id}`, data),

  deleteCampaign: (id: string) =>
    apiClient.delete(`/campaigns/${id}`),

  sendCampaign: (id: string) =>
    apiClient.post(`/campaigns/${id}/send`),

  pauseCampaign: (id: string) =>
    apiClient.post(`/campaigns/${id}/pause`),

  // Segments
  getSegments: () =>
    apiClient.get<{ id: string; name: string; count: number; description: string }[]>('/segments'),
};
