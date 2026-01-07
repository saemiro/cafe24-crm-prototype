import { useQuery } from '@tanstack/react-query';
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

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data generators
const mockDashboardStats: DashboardStats = {
  totalCustomers: 12847,
  totalCustomersChange: 12.5,
  monthlyRevenue: 1284567000,
  monthlyRevenueChange: 8.3,
  totalOrders: 3421,
  totalOrdersChange: 15.2,
  activeCustomers: 4523,
  activeCustomersChange: -2.1,
};

const mockRevenueChart: RevenueChartData[] = [
  { month: '1월', revenue: 98000000, orders: 2100 },
  { month: '2월', revenue: 112000000, orders: 2450 },
  { month: '3월', revenue: 105000000, orders: 2300 },
  { month: '4월', revenue: 125000000, orders: 2800 },
  { month: '5월', revenue: 138000000, orders: 3100 },
  { month: '6월', revenue: 142000000, orders: 3200 },
  { month: '7월', revenue: 155000000, orders: 3500 },
  { month: '8월', revenue: 148000000, orders: 3350 },
  { month: '9월', revenue: 162000000, orders: 3650 },
  { month: '10월', revenue: 175000000, orders: 3900 },
  { month: '11월', revenue: 168000000, orders: 3750 },
  { month: '12월', revenue: 128000000, orders: 3421 },
];

const mockSegmentDistribution: SegmentDistribution[] = [
  { segment: 'Champions', count: 1284, percentage: 10, color: '#22c55e' },
  { segment: 'Loyal', count: 2569, percentage: 20, color: '#84cc16' },
  { segment: 'Potential', count: 3211, percentage: 25, color: '#00a8e8' },
  { segment: 'New', count: 2569, percentage: 20, color: '#8b5cf6' },
  { segment: 'At Risk', count: 1927, percentage: 15, color: '#f97316' },
  { segment: 'Dormant', count: 1287, percentage: 10, color: '#ef4444' },
];

const mockRecentOrders: RecentOrder[] = [
  { id: 'ORD-001', customerName: '김철수', customerEmail: 'kim@example.com', amount: 156000, items: 3, status: 'delivered', createdAt: '2024-12-30T10:30:00' },
  { id: 'ORD-002', customerName: '이영희', customerEmail: 'lee@example.com', amount: 89000, items: 2, status: 'shipped', createdAt: '2024-12-30T09:15:00' },
  { id: 'ORD-003', customerName: '박민수', customerEmail: 'park@example.com', amount: 245000, items: 5, status: 'processing', createdAt: '2024-12-30T08:45:00' },
  { id: 'ORD-004', customerName: '최지은', customerEmail: 'choi@example.com', amount: 67000, items: 1, status: 'pending', createdAt: '2024-12-30T08:00:00' },
  { id: 'ORD-005', customerName: '정수진', customerEmail: 'jung@example.com', amount: 312000, items: 4, status: 'delivered', createdAt: '2024-12-29T18:30:00' },
];

const mockTopCustomers: TopCustomer[] = [
  { id: 'C001', name: '최지은', email: 'choi@example.com', segment: 'Champions', totalOrders: 45, totalRevenue: 8450000, lastOrderDate: '2024-12-28' },
  { id: 'C002', name: '김철수', email: 'kim@example.com', segment: 'Champions', totalOrders: 38, totalRevenue: 7120000, lastOrderDate: '2024-12-30' },
  { id: 'C003', name: '이영희', email: 'lee@example.com', segment: 'Loyal', totalOrders: 32, totalRevenue: 5890000, lastOrderDate: '2024-12-29' },
  { id: 'C004', name: '박민수', email: 'park@example.com', segment: 'Loyal', totalOrders: 28, totalRevenue: 4560000, lastOrderDate: '2024-12-25' },
  { id: 'C005', name: '정수진', email: 'jung@example.com', segment: 'Potential', totalOrders: 22, totalRevenue: 3240000, lastOrderDate: '2024-12-30' },
];

