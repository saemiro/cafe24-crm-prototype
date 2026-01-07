import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Info, Users, TrendingUp, DollarSign, Clock, ChevronRight } from 'lucide-react';
import { BarChart } from '../components/charts/BarChart';
import { useRfmAnalysis } from '../hooks/useApiData';

const segmentDescriptions: Record<string, { title: string; description: string; action: string }> = {
  'Champions': {
    title: '최우수 고객',
    description: '최근에 구매했고, 자주 구매하며, 높은 금액을 지출하는 고객',
    action: '로열티 프로그램, 신제품 얼리 액세스, VIP 혜택 제공',
  },
  'Loyal Customers': {
    title: '충성 고객',
    description: '자주 구매하고 좋은 금액을 지출하는 고객',
    action: '업셀링, 리뷰 요청, 추천 프로그램 참여 유도',
  },
  'Potential Loyalist': {
    title: '잠재 충성 고객',
    description: '최근 구매한 고객으로 성장 가능성이 높음',
    action: '멤버십 안내, 맞춤 추천, 재구매 유도',
  },
  'New Customers': {
    title: '신규 고객',
    description: '최근 처음 구매한 고객',
    action: '온보딩 이메일, 환영 할인, 제품 가이드 제공',
  },
  'Promising': {
    title: '유망 고객',
    description: '최근 구매한 평균적인 고객',
    action: '브랜드 인지도 향상, 프로모션 참여 유도',
  },
  'Need Attention': {
    title: '관심 필요 고객',
    description: '평균 이상의 고객이었으나 최근 구매 감소',
    action: '재참여 캠페인, 개인화 제안, 설문조사',
  },
  'At Risk': {
    title: '이탈 위험 고객',
    description: '자주 구매했던 고객이 최근 활동 없음',
    action: '긴급 리텐션 캠페인, 특별 할인, 개인 연락',
  },
  'Cant Lose Them': {
    title: '잃으면 안되는 고객',
    description: '과거 최고 고객이었으나 현재 미활동',
    action: '윈백 캠페인, 개인화 접근, 피드백 수집',
  },
  'Hibernating': {
    title: '휴면 고객',
    description: '마지막 구매 이후 오랜 시간이 지난 고객',
    action: '재활성화 캠페인, 특별 프로모션',
  },
  'Lost': {
    title: '이탈 고객',
    description: '장기간 구매가 없는 고객',
    action: '재획득 캠페인 또는 세그먼트에서 제외',
  },
};

