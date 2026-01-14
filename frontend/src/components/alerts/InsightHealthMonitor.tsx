import React from "react";

interface InsightType {
  name: string;
  count: number;
  quality: number;
  feedbackRate: number;
}

interface InsightHealthMonitorProps {
  insightTypes: InsightType[];
  contentEmptyRate: number;
  feedbackCount: number;
  totalInsights: number;
  healthStatus: string;
  lastUpdated?: string;
}

const InsightHealthMonitor: React.FC<InsightHealthMonitorProps> = ({
  insightTypes,
  contentEmptyRate,
  feedbackCount,
  totalInsights,
  healthStatus,
  lastUpdated,
}) => {
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "critical":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "✓";
      case "warning":
        return "⚠";
      case "critical":
        return "✕";
      default:
        return "○";
    }
  };

  const emptyRateColor =
    contentEmptyRate > 10 ? "text-red-600" : "text-green-600";
  const feedbackPercentage =
    totalInsights > 0 ? ((feedbackCount / totalInsights) * 100).toFixed(1) : "0";

  return (
    <div className={`w-full p-6 border rounded-lg ${getStatusColor(healthStatus)}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Insight Health Monitor
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Real-time pipeline health and content quality metrics
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full font-semibold ${getStatusBadgeColor(healthStatus)}`}>
            <span className="mr-2">{getStatusIcon(healthStatus)}</span>
            {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Total Insights</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {totalInsights}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Empty Content Rate</p>
            <p className={`text-3xl font-bold mt-2 ${emptyRateColor}`}>
              {contentEmptyRate.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Feedback Count</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {feedbackCount}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-gray-600 text-sm font-medium">Feedback Rate</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {feedbackPercentage}%
            </p>
          </div>
        </div>

        {/* Insight Types Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Insight Types Performance
          </h2>
          <div className="space-y-3">
            {insightTypes.length > 0 ? (
              insightTypes.map((insight, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900">
                        {insight.name}
                      </p>
                      <span className="text-xs text-gray-600">
                        {insight.count} insights
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Quality</span>
                          <span className="text-gray-900 font-medium">
                            {insight.quality}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${insight.quality}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Feedback</span>
                          <span className="text-gray-900 font-medium">
                            {insight.feedbackRate}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${insight.feedbackRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No insight types configured
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        {lastUpdated && (
          <div className="flex justify-end pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightHealthMonitor;
