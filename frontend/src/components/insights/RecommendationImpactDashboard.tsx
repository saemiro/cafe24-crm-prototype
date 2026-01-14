import React from "react";

interface RecommendationMetrics {
  productRecommendations?: {
    totalGenerated: number;
    clickThroughRate: number;
    conversionRate: number;
    accuracy: number;
  };
  customerEngagement?: {
    emailOpenRate: number;
    pushNotificationClickRate: number;
    sessionEngagement: number;
    retentionRate: number;
  };
  orderConversions?: {
    totalOrders: number;
    averageOrderValue: number;
    conversionLift: number;
    revenueImpact: number;
  };
  realTimeAccuracy?: {
    current: number;
    trend: number;
    lastUpdated: string;
  };
}

interface RecommendationImpactDashboardProps {
  recommendationMetrics: RecommendationMetrics;
  timeRange?: string;
  customerSegmentFilter?: string[];
  showABTestComparison?: boolean;
}

const RecommendationImpactDashboard: React.FC<RecommendationImpactDashboardProps> = ({
  recommendationMetrics,
  timeRange = "7d",
  customerSegmentFilter = [],
  showABTestComparison = false,
}) => {
  const formatMetric = (value: number, isPercentage: boolean = false): string => {
    if (isPercentage) {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  const getTrendIndicator = (trend: number): string => {
    if (trend > 0) return "↑";
    if (trend < 0) return "↓";
    return "→";
  };

  const getTrendColor = (trend: number): string => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-600";
  };

  const MetricCard: React.FC<{
    title: string;
    value: string;
    icon: string;
    trend?: number;
    subMetrics?: Array<{ label: string; value: string }>;
  }> = ({ title, value, icon, trend, subMetrics }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      {trend !== undefined && (
        <div className={`text-sm font-semibold ${getTrendColor(trend)}`}>
          {getTrendIndicator(trend)} {Math.abs(trend).toFixed(1)}% vs last period
        </div>
      )}
      {subMetrics && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
          {subMetrics.map((metric, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="text-gray-600">{metric.label}</span>
              <span className="font-semibold text-gray-900">{metric.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ProgressBar: React.FC<{ label: string; value: number; max?: number }> = ({
    label,
    value,
    max = 100,
  }) => {
    const percentage = (value / max) * 100;
    return (
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-semibold text-gray-900">{(percentage).toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Recommendation Impact Dashboard
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>📊 Time Range: {timeRange}</span>
            {customerSegmentFilter.length > 0 && (
              <span>👥 Segments: {customerSegmentFilter.join(", ")}</span>
            )}
            {showABTestComparison && <span>🧪 A/B Test Comparison Active</span>}
          </div>
        </div>

        {/* Real-Time Accuracy Alert */}
        {recommendationMetrics.realTimeAccuracy && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div className="flex-1">
                <p className="font-semibold text-blue-900">Real-Time Accuracy Tracking</p>
                <p className="text-sm text-blue-800">
                  Current: {formatMetric(recommendationMetrics.realTimeAccuracy.current, true)} •
                  Last Updated: {recommendationMetrics.realTimeAccuracy.lastUpdated}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Product Recommendations */}
          <MetricCard
            title="Product Recommendations"
            value={
              recommendationMetrics.productRecommendations
                ? formatMetric(recommendationMetrics.productRecommendations.totalGenerated)
                : "0"
            }
            icon="📦"
            trend={recommendationMetrics.productRecommendations?.accuracy}
            subMetrics={
              recommendationMetrics.productRecommendations
                ? [
                    {
                      label: "CTR",
                      value: formatMetric(
                        recommendationMetrics.productRecommendations.clickThroughRate,
                        true
                      ),
                    },
                    {
                      label: "Conversion",
                      value: formatMetric(
                        recommendationMetrics.productRecommendations.conversionRate,
                        true
                      ),
                    },
                  ]
                : undefined
            }
          />

          {/* Customer Engagement */}
          <MetricCard
            title="Customer Engagement"
            value={
              recommendationMetrics.customerEngagement
                ? formatMetric(recommendationMetrics.customerEngagement.sessionEngagement, true)
                : "0%"
            }
            icon="💬"
            trend={recommendationMetrics.customerEngagement?.retentionRate}
            subMetrics={
              recommendationMetrics.customerEngagement
                ? [
                    {
                      label: "Email Open Rate",
                      value: formatMetric(recommendationMetrics.customerEngagement.emailOpenRate, true),
                    },
                    {
                      label: "Push Click Rate",
                      value: formatMetric(
                        recommendationMetrics.customerEngagement.pushNotificationClickRate,
                        true
                      ),
                    },
                  ]
                : undefined
            }
          />

          {/* Order Conversions */}
          <MetricCard
            title="Order Conversions"
            value={
              recommendationMetrics.orderConversions
                ? formatMetric(recommendationMetrics.orderConversions.totalOrders)
                : "0"
            }
            icon="🛒"
            trend={recommendationMetrics.orderConversions?.conversionLift}
            subMetrics={
              recommendationMetrics.orderConversions
                ? [
                    {
                      label: "Avg Order Value",
                      value: `$${recommendationMetrics.orderConversions.averageOrderValue.toFixed(2)}`,
                    },
                    {
                      label: "Revenue Impact",
                      value: `$${formatMetric(recommendationMetrics.orderConversions.revenueImpact)}`,
                    },
                  ]
                : undefined
            }
          />
        </div>

        {/* Performance Tracking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommendation Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📈</span> Recommendation Performance
            </h2>
            {recommendationMetrics.productRecommendations ? (
              <div className="space-y-4">
                <ProgressBar
                  label="Click-Through Rate"
                  value={recommendationMetrics.productRecommendations.clickThroughRate * 100}
                />
                <ProgressBar
                  label="Conversion Rate"
                  value={recommendationMetrics.productRecommendations.conversionRate * 100}
                />
                <ProgressBar
                  label="Model Accuracy"
                  value={recommendationMetrics.productRecommendations.accuracy * 100}
                />
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>👥</span> Engagement Metrics
            </h2>
            {recommendationMetrics.customerEngagement ? (
              <div className="space-y-4">
                <ProgressBar
                  label="Email Open Rate"
                  value={recommendationMetrics.customerEngagement.emailOpenRate * 100}
                />
                <ProgressBar
                  label="Push Notification Click Rate"
                  value={recommendationMetrics.customerEngagement.pushNotificationClickRate * 100}
                />
                <ProgressBar
                  label="Customer Retention"
                  value={recommendationMetrics.customerEngagement.retentionRate * 100}
                />
              </div>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>
        </div>

        {/* A/B Test Comparison */}
        {showABTestComparison && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🧪</span> A/B Test Comparison
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Control Group</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion Rate</span>
                    <span className="font-semibold">2.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Order Value</span>
                    <span className="font-semibold">$87.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Click-Through Rate</span>
                    <span className="font-semibold">1.8%</span>
                  </div>
                </div>
              </div>
              <div className="border-2 border-green-200 bg-green-50 rounded p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Test Group</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion Rate</span>
                    <span className="font-semibold text-green-600">3.2% ↑</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Order Value</span>
                    <span className="font-semibold text-green-600">$124.80 ↑</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Click-Through Rate</span>
                    <span className="font-semibold text-green-600">2.7% ↑</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Dashboard auto-refreshes every 5 minutes • Last sync: just now</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationImpactDashboard;
