import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import type {
  DashboardStats,
  RevenueChartData,
  SegmentDistribution,
  RecentOrder,
  TopCustomer,
  RfmSegment,
  FunnelStep,
  CohortRow,
  Customer,
  CustomerDetail,
  Order,
  ProductRecommendation,
  Campaign,
  PaginatedResponse,
} from '../api/client';

// Import mock data as fallback
import {
  useDashboardStats as useMockDashboardStats,
  useRevenueChart as useMockRevenueChart,
  useSegmentDistribution as useMockSegmentDistribution,
  useRecentOrders as useMockRecentOrders,
  useTopCustomers as useMockTopCustomers,
  useRfmAnalysis as useMockRfmAnalysis,
  useFunnelData as useMockFunnelData,
  useCohortData as useMockCohortData,
  useCustomers as useMockCustomers,
  useCustomerDetail as useMockCustomerDetail,
  useCustomerOrders as useMockCustomerOrders,
  useCustomerRecommendations as useMockCustomerRecommendations,
  useProductRecommendations as useMockProductRecommendations,
  useFrequentlyBoughtTogether as useMockFrequentlyBoughtTogether,
  useCategoryRecommendations as useMockCategoryRecommendations,
  useCampaigns as useMockCampaigns,
  useSegments as useMockSegments,
} from './useMockData';

// Flag to control API vs Mock - can be controlled via environment variable
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API !== 'false';

// Helper to create API query with mock fallback
function createApiQuery<T>(
  queryKey: unknown[],
  apiFn: () => Promise<{ data: T }>,
  mockHook: () => { data: T | undefined; isLoading: boolean; error: unknown },
  enabled = true
) {
  // If real API is disabled, return mock data
  if (!USE_REAL_API) {
    return mockHook();
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await apiFn();
        return response.data;
      } catch (error) {
        console.warn(`API call failed for ${queryKey.join('/')}, falling back to mock data:`, error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000,
    enabled,
  });
}

// Dashboard Stats with API call
export function useDashboardStats() {
  const mockQuery = useMockDashboardStats();

  const apiQuery = useQuery({
    queryKey: ['dashboardStats', 'api'],
    queryFn: async () => {
      try {
        const response = await api.getDashboardStats();
        return response.data;
      } catch (error) {
        console.warn('Dashboard stats API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 30000,
    enabled: USE_REAL_API,
  });

  // Return API data if available, otherwise mock data
  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Revenue Chart with API call
export function useRevenueChart(period?: string) {
  const mockQuery = useMockRevenueChart(period);

  const apiQuery = useQuery({
    queryKey: ['revenueChart', 'api', period],
    queryFn: async () => {
      try {
        const response = await api.getRevenueChart(period);
        return response.data;
      } catch (error) {
        console.warn('Revenue chart API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 30000,
    enabled: USE_REAL_API,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Segment Distribution with API call
export function useSegmentDistribution() {
  const mockQuery = useMockSegmentDistribution();

  const apiQuery = useQuery({
    queryKey: ['segmentDistribution', 'api'],
    queryFn: async () => {
      try {
        const response = await api.getSegmentDistribution();
        return response.data;
      } catch (error) {
        console.warn('Segment distribution API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 30000,
    enabled: USE_REAL_API,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Recent Orders with API call
export function useRecentOrders(limit = 5) {
  const mockQuery = useMockRecentOrders(limit);

  const apiQuery = useQuery({
    queryKey: ['recentOrders', 'api', limit],
    queryFn: async () => {
      try {
        const response = await api.getRecentOrders(limit);
        return response.data;
      } catch (error) {
        console.warn('Recent orders API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 30000,
    enabled: USE_REAL_API,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Top Customers with API call
export function useTopCustomers(limit = 5) {
  const mockQuery = useMockTopCustomers(limit);

  const apiQuery = useQuery({
    queryKey: ['topCustomers', 'api', limit],
    queryFn: async () => {
      try {
        const response = await api.getTopCustomers(limit);
        return response.data;
      } catch (error) {
        console.warn('Top customers API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 30000,
    enabled: USE_REAL_API,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// RFM Analysis with API call
export function useRfmAnalysis() {
  const mockQuery = useMockRfmAnalysis();

  const apiQuery = useQuery({
    queryKey: ['rfmAnalysis', 'api'],
    queryFn: async () => {
      try {
        const response = await api.getRfmAnalysis();
        return response.data;
      } catch (error) {
        console.warn('RFM analysis API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 60000,
    enabled: USE_REAL_API,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Funnel Data with API call
export function useFunnelData(period?: string) {
  const mockQuery = useMockFunnelData(period);

  const apiQuery = useQuery({
    queryKey: ['funnelData', 'api', period],
    queryFn: async () => {
      try {
        const response = await api.getFunnelData(period);
        return response.data;
      } catch (error) {
        console.warn('Funnel data API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 60000,
    enabled: USE_REAL_API,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Cohort Data with API call
export function useCohortData(months = 6) {
  const mockQuery = useMockCohortData(months);

  const apiQuery = useQuery({
    queryKey: ['cohortData', 'api', months],
    queryFn: async () => {
      try {
        const response = await api.getCohortData(months);
        return response.data;
      } catch (error) {
        console.warn('Cohort data API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 60000,
    enabled: USE_REAL_API,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Customers with API call
export function useCustomers(params?: { page?: number; size?: number; segment?: string; search?: string }) {
  const mockQuery = useMockCustomers(params);

  const apiQuery = useQuery({
    queryKey: ['customers', 'api', params],
    queryFn: async () => {
      try {
        const response = await api.getCustomers(params);
        return response.data;
      } catch (error) {
        console.warn('Customers API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 30000,
    enabled: USE_REAL_API,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Customer Detail with API call
export function useCustomerDetail(id: string) {
  const mockQuery = useMockCustomerDetail(id);

  const apiQuery = useQuery({
    queryKey: ['customerDetail', 'api', id],
    queryFn: async () => {
      try {
        const response = await api.getCustomerDetail(id);
        return response.data;
      } catch (error) {
        console.warn('Customer detail API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 30000,
    enabled: USE_REAL_API && !!id,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Customer Orders with API call
export function useCustomerOrders(id: string, params?: { page?: number; size?: number }) {
  const mockQuery = useMockCustomerOrders(id, params);

  const apiQuery = useQuery({
    queryKey: ['customerOrders', 'api', id, params],
    queryFn: async () => {
      try {
        const response = await api.getCustomerOrders(id, params);
        return response.data;
      } catch (error) {
        console.warn('Customer orders API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 30000,
    enabled: USE_REAL_API && !!id,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Customer Recommendations with API call
export function useCustomerRecommendations(id: string) {
  const mockQuery = useMockCustomerRecommendations(id);

  const apiQuery = useQuery({
    queryKey: ['customerRecommendations', 'api', id],
    queryFn: async () => {
      try {
        const response = await api.getCustomerRecommendations(id);
        return response.data;
      } catch (error) {
        console.warn('Customer recommendations API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 60000,
    enabled: USE_REAL_API && !!id,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Product Recommendations with API call
export function useProductRecommendations(params?: { category?: string; limit?: number }) {
  const mockQuery = useMockProductRecommendations(params);

  const apiQuery = useQuery({
    queryKey: ['productRecommendations', 'api', params],
    queryFn: async () => {
      try {
        const response = await api.getProductRecommendations(params);
        return response.data;
      } catch (error) {
        console.warn('Product recommendations API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 60000,
    enabled: USE_REAL_API,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Frequently Bought Together with API call
export function useFrequentlyBoughtTogether() {
  const mockQuery = useMockFrequentlyBoughtTogether();

  const apiQuery = useQuery({
    queryKey: ['frequentlyBoughtTogether', 'api'],
    queryFn: async () => {
      try {
        const response = await api.getFrequentlyBoughtTogether();
        return response.data;
      } catch (error) {
        console.warn('Frequently bought together API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 60000,
    enabled: USE_REAL_API,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Category Recommendations with API call
export function useCategoryRecommendations() {
  const mockQuery = useMockCategoryRecommendations();

  const apiQuery = useQuery({
    queryKey: ['categoryRecommendations', 'api'],
    queryFn: async () => {
      try {
        const response = await api.getCategoryRecommendations();
        return response.data;
      } catch (error) {
        console.warn('Category recommendations API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 60000,
    enabled: USE_REAL_API,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Campaigns with API call
export function useCampaigns(params?: { status?: string }) {
  const mockQuery = useMockCampaigns(params);

  const apiQuery = useQuery({
    queryKey: ['campaigns', 'api', params],
    queryFn: async () => {
      try {
        const response = await api.getCampaigns(params);
        return response.data;
      } catch (error) {
        console.warn('Campaigns API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 30000,
    enabled: USE_REAL_API,
  });

  // Handle paginated response from API vs array from mock
  const apiData = apiQuery.data;
  const mockData = mockQuery.data;

  return {
    data: apiData ? (Array.isArray(apiData) ? apiData : apiData.content) : mockData,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}

// Segments with API call
export function useSegments() {
  const mockQuery = useMockSegments();

  const apiQuery = useQuery({
    queryKey: ['segments', 'api'],
    queryFn: async () => {
      try {
        const response = await api.getSegments();
        return response.data;
      } catch (error) {
        console.warn('Segments API failed, using mock data');
        return null;
      }
    },
    retry: 1,
    staleTime: 60000,
    enabled: USE_REAL_API,
  });

  return {
    data: apiQuery.data || mockQuery.data,
    isLoading: USE_REAL_API ? apiQuery.isLoading : mockQuery.isLoading,
    error: apiQuery.error,
    isFromApi: !!apiQuery.data,
  };
}