const mockRfmSegments: RfmSegment[] = [
  { segment: 'Champions', description: '최근 구매, 자주 구매, 높은 금액', count: 1284, percentage: 10, avgRecency: 5, avgFrequency: 12, avgMonetary: 850000, color: '#22c55e', r: 5, f: 5, m: 5 },
  { segment: 'Loyal Customers', description: '자주 구매하는 충성 고객', count: 2056, percentage: 16, avgRecency: 15, avgFrequency: 8, avgMonetary: 450000, color: '#84cc16', r: 4, f: 5, m: 4 },
  { segment: 'Potential Loyalist', description: '최근 구매, 성장 가능성 높음', count: 1927, percentage: 15, avgRecency: 10, avgFrequency: 4, avgMonetary: 320000, color: '#00a8e8', r: 5, f: 3, m: 4 },
  { segment: 'New Customers', description: '최근 처음 구매한 신규 고객', count: 2569, percentage: 20, avgRecency: 8, avgFrequency: 1, avgMonetary: 120000, color: '#8b5cf6', r: 5, f: 1, m: 3 },
  { segment: 'Promising', description: '재구매 가능성이 있는 고객', count: 1542, percentage: 12, avgRecency: 25, avgFrequency: 2, avgMonetary: 180000, color: '#06b6d4', r: 3, f: 2, m: 3 },
  { segment: 'Need Attention', description: '관심이 필요한 고객', count: 1156, percentage: 9, avgRecency: 45, avgFrequency: 5, avgMonetary: 280000, color: '#f59e0b', r: 2, f: 4, m: 3 },
  { segment: 'At Risk', description: '이탈 위험이 있는 고객', count: 899, percentage: 7, avgRecency: 60, avgFrequency: 6, avgMonetary: 350000, color: '#f97316', r: 2, f: 3, m: 4 },
  { segment: 'Cant Lose Them', description: '과거 우수 고객, 현재 미활동', count: 514, percentage: 4, avgRecency: 90, avgFrequency: 10, avgMonetary: 620000, color: '#dc2626', r: 1, f: 5, m: 5 },
  { segment: 'Hibernating', description: '장기간 미활동 고객', count: 642, percentage: 5, avgRecency: 120, avgFrequency: 2, avgMonetary: 95000, color: '#6b7280', r: 1, f: 2, m: 2 },
  { segment: 'Lost', description: '완전 이탈 고객', count: 258, percentage: 2, avgRecency: 180, avgFrequency: 1, avgMonetary: 45000, color: '#374151', r: 1, f: 1, m: 1 },
];

const mockFunnelData: FunnelStep[] = [
  { step: 'visit', label: '사이트 방문', value: 125000, percentage: 100, dropoff: 0 },
  { step: 'view', label: '상품 조회', value: 67500, percentage: 54, dropoff: 46 },
  { step: 'cart', label: '장바구니 담기', value: 18900, percentage: 15.12, dropoff: 38.88 },
  { step: 'checkout', label: '결제 시작', value: 8505, percentage: 6.8, dropoff: 8.32 },
  { step: 'purchase', label: '구매 완료', value: 5953, percentage: 4.76, dropoff: 2.04 },
];

const mockCohortData: CohortRow[] = [
  { cohort: '2024-07', totalUsers: 1250, retention: [100, 45, 32, 28, 25, 22] },
  { cohort: '2024-08', totalUsers: 1380, retention: [100, 48, 35, 30, 27] },
  { cohort: '2024-09', totalUsers: 1520, retention: [100, 52, 38, 33] },
  { cohort: '2024-10', totalUsers: 1650, retention: [100, 55, 42] },
  { cohort: '2024-11', totalUsers: 1780, retention: [100, 58] },
  { cohort: '2024-12', totalUsers: 1920, retention: [100] },
];

