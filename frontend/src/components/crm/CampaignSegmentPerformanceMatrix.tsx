import React from "react";

interface DateRange {
  start: string;
  end: string;
}

interface SegmentMetrics {
  [key: string]: {
    impressions: number;
    clicks: number;
    conversions: number;
    orders: number;
    revenue: number;
  };
}

interface CampaignSegmentPerformanceMatrixProps {
  campaignId: string;
  segments: string[];
  metrics: SegmentMetrics;
  dateRange?: DateRange;
  comparisonMode?: boolean;
}

const CampaignSegmentPerformanceMatrix: React.FC<
  CampaignSegmentPerformanceMatrixProps
> = ({
  campaignId,
  segments,
  metrics,
  dateRange,
  comparisonMode = false,
}) => {
  const calculateCTR = (clicks: number, impressions: number): number => {
    return impressions > 0 ? (clicks / impressions) * 100 : 0;
  };

  const calculateConversionRate = (
    conversions: number,
    clicks: number
  ): number => {
    return clicks > 0 ? (conversions / clicks) * 100 : 0;
  };

  const calculateROI = (revenue: number, spent: number): number => {
    return spent > 0 ? ((revenue - spent) / spent) * 100 : 0;
  };

  const getPerformanceColor = (value: number, type: string): string => {
    if (type === "conversion") {
      if (value >= 5) return "bg-green-100 text-green-900";
      if (value >= 3) return "bg-blue-100 text-blue-900";
      if (value >= 1) return "bg-yellow-100 text-yellow-900";
      return "bg-red-100 text-red-900";
    }
    if (type === "ctr") {
      if (value >= 3) return "bg-green-100 text-green-900";
      if (value >= 1) return "bg-blue-100 text-blue-900";
      return "bg-yellow-100 text-yellow-900";
    }
    return "bg-gray-100 text-gray-900";
  };

  const sortedSegments = [...segments].sort(
    (a, b) =>
      (metrics[b]?.conversions || 0) - (metrics[a]?.conversions || 0)
  );

  const maxMetric = Math.max(
    ...sortedSegments.map((seg) => metrics[seg]?.orders || 0)
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Campaign Performance Matrix
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Campaign ID: <span className="font-mono text-gray-900">{campaignId}</span>
          </p>
          {dateRange && (
            <p className="text-sm text-gray-500">
              {dateRange.start} to {dateRange.end}
            </p>
          )}
          {comparisonMode && (
            <span className="inline-block bg-purple-100 text-purple-900 px-3 py-1 rounded-full text-sm font-medium">
              Comparison Mode
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 font-bold text-gray-900 bg-gray-50">
                Customer Segment
              </th>
              <th className="text-center py-3 px-4 font-bold text-gray-900 bg-gray-50">
                Impressions
              </th>
              <th className="text-center py-3 px-4 font-bold text-gray-900 bg-gray-50">
                Clicks
              </th>
              <th className="text-center py-3 px-4 font-bold text-gray-900 bg-gray-50">
                CTR %
              </th>
              <th className="text-center py-3 px-4 font-bold text-gray-900 bg-gray-50">
                Conversions
              </th>
              <th className="text-center py-3 px-4 font-bold text-gray-900 bg-gray-50">
                Conv Rate %
              </th>
              <th className="text-center py-3 px-4 font-bold text-gray-900 bg-gray-50">
                Orders
              </th>
              <th className="text-center py-3 px-4 font-bold text-gray-900 bg-gray-50">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedSegments.map((segment, index) => {
              const segmentData = metrics[segment] || {
                impressions: 0,
                clicks: 0,
                conversions: 0,
                orders: 0,
                revenue: 0,
              };
              const ctr = calculateCTR(
                segmentData.clicks,
                segmentData.impressions
              );
              const conversionRate = calculateConversionRate(
                segmentData.conversions,
                segmentData.clicks
              );
              const performanceWidth =
                maxMetric > 0
                  ? (segmentData.orders / maxMetric) * 100
                  : 0;

              return (
                <tr
                  key={`${segment}-${index}`}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {segment}
                  </td>
                  <td className="text-center py-3 px-4 text-gray-700">
                    {segmentData.impressions.toLocaleString()}
                  </td>
                  <td className="text-center py-3 px-4 text-gray-700">
                    {segmentData.clicks.toLocaleString()}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded font-semibold ${getPerformanceColor(
                        ctr,
                        "ctr"
                      )}`}
                    >
                      {ctr.toFixed(2)}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-700">
                    {segmentData.conversions.toLocaleString()}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded font-semibold ${getPerformanceColor(
                        conversionRate,
                        "conversion"
                      )}`}
                    >
                      {conversionRate.toFixed(2)}%
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <div className="relative h-8 bg-gray-200 rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300 flex items-center justify-center"
                        style={{ width: `${performanceWidth}%` }}
                      >
                        {performanceWidth > 20 && (
                          <span className="text-white text-xs font-bold">
                            {segmentData.orders}
                          </span>
                        )}
                      </div>
                      {performanceWidth <= 20 && (
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                          {segmentData.orders}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-900 font-semibold">
                    ${segmentData.revenue.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Total Impressions</p>
          <p className="text-xl font-bold text-blue-900">
            {sortedSegments
              .reduce((sum, seg) => sum + (metrics[seg]?.impressions || 0), 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Total Orders</p>
          <p className="text-xl font-bold text-green-900">
            {sortedSegments
              .reduce((sum, seg) => sum + (metrics[seg]?.orders || 0), 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
          <p className="text-xl font-bold text-purple-900">
            $
            {sortedSegments
              .reduce((sum, seg) => sum + (metrics[seg]?.revenue || 0), 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Avg Conversion Rate</p>
          <p className="text-xl font-bold text-orange-900">
            {(
              sortedSegments.reduce((sum, seg) => {
                const data = metrics[seg] || {
                  clicks: 0,
                  conversions: 0,
                };
                return (
                  sum +
                  calculateConversionRate(
                    data.conversions,
                    data.clicks
                  )
                );
              }, 0) / sortedSegments.length
            ).toFixed(2)}
            %
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
        <p className="font-semibold mb-2">Performance Indicators:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-green-100 border border-green-400 rounded"></span>
            <span>Excellent (&gt;=5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></span>
            <span>Good (3-5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-yellow-100 border border-yellow-400 rounded"></span>
            <span>Fair (1-3%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-red-100 border border-red-400 rounded"></span>
            <span>Poor (&lt;1%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSegmentPerformanceMatrix;
