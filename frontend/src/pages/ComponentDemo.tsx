import CustomerCard from "../components/crm/CustomerCard";
import MetricCard from "../components/crm/MetricCard";
import StatusBadge from "../components/crm/StatusBadge";
import ActivityItem from "../components/crm/ActivityItem";
import StatsSummary from "../components/crm/StatsSummary";
import RecommendationPanel from "../components/insights/RecommendationPanel";
import RecommendationPerformanceCard from "../components/insights/RecommendationPerformanceCard";

// 컴포넌트 메타데이터 (설명 포함)
const componentMeta = {
  RecommendationPerformanceCard: {
    name: "RecommendationPerformanceCard",
    title: "추천 엔진 성능 대시보드",
    description: "AI 추천 알고리즘의 핵심 성능 지표(정확도, CTR, 전환율)를 시각화합니다. 협업 필터링과 컨텐츠 기반 필터링의 성능을 비교할 수 있습니다.",
    insight: "AI 추천 시스템 성능 측정 요구사항",
    generated: "2025-01-13",
    features: ["정확도/CTR/전환율 대시보드", "알고리즘 성능 비교", "색상 코딩 등급 표시"],
  },
  RecommendationPanel: {
    name: "RecommendationPanel",
    title: "AI 상품 추천 패널",
    description: "고객별 맞춤 상품 추천과 추천 성과 지표를 표시합니다. 신뢰도 점수와 함께 추천 상품 목록을 제공합니다.",
    insight: "AI 추천 시스템 구축 관련 인사이트",
    generated: "2025-01-13",
    features: ["고객 맞춤 추천", "신뢰도 점수 표시", "CTR/전환율 지표"],
  },
};

// 컴포넌트 설명 카드
function ComponentInfo({ meta }: { meta: typeof componentMeta.RecommendationPanel }) {
  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-indigo-900">{meta.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{meta.description}</p>
        </div>
        <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full">
          AI 생성
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {meta.features.map((feature, idx) => (
          <span key={idx} className="px-2 py-1 text-xs bg-white text-gray-600 rounded border">
            {feature}
          </span>
        ))}
      </div>
      <div className="mt-2 text-xs text-gray-400">
        📅 {meta.generated} · 💡 {meta.insight}
      </div>
    </div>
  );
}

