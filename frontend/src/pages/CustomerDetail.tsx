import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Tag,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Clock,
  AlertTriangle,
  ChevronRight,
  Package,
  Heart,
} from 'lucide-react';
import { BarChart } from '../components/charts/BarChart';
import {
  useCustomerDetail,
  useCustomerOrders,
  useCustomerRecommendations,
} from '../hooks/useApiData';

const segmentColors: Record<string, { bg: string; text: string; border: string }> = {
  Champions: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  Loyal: { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200' },
  Potential: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  New: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  'At Risk': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  Dormant: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
};

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

function formatCurrency(value: number): string {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(0)}만원`;
  }
  return `${value.toLocaleString()}원`;
}

function RfmBadge({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  const getColor = () => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-lime-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
      <span className="text-xs text-gray-500 mb-1">{label}</span>
      <div className={`w-10 h-10 rounded-full ${getColor()} flex items-center justify-center`}>
        <span className="text-white font-bold">{value}</span>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-6 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="h-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading: customerLoading } = useCustomerDetail(id || '');
  const { data: ordersData, isLoading: ordersLoading } = useCustomerOrders(id || '');
  const { data: recommendations, isLoading: recsLoading } = useCustomerRecommendations(id || '');

  if (customerLoading) {
    return (
      <div className="space-y-6">
        <Link to="/customers" className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-4 h-4" />
          고객 목록으로 돌아가기
        </Link>
        <LoadingSkeleton />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500 mb-4">고객을 찾을 수 없습니다.</p>
        <Link to="/customers" className="btn-primary">
          고객 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const segmentStyle = segmentColors[customer.segment] || segmentColors.Loyal;
  const churnRiskLevel = customer.churnRisk < 0.3 ? 'low' : customer.churnRisk < 0.6 ? 'medium' : 'high';
  const churnRiskColor = churnRiskLevel === 'low' ? 'text-green-600' : churnRiskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600';
  const churnRiskBg = churnRiskLevel === 'low' ? 'bg-green-100' : churnRiskLevel === 'medium' ? 'bg-yellow-100' : 'bg-red-100';

  const affinityData = customer.productAffinities.map((a) => ({
    category: a.category,
    score: Math.round(a.score * 100),
  }));

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link to="/customers" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        고객 목록으로 돌아가기
      </Link>

      {/* Customer Header */}
      <div className="card">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cafe24-primary to-cafe24-accent flex items-center justify-center text-white text-2xl font-bold">
              {customer.name.slice(0, 2)}
            </div>

            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${segmentStyle.bg} ${segmentStyle.text}`}>
                  {customer.segment}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{customer.address}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {customer.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  {customer.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RFM Score */}
          <div className="flex gap-2">
            <RfmBadge label="R" value={customer.rfmScore.r} />
            <RfmBadge label="F" value={customer.rfmScore.f} />
            <RfmBadge label="M" value={customer.rfmScore.m} />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">총 주문</p>
              <p className="text-xl font-bold text-gray-900">{customer.totalOrders}건</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">총 매출</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(customer.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 주문액</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(customer.avgOrderValue)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">마지막 주문</p>
              <p className="text-xl font-bold text-gray-900">{customer.lastOrderDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CLV & Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CLV Prediction */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">고객 생애 가치 (CLV)</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">현재 CLV</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(customer.clv)}</p>
            </div>
            <div className="p-4 bg-cafe24-primary/10 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">예측 CLV</p>
              <p className="text-2xl font-bold text-cafe24-primary">{formatCurrency(customer.predictedClv)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {customer.predictedClv > customer.clv ? (
              <>
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-green-600">
                  +{formatCurrency(customer.predictedClv - customer.clv)} 성장 예상
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-red-600">
                  {formatCurrency(customer.predictedClv - customer.clv)} 감소 예상
                </span>
              </>
            )}
          </div>
        </div>

        {/* Churn Risk */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">이탈 위험도</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-24 h-24 rounded-full ${churnRiskBg} flex items-center justify-center`}>
              <div className="text-center">
                <p className={`text-2xl font-bold ${churnRiskColor}`}>
                  {Math.round(customer.churnRisk * 100)}%
                </p>
              </div>
            </div>
            <div>
              <p className={`font-medium ${churnRiskColor} mb-1`}>
                {churnRiskLevel === 'low' ? '낮음' : churnRiskLevel === 'medium' ? '주의' : '높음'}
              </p>
              <p className="text-sm text-gray-500">
                {churnRiskLevel === 'low'
                  ? '현재 안정적인 구매 패턴을 보이고 있습니다.'
                  : churnRiskLevel === 'medium'
                  ? '재구매 유도를 위한 프로모션을 고려해보세요.'
                  : '긴급한 리텐션 조치가 필요합니다.'}
              </p>
            </div>
          </div>
          {churnRiskLevel !== 'low' && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg text-sm">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-700">
                마지막 구매 후 {Math.floor((Date.now() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))}일이 경과했습니다.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Product Affinity */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">카테고리 선호도</h2>
        <BarChart
          data={affinityData}
          xKey="category"
          bars={[{ key: 'score', name: '선호도 점수', color: '#00a8e8' }]}
          height={200}
          formatYAxis={(v) => `${v}%`}
          colorByValue
        />
      </div>

      {/* Order History */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">주문 내역</h2>
          <button className="text-sm text-cafe24-primary hover:underline">
            전체보기
          </button>
        </div>
        {ordersLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {ordersData?.content.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg">
                    <Package className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                  <span className="font-medium text-gray-900">
                    {order.amount.toLocaleString()}원
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Recommendations */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">AI 추천 상품</h2>
          </div>
          <Link to="/recommendations" className="text-sm text-cafe24-primary hover:underline">
            더보기
          </Link>
        </div>
        {recsLoading ? (
          <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendations?.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2 relative">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-xs font-medium text-cafe24-primary">
                    {Math.round(product.score * 100)}% 매칭
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-sm text-gray-500">{product.price.toLocaleString()}원</p>
                <p className="text-xs text-gray-400 mt-1 truncate">{product.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary">
          캠페인 발송
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          메모 추가
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          태그 편집
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          고객 정보 내보내기
        </button>
      </div>
    </div>
  );
}
