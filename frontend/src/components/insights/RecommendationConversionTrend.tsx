import React from "react";

interface RecommendationConversionTrendProps {
  timeRange: string;
  segmentId?: string;
  campaignId?: string;
  metrics: Array<{
    date: string;
    ctr: number;
    conversionRate: number;
    revenue: number;
    recommendations: number;
    orders: number;
  }>;
  showComparison?: boolean;
}

const RecommendationConversionTrend: React.FC<RecommendationConversionTrendProps> = ({
  timeRange,
  segmentId,
  campaignId,
  metrics,
  showComparison = false,
}) => {
  const maxMetrics = {
    ctr: Math.max(...metrics.map((m) => m.ctr), 0),
    conversionRate: Math.max(...metrics.map((m) => m.conversionRate), 0),
    revenue: Math.max(...metrics.map((m) => m.revenue), 0),
  };

  const getTrendIndicator = (values: number[]): string => {
    if (values.length < 2) return "→";
    const recent = values.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, values.length);
    const previous = values.slice(-6, -3).reduce((a, b) => a + b, 0) / Math.min(3, values.length - 3);
    if (previous === 0) return "→";
    if (recent > previous) return "↑";
    if (recent < previous) return "↓";
    return "→";
  };

  const ctrTrend = getTrendIndicator(metrics.map((m) => m.ctr));
  const conversionTrend = getTrendIndicator(metrics.map((m) => m.conversionRate));
  const revenueTrend = getTrendIndicator(metrics.map((m) => m.revenue));

  const avgCtr = (metrics.reduce((sum, m) => sum + m.ctr, 0) / metrics.length).toFixed(2);
  const avgConversion = (metrics.reduce((sum, m) => sum + m.conversionRate, 0) / metrics.length).toFixed(2);
  const totalRevenue = metrics.reduce((sum, m) => sum + m.revenue, 0).toFixed(0);
  const totalRecommendations = metrics.reduce((sum, m) => sum + m.recommendations, 0);
  const totalOrders = metrics.reduce((sum, m) => sum + m.orders, 0);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recommendation Conversion Trend</h2>
            <p className="text-gray-600 text-sm mt-1">
              {timeRange}
              {segmentId && ` • Segment: ${segmentId}`}
              {campaignId && ` • Campaign: ${campaignId}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm font-medium">Click-Through Rate</p>
            <p className="text-2xl font-bold text-blue-600">{avgCtr}%</p>
            <p className="text-xs text-gray-500 mt-1">{ctrTrend} Trend</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm font-medium">Conversion Rate</p>
            <p className="text-2xl font-bold text-green-600">{avgConversion}%</p>
            <p className="text-xs text-gray-500 mt-1">{conversionTrend} Trend</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-600">${totalRevenue}</p>
            <p className="text-xs text-gray-500 mt-1">{revenueTrend} Trend</p>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm font-medium">Orders Generated</p>
            <p className="text-2xl font-bold text-orange-600">{totalOrders}</p>
            <p className="text-xs text-gray-500 mt-1">from {totalRecommendations} recs</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Metrics</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Click-Through Rate</span>
              <span className="text-xs text-gray-500">0% - {maxMetrics.ctr.toFixed(1)}%</span>
            </div>
            <div className="flex gap-1 h-16 bg-gray-100 rounded p-2">
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-blue-500 rounded hover:bg-blue-600 relative group"
                  style={{
                    height: `${maxMetrics.ctr > 0 ? (m.ctr / maxMetrics.ctr) * 100 : 0}%`,
                    minHeight: "8px",
                  }}
                >
                  <div className="invisible group-hover:visible bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap absolute -top-8 left-1/2 -translate-x-1/2">
                    {m.date}: {m.ctr.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Conversion Rate</span>
              <span className="text-xs text-gray-500">0% - {maxMetrics.conversionRate.toFixed(1)}%</span>
            </div>
            <div className="flex gap-1 h-16 bg-gray-100 rounded p-2">
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-green-500 rounded hover:bg-green-600 relative group"
                  style={{
                    height: `${maxMetrics.conversionRate > 0 ? (m.conversionRate / maxMetrics.conversionRate) * 100 : 0}%`,
                    minHeight: "8px",
                  }}
                >
                  <div className="invisible group-hover:visible bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap absolute -top-8 left-1/2 -translate-x-1/2">
                    {m.date}: {m.conversionRate.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Revenue Impact</span>
              <span className="text-xs text-gray-500">$0 - ${maxMetrics.revenue.toFixed(0)}</span>
            </div>
            <div className="flex gap-1 h-16 bg-gray-100 rounded p-2">
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-purple-500 rounded hover:bg-purple-600 relative group"
                  style={{
                    height: `${maxMetrics.revenue > 0 ? (m.revenue / maxMetrics.revenue) * 100 : 0}%`,
                    minHeight: "8px",
                  }}
                >
                  <div className="invisible group-hover:visible bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap absolute -top-8 left-1/2 -translate-x-1/2">
                    {m.date}: ${m.revenue.toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {showComparison && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Recommendations → Orders Ratio</span>
                <span className="text-xs text-gray-500">Conversion efficiency</span>
              </div>
              <div className="flex gap-1 h-16 bg-gray-100 rounded p-2">
                {metrics.map((m, idx) => {
                  const ratio = m.recommendations > 0 ? (m.orders / m.recommendations) * 100 : 0;
                  const maxRatio = Math.max(...metrics.map((metric) => (metric.recommendations > 0 ? (metric.orders / metric.recommendations) * 100 : 0)));
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-orange-500 rounded hover:bg-orange-600 relative group"
                      style={{
                        height: `${maxRatio > 0 ? (ratio / maxRatio) * 100 : 0}%`,
                        minHeight: "8px",
                      }}
                    >
                      <div className="invisible group-hover:visible bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap absolute -top-8 left-1/2 -translate-x-1/2">
                        {m.date}: {ratio.toFixed(2)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t mt-6 pt-4">
        <p className="text-xs text-gray-500">
          Last updated: {new Date().toLocaleString()} • Showing {metrics.length} data points
        </p>
      </div>
    </div>
  );
};

export default RecommendationConversionTrend;
