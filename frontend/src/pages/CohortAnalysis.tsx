import { useState } from 'react';
import { Download, TrendingUp, TrendingDown, Users, Info, Calendar } from 'lucide-react';
import { LineChart } from '../components/charts/LineChart';
import { CohortHeatmap } from '../components/charts/HeatmapChart';
import { useCohortData } from '../hooks/useApiData';

const monthOptions = [
  { value: 3, label: '최근 3개월' },
  { value: 6, label: '최근 6개월' },
  { value: 12, label: '최근 12개월' },
];

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

export function CohortAnalysis() {
  const [months, setMonths] = useState(6);
  const { data: cohortData, isLoading } = useCohortData(months);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">코호트 분석</h1>
          <p className="text-gray-500 mt-1">월별 고객 리텐션 분석</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  // Calculate metrics
  const totalNewUsers = cohortData?.reduce((sum, c) => sum + c.totalUsers, 0) || 0;

  // Average retention per month
  const avgRetentionByMonth: number[] = [];
  const maxRetentionLength = Math.max(...(cohortData?.map((c) => c.retention.length) || [0]));

  for (let i = 0; i < maxRetentionLength; i++) {
    const values = cohortData
      ?.map((c) => c.retention[i])
      .filter((v) => v !== undefined) || [];
    const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    avgRetentionByMonth.push(avg);
  }

  // Month 1 average retention (after signup month)
  const month1Retention = avgRetentionByMonth[1] || 0;
  const month3Retention = avgRetentionByMonth[3] || 0;

  // Latest cohort performance vs average
  const latestCohort = cohortData?.[cohortData.length - 1];
  const latestMonth1 = latestCohort?.retention[1];
  const month1Diff = latestMonth1 !== undefined ? latestMonth1 - month1Retention : 0;

  // Retention trend data for line chart
  const retentionTrendData = avgRetentionByMonth.map((value, index) => ({
    month: index === 0 ? '가입월' : `+${index}개월`,
    retention: value,
  }));

  // Best and worst performing cohorts (based on month 1 retention)
  const cohortsWithM1 = cohortData
    ?.filter((c) => c.retention[1] !== undefined)
    .sort((a, b) => (b.retention[1] || 0) - (a.retention[1] || 0)) || [];

  const bestCohort = cohortsWithM1[0];
  const worstCohort = cohortsWithM1[cohortsWithM1.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">코호트 분석</h1>
          <p className="text-gray-500 mt-1">월별 고객 리텐션 분석</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-cafe24-primary focus:border-transparent outline-none"
          >
            {monthOptions.map((opt) => (
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
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">신규 고객 (전체)</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalNewUsers.toLocaleString()}명
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">1개월 평균 리텐션</p>
              <p className="text-2xl font-bold text-gray-900">
                {month1Retention.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">3개월 평균 리텐션</p>
              <p className="text-2xl font-bold text-gray-900">
                {month3Retention.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${month1Diff >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {month1Diff >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">최근 코호트 vs 평균</p>
              <p className={`text-2xl font-bold ${month1Diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {month1Diff >= 0 ? '+' : ''}{month1Diff.toFixed(1)}%p
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Heatmap */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">리텐션 히트맵</h2>
            <p className="text-sm text-gray-500 mt-1">
              각 코호트별 월간 리텐션율 (%)
            </p>
          </div>
        </div>
        <CohortHeatmap
          data={cohortData || []}
          maxMonths={months}
        />
      </div>

      {/* Retention Trend Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">평균 리텐션 추이</h2>
          <LineChart
            data={retentionTrendData}
            xKey="month"
            lines={[
              { key: 'retention', name: '평균 리텐션', color: '#00a8e8', type: 'area' },
            ]}
            height={280}
            formatYAxis={(v) => `${v}%`}
            formatTooltip={(v) => [`${v.toFixed(1)}%`, '리텐션']}
          />
        </div>

        {/* Cohort Comparison */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">코호트 비교</h2>
          <div className="space-y-4">
            {bestCohort && (
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">최고 성과 코호트</span>
                  </div>
                  <span className="text-sm text-gray-500">{bestCohort.cohort}</span>
                </div>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-3xl font-bold text-green-600">
                      {bestCohort.retention[1]?.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">1개월 리텐션</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>총 {bestCohort.totalUsers.toLocaleString()}명</p>
                    <p>평균 대비 +{((bestCohort.retention[1] || 0) - month1Retention).toFixed(1)}%p</p>
                  </div>
                </div>
              </div>
            )}

            {worstCohort && worstCohort !== bestCohort && (
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-gray-900">개선 필요 코호트</span>
                  </div>
                  <span className="text-sm text-gray-500">{worstCohort.cohort}</span>
                </div>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-3xl font-bold text-red-600">
                      {worstCohort.retention[1]?.toFixed(1)}%
                    </p>
                    <p className="text-sm text-gray-500">1개월 리텐션</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>총 {worstCohort.totalUsers.toLocaleString()}명</p>
                    <p>평균 대비 {((worstCohort.retention[1] || 0) - month1Retention).toFixed(1)}%p</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Retention by Cohort Size */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">코호트별 상세</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-500">코호트</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">신규 고객</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">1개월</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">2개월</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">3개월</th>
                <th className="text-right py-3 text-sm font-medium text-gray-500">추세</th>
              </tr>
            </thead>
            <tbody>
              {cohortData?.map((cohort) => {
                const m1 = cohort.retention[1];
                const trend = m1 !== undefined ? (m1 >= month1Retention ? 'up' : 'down') : null;
                return (
                  <tr key={cohort.cohort} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 text-sm font-medium text-gray-900">{cohort.cohort}</td>
                    <td className="py-3 text-right text-sm text-gray-600">
                      {cohort.totalUsers.toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      {m1 !== undefined ? (
                        <span className={`text-sm font-medium ${
                          m1 >= 50 ? 'text-green-600' : m1 >= 30 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {m1.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {cohort.retention[2] !== undefined ? (
                        <span className="text-sm text-gray-600">{cohort.retention[2].toFixed(1)}%</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {cohort.retention[3] !== undefined ? (
                        <span className="text-sm text-gray-600">{cohort.retention[3].toFixed(1)}%</span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      {trend === 'up' ? (
                        <span className="inline-flex items-center text-green-600">
                          <TrendingUp className="w-4 h-4" />
                        </span>
                      ) : trend === 'down' ? (
                        <span className="inline-flex items-center text-red-600">
                          <TrendingDown className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="card bg-gradient-to-r from-cafe24-primary/5 to-cafe24-accent/5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-cafe24-primary mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900">리텐션 인사이트</h3>
            <div className="mt-4 space-y-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">주요 발견</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-cafe24-primary font-bold">1.</span>
                    <span>
                      평균 1개월 리텐션은 <strong>{month1Retention.toFixed(1)}%</strong>로,
                      업계 평균(35-40%) 대비 {month1Retention >= 35 ? '우수' : '개선 필요'}한 수준입니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cafe24-primary font-bold">2.</span>
                    <span>
                      최근 코호트({latestCohort?.cohort})의 1개월 리텐션은
                      {latestMonth1 !== undefined && (
                        <strong className={month1Diff >= 0 ? ' text-green-600' : ' text-red-600'}>
                          {' '}{latestMonth1.toFixed(1)}%
                        </strong>
                      )}
                      로 평균 대비 {month1Diff >= 0 ? '상승' : '하락'} 추세입니다.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cafe24-primary font-bold">3.</span>
                    <span>
                      {bestCohort && (
                        <>
                          <strong>{bestCohort.cohort}</strong> 코호트가 가장 높은 리텐션을 보이며,
                          해당 시기의 마케팅/프로모션 전략을 분석할 필요가 있습니다.
                        </>
                      )}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">개선 제안</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">+</span>
                    <span>신규 고객 온보딩 프로그램 강화로 첫 달 리텐션 개선</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">+</span>
                    <span>2-3개월 차 고객 대상 재구매 인센티브 캠페인</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">+</span>
                    <span>이탈 위험 고객 조기 식별을 위한 알림 시스템 구축</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button className="btn-primary text-sm">
                  신규 고객 온보딩 캠페인 만들기
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  상세 리포트 다운로드
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
