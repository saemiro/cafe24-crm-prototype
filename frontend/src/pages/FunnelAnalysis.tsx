import { useState } from 'react';
import { Download, TrendingDown, TrendingUp, AlertTriangle, Target, Info } from 'lucide-react';
import { FunnelChart } from '../components/charts/FunnelChart';
import { BarChart } from '../components/charts/BarChart';
import { useFunnelData } from '../hooks/useApiData';

const periodOptions = [
  { value: '7d', label: '최근 7일' },
  { value: '30d', label: '최근 30일' },
  { value: '90d', label: '최근 90일' },
  { value: 'year', label: '최근 1년' },
];

const funnelColors = ['#00a8e8', '#0096d4', '#0084bf', '#0072ab', '#006096'];

function formatNumber(value: number): string {
  if (value >= 10000) {
    return `${(value / 10000).toFixed(1)}만`;
  }
  return value.toLocaleString();
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="h-96 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export function FunnelAnalysis() {
  const [period, setPeriod] = useState('30d');
  const { data: funnelData, isLoading } = useFunnelData(period);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">퍼널 분석</h1>
          <p className="text-gray-500 mt-1">고객 구매 여정 전환율 분석</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  const firstStep = funnelData?.[0];
  const lastStep = funnelData?.[funnelData.length - 1];
  const overallConversion = firstStep && lastStep
    ? ((lastStep.value / firstStep.value) * 100)
    : 0;

  // Find biggest dropoff
  let biggestDropoff = { step: '', dropoff: 0, index: 0 };
  funnelData?.forEach((step, index) => {
    if (step.dropoff > biggestDropoff.dropoff) {
      biggestDropoff = { step: step.label, dropoff: step.dropoff, index };
    }
  });

  // Calculate step-by-step conversion rates
  const conversionRates = funnelData?.map((step, index) => {
    if (index === 0) return { ...step, conversionRate: 100 };
    const prevValue = funnelData[index - 1].value;
    const conversionRate = prevValue > 0 ? (step.value / prevValue) * 100 : 0;
    return { ...step, conversionRate };
  }) || [];

  // Comparison data (mock previous period)
  const comparisonData = funnelData?.map((step) => ({
    step: step.label,
    current: step.percentage,
    previous: Math.max(0, step.percentage - (Math.random() * 5 - 2)),
  })) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">퍼널 분석</h1>
          <p className="text-gray-500 mt-1">고객 구매 여정 전환율 분석</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cafe24-primary focus:border-transparent outline-none"
          >
            {periodOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            내보내기
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">전체 전환율</p>
              <p className="text-2xl font-bold text-gray-900">{overallConversion.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">구매 완료</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(lastStep?.value || 0)}건
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">총 이탈</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber((firstStep?.value || 0) - (lastStep?.value || 0))}건
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">최대 이탈 구간</p>
              <p className="text-lg font-bold text-gray-900 truncate" title={biggestDropoff.step}>
                {biggestDropoff.step}
              </p>
              <p className="text-sm text-orange-600">-{biggestDropoff.dropoff.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Funnel */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">구매 퍼널</h2>
        <p className="text-sm text-gray-500 mb-6">
          방문부터 구매 완료까지의 고객 여정
        </p>
        <FunnelChart
          data={funnelData || []}
          height={400}
          showDropoff
          colors={funnelColors}
          formatValue={formatNumber}
        />
      </div>

      {/* Step Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step by Step Table */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">단계별 상세</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-sm font-medium text-gray-500">단계</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">방문자</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">전체 대비</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">전환율</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">이탈률</th>
                </tr>
              </thead>
              <tbody>
                {conversionRates.map((step, index) => (
                  <tr key={step.step} className="border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: funnelColors[index] }}
                        />
                        <span className="text-sm font-medium text-gray-900">{step.label}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right text-sm text-gray-900">
                      {step.value.toLocaleString()}
                    </td>
                    <td className="py-3 text-right text-sm text-gray-600">
                      {step.percentage.toFixed(1)}%
                    </td>
                    <td className="py-3 text-right">
                      {index === 0 ? (
                        <span className="text-sm text-gray-400">-</span>
                      ) : (
                        <span className={`text-sm font-medium ${
                          step.conversionRate >= 50 ? 'text-green-600' :
                          step.conversionRate >= 30 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {step.conversionRate.toFixed(1)}%
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {step.dropoff > 0 ? (
                        <span className="text-sm text-red-600">
                          -{step.dropoff.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Period Comparison */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">기간 비교</h2>
          <p className="text-sm text-gray-500 mb-4">이전 동기간 대비 전환율 변화</p>
          <BarChart
            data={comparisonData}
            xKey="step"
            bars={[
              { key: 'current', name: '현재', color: '#00a8e8' },
              { key: 'previous', name: '이전', color: '#94a3b8' },
            ]}
            height={280}
            formatYAxis={(v) => `${v}%`}
          />
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="card bg-gradient-to-r from-cafe24-primary/5 to-cafe24-accent/5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-cafe24-primary mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900">인사이트 및 개선 제안</h3>
            <div className="mt-4 space-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-gray-900">주요 이탈 구간 분석</span>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>{biggestDropoff.step}</strong> 단계에서 {biggestDropoff.dropoff.toFixed(1)}%의 이탈이 발생합니다.
                  이 구간의 사용자 경험을 개선하면 전환율을 크게 높일 수 있습니다.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-gray-900">개선 제안</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-cafe24-primary">1.</span>
                    <span>상품 조회 후 장바구니 전환율 개선을 위해 "바로 구매" 버튼 추가 권장</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cafe24-primary">2.</span>
                    <span>장바구니 이탈 고객 대상 리마인더 푸시 알림 설정</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cafe24-primary">3.</span>
                    <span>결제 단계 간소화 및 다양한 결제 수단 제공</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button className="btn-primary text-sm">
                  장바구니 리마인더 캠페인 만들기
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  상세 리포트 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drop-off Analysis */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">이탈 분석</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {funnelData?.slice(0, -1).map((step, index) => {
            const nextStep = funnelData[index + 1];
            const dropoffCount = step.value - nextStep.value;
            return (
              <div key={step.step} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: funnelColors[index] }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {step.label} → {nextStep.label}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      -{step.dropoff.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {dropoffCount.toLocaleString()}명 이탈
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-200" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
