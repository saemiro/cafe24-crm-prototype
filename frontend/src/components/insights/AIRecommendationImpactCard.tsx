import React from "react";

interface Product {
  id: string;
  name: string;
  conversionRate: number;
  revenueLift: number;
}

interface Metrics {
  totalConversions: number;
  conversionRate: number;
  revenueLift: number;
  averageOrderValue: number;
  segmentPerformance?: Record<string, {
    conversions: number;
    conversionRate: number;
    revenueLift: number;
  }>;
}

interface AIRecommendationImpactCardProps {
  segmentId?: string;
  campaignId?: string;
  timeRange: string;
  metrics: Metrics;
  topProducts?: Product[];
}

const AIRecommendationImpactCard: React.FC<AIRecommendationImpactCardProps> = ({
  segmentId,
  campaignId,
  timeRange,
  metrics,
  topProducts = [],
}) => {
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatCurrency = (value: number): string => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          AI Recommendation Impact
        </h2>
        <p className="text-sm text-gray-600">
          {segmentId && `Segment: ${segmentId} • `}
          {campaignId && `Campaign: ${campaignId} • `}
          Period: {timeRange}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-semibold">Conversions</span>
            <span className="text-2xl">📊</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">
            {metrics.totalConversions.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-semibold">Conv. Rate</span>
            <span className="text-2xl">✓</span>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatPercentage(metrics.conversionRate)}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-semibold">Revenue Lift</span>
            <span className="text-2xl">📈</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {formatPercentage(metrics.revenueLift)}
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 font-semibold">Avg. Order Value</span>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            {formatCurrency(metrics.averageOrderValue)}
          </p>
        </div>
      </div>

      {metrics.segmentPerformance && Object.keys(metrics.segmentPerformance).length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Segment-Specific Performance
          </h3>
          <div className="space-y-3">
            {Object.entries(metrics.segmentPerformance).map(([segment, data]) => (
              <div key={segment} className="bg-gray-50 rounded-lg p-4 border border-gray-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">{segment}</span>
                  <span className="text-sm text-gray-600">
                    {data.conversions} conversions
                  </span>
                </div>
                <div className="flex gap-6">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Conversion Rate</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(data.conversionRate * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {formatPercentage(data.conversionRate)}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-1">Revenue Lift</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min(data.revenueLift * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 mt-1">
                      {formatPercentage(data.revenueLift)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {topProducts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Recommended Products
          </h3>
          <div className="space-y-2">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400 w-6">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{product.name}</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-right">
                    <p className="text-gray-600">Conv. Rate</p>
                    <p className="font-semibold text-gray-900">
                      {formatPercentage(product.conversionRate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Lift</p>
                    <p className="font-semibold text-green-600">
                      {formatPercentage(product.revenueLift)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendationImpactCard;