function RfmScoreCell({ value, max = 5 }: { value: number; max?: number }) {
  const percentage = (value / max) * 100;
  const getColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-lime-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 w-6">{value}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="h-64 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export function RfmAnalysis() {
  const { data: rfmData, isLoading } = useRfmAnalysis();
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RFM 분석</h1>
          <p className="text-gray-500 mt-1">고객 가치 기반 세그먼트 분석</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  const totalCustomers = rfmData?.reduce((sum, s) => sum + s.count, 0) || 0;
  const avgRecency = rfmData
    ? rfmData.reduce((sum, s) => sum + s.avgRecency * s.count, 0) / totalCustomers
    : 0;
  const avgFrequency = rfmData
    ? rfmData.reduce((sum, s) => sum + s.avgFrequency * s.count, 0) / totalCustomers
    : 0;
  const avgMonetary = rfmData
    ? rfmData.reduce((sum, s) => sum + s.avgMonetary * s.count, 0) / totalCustomers
    : 0;

  const chartData = rfmData?.map((s) => ({
    segment: s.segment,
    count: s.count,
    percentage: s.percentage,
  })) || [];

  const selectedSegmentData = selectedSegment
    ? rfmData?.find((s) => s.segment === selectedSegment)
    : null;

  const segmentInfo = selectedSegment ? segmentDescriptions[selectedSegment] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">RFM 분석</h1>
          <p className="text-gray-500 mt-1">고객 가치 기반 세그먼트 분석</p>
        </div>
        <button className="btn-primary flex items-center gap-2 self-start">
          <Download className="w-4 h-4" />
          리포트 내보내기
        </button>
      </div>

      {/* RFM Overview */}
      <div className="card bg-gradient-to-r from-cafe24-primary/5 to-cafe24-accent/5">
        <div className="flex items-start gap-3 mb-4">
          <Info className="w-5 h-5 text-cafe24-primary mt-0.5" />
          <div>
            <h3 className="font-medium text-gray-900">RFM 분석이란?</h3>
            <p className="text-sm text-gray-600 mt-1">
              RFM은 Recency(최근성), Frequency(빈도), Monetary(금액)의 약자로,
              고객의 구매 행동을 분석하여 가치 기반 세그먼트를 생성합니다.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">평균 Recency</p>
              <p className="text-lg font-bold text-gray-900">{avgRecency.toFixed(0)}일</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">평균 Frequency</p>
              <p className="text-lg font-bold text-gray-900">{avgFrequency.toFixed(1)}회</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">평균 Monetary</p>
              <p className="text-lg font-bold text-gray-900">
                {(avgMonetary / 10000).toFixed(0)}만원
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-sm text-gray-500">총 고객수</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {totalCustomers.toLocaleString()}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">세그먼트 수</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{rfmData?.length || 0}</p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">우수 고객</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {((rfmData?.filter((s) => s.r >= 4 && s.f >= 4).reduce((sum, s) => sum + s.count, 0) || 0) / totalCustomers * 100).toFixed(1)}%
          </p>
        </div>
        <div className="card text-center">
          <p className="text-sm text-gray-500">이탈 위험</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {((rfmData?.filter((s) => s.r <= 2).reduce((sum, s) => sum + s.count, 0) || 0) / totalCustomers * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Segment Distribution Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">세그먼트 분포</h2>
          <BarChart
            data={chartData}
            xKey="segment"
            bars={[{ key: 'count', name: '고객수', color: '#00a8e8' }]}
            height={350}
            layout="vertical"
            formatYAxis={(v) => v.toLocaleString()}
            colorByValue
            colors={rfmData?.map((s) => s.color) || []}
          />
        </div>

        {/* Segment Table */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">세그먼트 상세</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-500">세그먼트</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-500">R</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-500">F</th>
                  <th className="text-center py-3 text-sm font-medium text-gray-500">M</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">고객수</th>
                </tr>
              </thead>
              <tbody>
                {rfmData?.map((segment) => (
                  <tr
                    key={segment.segment}
                    className={`border-b border-gray-100 cursor-pointer transition-colors ${
                      selectedSegment === segment.segment
                        ? 'bg-cafe24-primary/5'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedSegment(
                      selectedSegment === segment.segment ? null : segment.segment
                    )}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: segment.color }}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {segment.segment}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <RfmScoreCell value={segment.r} />
                    </td>
                    <td className="py-3 text-center">
                      <RfmScoreCell value={segment.f} />
                    </td>
                    <td className="py-3 text-center">
                      <RfmScoreCell value={segment.m} />
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="text-sm text-gray-900">
                          {segment.count.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({segment.percentage}%)
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Selected Segment Detail */}
      {selectedSegmentData && segmentInfo && (
        <div className="card border-2 border-cafe24-primary/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: selectedSegmentData.color }}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {segmentInfo.title}
                </h3>
                <p className="text-sm text-gray-500">{selectedSegmentData.segment}</p>
              </div>
            </div>
            <Link
              to={`/customers?segment=${selectedSegmentData.segment}`}
              className="flex items-center gap-1 text-cafe24-primary hover:underline text-sm"
            >
              고객 목록 보기
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div>
              <p className="text-sm text-gray-500">고객수</p>
              <p className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                {selectedSegmentData.count.toLocaleString()}명
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 최근성</p>
              <p className="text-xl font-bold text-gray-900">
                {selectedSegmentData.avgRecency}일
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 구매 빈도</p>
              <p className="text-xl font-bold text-gray-900">
                {selectedSegmentData.avgFrequency.toFixed(1)}회
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 구매 금액</p>
              <p className="text-xl font-bold text-gray-900">
                {(selectedSegmentData.avgMonetary / 10000).toFixed(0)}만원
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>세그먼트 특성:</strong> {segmentInfo.description}
            </p>
            <p className="text-sm text-gray-600">
              <strong>추천 액션:</strong> {segmentInfo.action}
            </p>
          </div>

          <div className="mt-4 flex gap-3">
            <Link
              to={`/campaigns?segment=${selectedSegmentData.segment}`}
              className="btn-primary text-sm"
            >
              캠페인 만들기
            </Link>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              세그먼트 내보내기
            </button>
          </div>
        </div>
      )}

      {/* RFM Matrix */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">RFM 매트릭스</h2>
        <p className="text-sm text-gray-500 mb-6">
          Recency와 Frequency 기준 고객 분포 (크기는 Monetary 반영)
        </p>
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="flex">
              {/* Y-axis label */}
              <div className="w-16 flex items-center justify-center">
                <span className="text-sm text-gray-500 -rotate-90 whitespace-nowrap">
                  Frequency
                </span>
              </div>
              {/* Matrix grid */}
              <div className="flex-1">
                <div className="grid grid-cols-5 gap-2">
                  {[5, 4, 3, 2, 1].map((f) =>
                    [1, 2, 3, 4, 5].map((r) => {
                      const matching = rfmData?.filter(
                        (s) => s.r === r && s.f === f
                      );
                      const count = matching?.reduce((sum, s) => sum + s.count, 0) || 0;
                      const percentage = totalCustomers > 0 ? (count / totalCustomers) * 100 : 0;
                      const opacity = Math.min(percentage / 20 + 0.1, 1);

                      return (
                        <div
                          key={`${r}-${f}`}
                          className="aspect-square rounded-lg flex flex-col items-center justify-center p-2 cursor-pointer hover:ring-2 hover:ring-cafe24-primary transition-all"
                          style={{
                            backgroundColor: `rgba(0, 168, 232, ${opacity})`,
                          }}
                          title={`R=${r}, F=${f}: ${count}명 (${percentage.toFixed(1)}%)`}
                        >
                          <span className={`text-xs font-medium ${opacity > 0.5 ? 'text-white' : 'text-gray-700'}`}>
                            {count > 0 ? count.toLocaleString() : '-'}
                          </span>
                          {count > 0 && (
                            <span className={`text-[10px] ${opacity > 0.5 ? 'text-white/80' : 'text-gray-500'}`}>
                              {percentage.toFixed(1)}%
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                {/* X-axis labels */}
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <div key={r} className="text-center text-xs text-gray-500">
                      R={r}
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-500 mt-2">Recency</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