export function ComponentDemo() {
  // 샘플 데이터
  const sampleCustomers = [
    { name: "김철수", email: "kim@example.com", status: "active" as const, lastPurchase: "2025-01-10", totalSpent: 1250000 },
    { name: "이영희", email: "lee@example.com", status: "pending" as const, lastPurchase: "2025-01-05", totalSpent: 890000 },
    { name: "박민수", email: "park@example.com", status: "inactive" as const, lastPurchase: "2024-12-15", totalSpent: 450000 },
  ];

  const sampleActivities = [
    { type: "purchase" as const, description: "주문 #12345 결제 완료", timestamp: "2025-01-13T10:30:00", customerName: "김철수" },
    { type: "visit" as const, description: "상품 페이지 5회 조회", timestamp: "2025-01-13T09:15:00", customerName: "이영희" },
    { type: "support" as const, description: "배송 문의 접수", timestamp: "2025-01-13T08:00:00", customerName: "박민수" },
    { type: "email" as const, description: "프로모션 이메일 오픈", timestamp: "2025-01-12T18:30:00", customerName: "김철수" },
  ];

  const sampleStats = [
    { label: "총 고객 수", value: 15420, change: 12.5 },
    { label: "활성 고객", value: 8930, change: 8.3 },
    { label: "신규 가입", value: 342, change: 25.1 },
    { label: "이탈 위험", value: 156, change: -5.2 },
  ];

  const sampleRecommendations = [
    { id: "1", productName: "프리미엄 스킨케어 세트", category: "뷰티", price: 89000, confidenceScore: 0.92 },
    { id: "2", productName: "오가닉 그린티 컬렉션", category: "식품", price: 45000, confidenceScore: 0.85 },
    { id: "3", productName: "홈 오피스 에센셜 키트", category: "가구", price: 159000, confidenceScore: 0.78 },
  ];

  const sampleMetrics = {
    ctr: 0.032,
    conversionRate: 0.045,
    impressions: 125000,
    clicks: 4000,
    conversions: 180,
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">🎨 CRM 컴포넌트 데모</h1>
        <p className="text-gray-500 mt-1">AI가 Qdrant 인사이트를 기반으로 자동 생성한 컴포넌트들입니다</p>
        <div className="mt-2 flex gap-2">
          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">자동 생성 2개</span>
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">수동 생성 5개</span>
          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">30분 간격 업데이트</span>
        </div>
      </div>

      {/* AI 자동 생성 컴포넌트 섹션 */}
      <div className="bg-gradient-to-b from-indigo-50/50 to-white rounded-xl p-6 border border-indigo-100">
        <h2 className="text-xl font-bold text-indigo-900 mb-6">🤖 AI 자동 생성 컴포넌트</h2>
        
        {/* RecommendationPerformanceCard */}
        <section className="mb-8">
          <ComponentInfo meta={componentMeta.RecommendationPerformanceCard} />
          <RecommendationPerformanceCard
            clickThroughRate={0.032}
            conversionRate={0.045}
            accuracyScore={0.855}
            collaborativeFilteringScore={0.82}
            contentBasedFilteringScore={0.78}
            totalRecommendations={12500}
            period="2025년 1월"
          />
        </section>

        {/* RecommendationPanel */}
        <section>
          <ComponentInfo meta={componentMeta.RecommendationPanel} />
          <RecommendationPanel
            recommendations={sampleRecommendations}
            metrics={sampleMetrics}
            customerId="CUST-12345"
            showConfidenceScores={true}
          />
        </section>
      </div>

      {/* 기존 컴포넌트 섹션 */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800">📦 기본 CRM 컴포넌트</h2>

        {/* MetricCard 섹션 */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📈 메트릭 카드</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard label="총 매출" value={12450000} previousValue={10825000} format="currency" />
            <MetricCard label="주문 건수" value={1842} previousValue={1650} format="number" />
            <MetricCard label="전환율" value={3.2} previousValue={2.8} format="percent" />
            <MetricCard label="재구매율" value={42.5} previousValue={45.2} format="percent" />
          </div>
        </section>

        {/* StatusBadge 섹션 */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">🏷️ 상태 뱃지</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <StatusBadge status="success" label="완료" size="sm" />
            <StatusBadge status="success" label="성공" size="md" />
            <StatusBadge status="success" label="활성" size="lg" />
            <StatusBadge status="warning" label="주의" size="md" />
            <StatusBadge status="error" label="오류" size="md" />
            <StatusBadge status="info" label="정보" size="md" />
            <StatusBadge status="pending" label="대기중" size="md" />
          </div>
        </section>

        {/* CustomerCard 섹션 */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">👤 고객 카드</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleCustomers.map((customer, idx) => (
              <CustomerCard key={idx} {...customer} />
            ))}
          </div>
        </section>

        {/* StatsSummary 섹션 */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📋 통계 요약</h3>
          <StatsSummary title="고객 현황" stats={sampleStats} period="2025년 1월" />
        </section>

        {/* ActivityItem 섹션 */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">🕐 활동 피드</h3>
          <div className="bg-white rounded-lg shadow p-4 space-y-2">
            {sampleActivities.map((activity, idx) => (
              <ActivityItem key={idx} {...activity} />
            ))}
          </div>
        </section>
      </div>

      {/* 생성 정보 */}
      <section className="bg-gray-50 rounded-lg p-4 border">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">ℹ️ 자동화 정보</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700">생성 프로세스</h4>
            <ul className="text-gray-600 mt-1 space-y-1">
              <li>1. Qdrant에서 인사이트 조회 (30분마다)</li>
              <li>2. LLM이 새 컴포넌트 필요 여부 판단</li>
              <li>3. 컴포넌트 + 테스트 코드 자동 생성</li>
              <li>4. 검증 통과 시 Docker 빌드 & 배포</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">기술 스택</h4>
            <ul className="text-gray-600 mt-1 space-y-1">
              <li>• React 18 + TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• Jest + React Testing Library</li>
              <li>• n8n v12 워크플로우</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ComponentDemo;
