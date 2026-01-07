import { Link } from 'react-router-dom';
import { Users, ShoppingCart, TrendingUp, UserCheck, Brain, ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { LineChart } from '../components/charts/LineChart';
import { PieChart } from '../components/charts/PieChart';
import {
  useDashboardStats,
  useRevenueChart,
  useSegmentDistribution,
  useRecentOrders,
  useTopCustomers,
} from '../hooks/useApiData';

// Loading skeleton component
function StatCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-4 flex-1 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
      <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    </div>
  );
}

function formatCurrency(value: number): string {
  if (value >= 100000000) {
    return `${(value / 100000000).toFixed(1)}억`;
  }
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}만`;
  }
  return value.toLocaleString();
}

function formatNumber(value: number): string {
  return value.toLocaleString();
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  pending: '대기중',
  processing: '처리중',
  shipped: '배송중',
  delivered: '배송완료',
  cancelled: '취소',
};

const segmentColors: Record<string, string> = {
  Champions: 'bg-green-100 text-green-700',
  Loyal: 'bg-lime-100 text-lime-700',
  Potential: 'bg-blue-100 text-blue-700',
  New: 'bg-purple-100 text-purple-700',
  'At Risk': 'bg-orange-100 text-orange-700',
  Dormant: 'bg-red-100 text-red-700',
};

export function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: revenueData, isLoading: revenueLoading } = useRevenueChart();
  const { data: segmentData, isLoading: segmentLoading } = useSegmentDistribution();
  const { data: recentOrders, isLoading: ordersLoading } = useRecentOrders(5);
  const { data: topCustomers, isLoading: customersLoading } = useTopCustomers(5);

  const statCards = [
    {
      label: '총 고객수',
      value: stats?.totalCustomers,
      change: stats?.totalCustomersChange,
      icon: Users,
      color: 'bg-blue-500',
      format: formatNumber,
    },
    {
      label: '이번달 매출',
      value: stats?.monthlyRevenue,
      change: stats?.monthlyRevenueChange,
      icon: TrendingUp,
      color: 'bg-green-500',
      format: (v: number) => `${formatCurrency(v)}원`,
    },
    {
      label: '총 주문수',
      value: stats?.totalOrders,
      change: stats?.totalOrdersChange,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      format: formatNumber,
    },
    {
      label: '활성 고객수',
      value: stats?.activeCustomers,
      change: stats?.activeCustomersChange,
      icon: UserCheck,
      color: 'bg-orange-500',
      format: formatNumber,
    },
  ];

  if (statsError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">데이터를 불러오는 중 오류가 발생했습니다.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            새로고침
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-500 mt-1">쇼핑몰 CRM 현황을 한눈에 확인하세요</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map(({ label, value, change, icon: Icon, color, format }) => (
              <div key={label} className="card hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {value !== undefined ? format(value) : '-'}
                    </p>
                    {change !== undefined && (
                      <div className={`flex items-center mt-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change >= 0 ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        <span>{Math.abs(change)}%</span>
                        <span className="text-gray-400 ml-1">vs 지난달</span>
                      </div>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="card lg:col-span-2">
          {revenueLoading ? (
            <ChartSkeleton />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">월별 매출 추이</h2>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cafe24-primary focus:border-transparent outline-none">
                  <option value="year">최근 1년</option>
                  <option value="6months">최근 6개월</option>
                  <option value="3months">최근 3개월</option>
                </select>
              </div>
              <LineChart
                data={(revenueData || []) as unknown as Array<{ [key: string]: string | number }>}
                xKey="month"
                lines={[
                  { key: 'revenue', name: '매출', color: '#00a8e8', type: 'area' },
                ]}
                height={280}
                formatYAxis={(v) => `${formatCurrency(v)}원`}
                formatTooltip={(v) => [`${formatCurrency(v)}원`, '매출']}
              />
            </>
          )}
        </div>

        {/* Segment Distribution */}
        <div className="card">
          {segmentLoading ? (
            <ChartSkeleton />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">고객 세그먼트</h2>
                <Link to="/rfm" className="text-sm text-cafe24-primary hover:underline flex items-center">
                  RFM 분석
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </div>
              <PieChart
                data={(segmentData || []).map((s) => ({
                  name: s.segment,
                  value: s.count,
                  color: s.color,
                }))}
                height={280}
                innerRadius={50}
                outerRadius={90}
              />
            </>
          )}
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          {ordersLoading ? (
            <TableSkeleton rows={5} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">최근 주문</h2>
                <button className="text-sm text-cafe24-primary hover:underline">
                  전체보기
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-500">주문번호</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">고객</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">금액</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(recentOrders || []).map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                            <p className="text-xs text-gray-500">{order.customerEmail}</p>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-gray-900">
                          {order.amount.toLocaleString()}원
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Top Customers */}
        <div className="card">
          {customersLoading ? (
            <TableSkeleton rows={5} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">우수 고객</h2>
                <Link to="/customers" className="text-sm text-cafe24-primary hover:underline">
                  전체보기
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-sm font-medium text-gray-500">고객</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">세그먼트</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">주문</th>
                      <th className="text-left py-3 text-sm font-medium text-gray-500">매출</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(topCustomers || []).map((customer) => (
                      <tr
                        key={customer.id}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        onClick={() => window.location.href = `/customers/${customer.id}`}
                      >
                        <td className="py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                            <p className="text-xs text-gray-500">{customer.email}</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${segmentColors[customer.segment] || 'bg-gray-100 text-gray-700'}`}>
                            {customer.segment}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">{customer.totalOrders}건</td>
                        <td className="py-3 text-sm font-medium text-gray-900">
                          {formatCurrency(customer.totalRevenue)}원
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* AI Insights Preview */}
      <div className="card bg-gradient-to-r from-cafe24-primary/5 to-cafe24-accent/5">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-cafe24-primary/10 rounded-lg">
            <Brain className="w-6 h-6 text-cafe24-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">AI 추천 인사이트</h3>
            <p className="text-gray-600 mt-1">
              VIP 고객 중 30일 이상 미구매 고객이 15명 있습니다.
              재구매 촉진 캠페인을 추천드립니다.
            </p>
            <div className="flex gap-4 mt-4">
              <Link
                to="/ai-insights"
                className="text-cafe24-primary font-medium hover:underline flex items-center"
              >
                자세히 보기
                <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/campaigns"
                className="text-gray-600 font-medium hover:underline flex items-center"
              >
                캠페인 만들기
                <ExternalLink className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
