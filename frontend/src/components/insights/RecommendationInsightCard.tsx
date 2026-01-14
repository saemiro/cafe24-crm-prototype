import React from "react";

interface Metric {
  ctr?: number;
  conversionRate?: number;
  avgOrderValue?: number;
  totalRecommendations?: number;
  [key: string]: number | undefined;
}

interface TopCategory {
  name: string;
  performance: number;
  count: number;
}

interface RecommendationInsightCardProps {
  timeframe: string;
  metrics: Metric;
  topCategories?: TopCategory[];
  customerSegment?: string;
}

const RecommendationInsightCard: React.FC<RecommendationInsightCardProps> = ({
  timeframe,
  metrics,
  topCategories = [],
  customerSegment,
}) => {
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatCurrency = (value: number): string => {
    return `$${value.toFixed(2)}`;
  };

  const getPerformanceColor = (value: number): string => {
    if (value >= 0.1) return "text-green-600";
    if (value >= 0.05) return "text-blue-600";
    return "text-orange-600";
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">
            📊 Recommendation Insights
          </h2>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {timeframe}
          </span>
        </div>
        {customerSegment && (
          <p className="text-sm text-gray-600">
            Segment: <span className="font-semibold">{customerSegment}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Click-Through Rate (CTR)
              </p>
              <p
                className={`text-3xl font-bold ${getPerformanceColor(metrics.ctr || 0)}`}
              >
                {metrics.ctr !== undefined
                  ? formatPercentage(metrics.ctr)
                  : "N/A"}
              </p>
            </div>
            <span className="text-4xl">🔗</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Conversion Rate
              </p>
              <p
                className={`text-3xl font-bold ${getPerformanceColor(metrics.conversionRate || 0)}`}
              >
                {metrics.conversionRate !== undefined
                  ? formatPercentage(metrics.conversionRate)
                  : "N/A"}
              </p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>

        {metrics.avgOrderValue !== undefined && (
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Avg Order Value
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatCurrency(metrics.avgOrderValue)}
                </p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </div>
        )}

        {metrics.totalRecommendations !== undefined && (
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Total Recommendations
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {metrics.totalRecommendations.toLocaleString()}
                </p>
              </div>
              <span className="text-4xl">📈</span>
            </div>
          </div>
        )}
      </div>

      {topCategories.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🎯 Top Performing Categories
          </h3>
          <div className="space-y-3">
            {topCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium text-gray-600 min-w-6">
                    {index + 1}.
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {category.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {category.count} recommendations
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(category.performance * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 min-w-12 text-right">
                    {formatPercentage(category.performance)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 Tip: Track these metrics regularly to optimize your recommendation
          strategy and improve customer engagement.
        </p>
      </div>
    </div>
  );
};

export default RecommendationInsightCard;