const mockCustomers: Customer[] = Array.from({ length: 50 }, (_, i) => ({
  id: `C${String(i + 1).padStart(3, '0')}`,
  name: ['김철수', '이영희', '박민수', '최지은', '정수진', '강민호', '조은지', '윤서현', '장동건', '한예슬'][i % 10],
  email: `customer${i + 1}@example.com`,
  phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  segment: ['Champions', 'Loyal', 'Potential', 'New', 'At Risk', 'Dormant'][i % 6],
  rfmScore: { r: Math.floor(Math.random() * 5) + 1, f: Math.floor(Math.random() * 5) + 1, m: Math.floor(Math.random() * 5) + 1 },
  totalOrders: Math.floor(Math.random() * 50) + 1,
  totalRevenue: Math.floor(Math.random() * 5000000) + 100000,
  avgOrderValue: Math.floor(Math.random() * 200000) + 50000,
  lastOrderDate: `2024-12-${String(Math.floor(Math.random() * 30) + 1).padStart(2, '0')}`,
  createdAt: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01`,
  tags: [['VIP', '재구매'], ['신규', '이벤트참여'], ['휴면', '재활성화필요'], ['단골'], ['프로모션반응']][i % 5],
}));

const mockCustomerDetail = (id: string): CustomerDetail => ({
  id,
  name: '김철수',
  email: 'kim.cheolsu@example.com',
  phone: '010-1234-5678',
  segment: 'Champions',
  rfmScore: { r: 5, f: 4, m: 5 },
  totalOrders: 38,
  totalRevenue: 7120000,
  avgOrderValue: 187368,
  lastOrderDate: '2024-12-30',
  createdAt: '2023-06-15',
  tags: ['VIP', '재구매', '리뷰작성자'],
  address: '서울시 강남구 테헤란로 123',
  birthDate: '1985-03-15',
  gender: '남성',
  clv: 8500000,
  predictedClv: 12500000,
  churnRisk: 0.15,
  productAffinities: [
    { category: '의류', score: 0.85 },
    { category: '가방', score: 0.72 },
    { category: '신발', score: 0.65 },
    { category: '액세서리', score: 0.45 },
    { category: '화장품', score: 0.32 },
  ],
});

const mockOrders: Order[] = Array.from({ length: 20 }, (_, i) => ({
  id: `ORD-${String(i + 1).padStart(5, '0')}`,
  orderNumber: `2024${String(i + 1).padStart(8, '0')}`,
  amount: Math.floor(Math.random() * 500000) + 50000,
  items: [
    { name: '베이직 티셔츠', quantity: 2, price: 29000 },
    { name: '데님 팬츠', quantity: 1, price: 89000 },
  ],
  status: ['delivered', 'shipped', 'processing', 'pending'][i % 4],
  createdAt: `2024-12-${String(30 - i).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:00:00`,
}));

const mockProductRecommendations: ProductRecommendation[] = [
  { id: 'P001', name: '프리미엄 캐시미어 니트', category: '의류', price: 189000, imageUrl: 'https://placehold.co/200x200/00a8e8/white?text=Knit', score: 0.95, reason: '이전 구매 패턴 기반 추천' },
  { id: 'P002', name: '레더 토트백', category: '가방', price: 259000, imageUrl: 'https://placehold.co/200x200/007ea7/white?text=Bag', score: 0.92, reason: '자주 조회한 상품과 유사' },
  { id: 'P003', name: '클래식 로퍼', category: '신발', price: 145000, imageUrl: 'https://placehold.co/200x200/003459/white?text=Shoes', score: 0.88, reason: '함께 구매한 고객들의 선택' },
  { id: 'P004', name: '실크 스카프', category: '액세서리', price: 79000, imageUrl: 'https://placehold.co/200x200/10b981/white?text=Scarf', score: 0.85, reason: '계절 트렌드 기반 추천' },
  { id: 'P005', name: '미니멀 워치', category: '액세서리', price: 320000, imageUrl: 'https://placehold.co/200x200/8b5cf6/white?text=Watch', score: 0.82, reason: '높은 평점 인기 상품' },
  { id: 'P006', name: '울 코트', category: '의류', price: 450000, imageUrl: 'https://placehold.co/200x200/f59e0b/white?text=Coat', score: 0.78, reason: '시즌 베스트셀러' },
];

const mockCampaigns: Campaign[] = [
  { id: 'CAM001', name: 'VIP 연말 특별 할인', type: 'email', status: 'active', targetSegment: 'Champions', targetCount: 1284, sentCount: 1284, openRate: 45.2, clickRate: 12.8, conversionRate: 8.5, revenue: 15420000, startedAt: '2024-12-20T09:00:00', createdAt: '2024-12-15' },
  { id: 'CAM002', name: '신규 고객 환영 쿠폰', type: 'kakao', status: 'completed', targetSegment: 'New', targetCount: 2569, sentCount: 2569, openRate: 68.5, clickRate: 22.1, conversionRate: 15.3, revenue: 32850000, startedAt: '2024-12-01T10:00:00', completedAt: '2024-12-15T23:59:59', createdAt: '2024-11-25' },
  { id: 'CAM003', name: '휴면 고객 재활성화', type: 'sms', status: 'scheduled', targetSegment: 'Dormant', targetCount: 1287, sentCount: 0, openRate: 0, clickRate: 0, conversionRate: 0, revenue: 0, scheduledAt: '2025-01-02T10:00:00', createdAt: '2024-12-28' },
  { id: 'CAM004', name: '장바구니 리마인더', type: 'push', status: 'active', targetSegment: 'All', targetCount: 5420, sentCount: 3215, openRate: 32.4, clickRate: 18.9, conversionRate: 6.2, revenue: 8920000, startedAt: '2024-12-25T00:00:00', createdAt: '2024-12-20' },
  { id: 'CAM005', name: '생일 축하 할인', type: 'email', status: 'draft', targetSegment: 'All', targetCount: 450, sentCount: 0, openRate: 0, clickRate: 0, conversionRate: 0, revenue: 0, createdAt: '2024-12-29' },
  { id: 'CAM006', name: '재구매 유도 캠페인', type: 'email', status: 'completed', targetSegment: 'Loyal', targetCount: 2056, sentCount: 2056, openRate: 52.3, clickRate: 15.7, conversionRate: 9.8, revenue: 24560000, startedAt: '2024-12-10T09:00:00', completedAt: '2024-12-20T23:59:59', createdAt: '2024-12-05' },
  { id: 'CAM007', name: '겨울 시즌 프로모션', type: 'push', status: 'paused', targetSegment: 'All', targetCount: 8500, sentCount: 4250, openRate: 28.5, clickRate: 12.3, conversionRate: 4.5, revenue: 12350000, startedAt: '2024-12-22T09:00:00', createdAt: '2024-12-18' },
];

// Mock API hooks
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      await delay(500);
      return mockDashboardStats;
    },
  });
}

export function useRevenueChart(period?: string) {
  return useQuery({
    queryKey: ['revenueChart', period],
    queryFn: async () => {
      await delay(600);
      return mockRevenueChart;
    },
  });
}

export function useSegmentDistribution() {
  return useQuery({
    queryKey: ['segmentDistribution'],
    queryFn: async () => {
      await delay(400);
      return mockSegmentDistribution;
    },
  });
}

export function useRecentOrders(limit = 5) {
  return useQuery({
    queryKey: ['recentOrders', limit],
    queryFn: async () => {
      await delay(300);
      return mockRecentOrders.slice(0, limit);
    },
  });
}

export function useTopCustomers(limit = 5) {
  return useQuery({
    queryKey: ['topCustomers', limit],
    queryFn: async () => {
      await delay(350);
      return mockTopCustomers.slice(0, limit);
    },
  });
}

export function useRfmAnalysis() {
  return useQuery({
    queryKey: ['rfmAnalysis'],
    queryFn: async () => {
      await delay(700);
      return mockRfmSegments;
    },
  });
}

export function useFunnelData(period?: string) {
  return useQuery({
    queryKey: ['funnelData', period],
    queryFn: async () => {
      await delay(500);
      return mockFunnelData;
    },
  });
}

export function useCohortData(months = 6) {
  return useQuery({
    queryKey: ['cohortData', months],
    queryFn: async () => {
      await delay(600);
      return mockCohortData.slice(-months);
    },
  });
}

export function useCustomers(params?: { page?: number; size?: number; segment?: string; search?: string }) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: async () => {
      await delay(400);
      let filtered = [...mockCustomers];

      if (params?.segment && params.segment !== 'all') {
        filtered = filtered.filter((c) => c.segment === params.segment);
      }

      if (params?.search) {
        const search = params.search.toLowerCase();
        filtered = filtered.filter(
          (c) => c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search)
        );
      }

      const page = params?.page || 0;
      const size = params?.size || 10;
      const start = page * size;
      const end = start + size;

      return {
        content: filtered.slice(start, end),
        totalElements: filtered.length,
        totalPages: Math.ceil(filtered.length / size),
        page,
        size,
      } as PaginatedResponse<Customer>;
    },
  });
}

export function useCustomerDetail(id: string) {
  return useQuery({
    queryKey: ['customerDetail', id],
    queryFn: async () => {
      await delay(500);
      return mockCustomerDetail(id);
    },
    enabled: !!id,
  });
}

export function useCustomerOrders(id: string, params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: ['customerOrders', id, params],
    queryFn: async () => {
      await delay(400);
      const page = params?.page || 0;
      const size = params?.size || 10;
      const start = page * size;
      const end = start + size;

      return {
        content: mockOrders.slice(start, end),
        totalElements: mockOrders.length,
        totalPages: Math.ceil(mockOrders.length / size),
        page,
        size,
      } as PaginatedResponse<Order>;
    },
    enabled: !!id,
  });
}

export function useCustomerRecommendations(id: string) {
  return useQuery({
    queryKey: ['customerRecommendations', id],
    queryFn: async () => {
      await delay(600);
      return mockProductRecommendations;
    },
    enabled: !!id,
  });
}

export function useProductRecommendations(params?: { category?: string; limit?: number }) {
  return useQuery({
    queryKey: ['productRecommendations', params],
    queryFn: async () => {
      await delay(500);
      let products = [...mockProductRecommendations];
      if (params?.category) {
        products = products.filter((p) => p.category === params.category);
      }
      if (params?.limit) {
        products = products.slice(0, params.limit);
      }
      return products;
    },
  });
}

export function useFrequentlyBoughtTogether() {
  return useQuery({
    queryKey: ['frequentlyBoughtTogether'],
    queryFn: async () => {
      await delay(400);
      return [
        { products: [mockProductRecommendations[0], mockProductRecommendations[2]], confidence: 0.85 },
        { products: [mockProductRecommendations[1], mockProductRecommendations[3]], confidence: 0.78 },
        { products: [mockProductRecommendations[4], mockProductRecommendations[5]], confidence: 0.72 },
      ];
    },
  });
}

export function useCategoryRecommendations() {
  return useQuery({
    queryKey: ['categoryRecommendations'],
    queryFn: async () => {
      await delay(500);
      const categories = ['의류', '가방', '신발', '액세서리'];
      return categories.map((category) => ({
        category,
        products: mockProductRecommendations.filter((p) => p.category === category),
      }));
    },
  });
}

export function useCampaigns(params?: { status?: string }) {
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: async () => {
      await delay(400);
      let filtered = [...mockCampaigns];

      if (params?.status && params.status !== 'all') {
        filtered = filtered.filter((c) => c.status === params.status);
      }

      return filtered;
    },
  });
}

export function useSegments() {
  return useQuery({
    queryKey: ['segments'],
    queryFn: async () => {
      await delay(300);
      return mockSegmentDistribution.map((s) => ({
        id: s.segment.toLowerCase().replace(' ', '-'),
        name: s.segment,
        count: s.count,
        description: `${s.segment} 세그먼트 고객`,
      }));
    },
  });
}
