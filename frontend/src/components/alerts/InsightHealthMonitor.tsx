import React from "react";

interface InsightTypeStatus {
  type: string;
  count: number;
  status: "healthy" | "warning" | "critical";
}

interface InsightHealthMonitorProps {
  totalInsights: number;
  emptyContentCount: number;
  feedbackCount: number;
  insightTypeBreakdown: InsightTypeStatus[];
  lastUpdateTime?: string;
  alertThreshold?: number;
}

const InsightHealthMonitor: React.FC<InsightHealthMonitorProps> = ({
  totalInsights,
  emptyContentCount,
  feedbackCount,
  insightTypeBreakdown,
  lastUpdateTime,
  alertThreshold = 0.1,
}) => {
  const contentCompletenessRate = totalInsights > 0 
    ? ((totalInsights - emptyContentCount) / totalInsights) * 100 
    : 0;
  
  const feedbackCollectionRate = totalInsights > 0 
    ? (feedbackCount / totalInsights) * 100 
    : 0;

  const getHealthStatus = (rate: number) => {
    if (rate >= 90) return "healthy";
    if (rate >= 70) return "warning";
    return "critical";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "critical":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return "✓";
      case "warning":
        return "⚠";
      case "critical":
        return "✕";
      default:
        return "•";
    }
  };

  const contentStatus = getHealthStatus(contentCompletenessRate);
  const feedbackStatus = getHealthStatus(feedbackCollectionRate);
  const hasAlerts = emptyContentCount > 0;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Insight Health Monitor
        </h2>
        <p className="text-sm text-gray-500">
          Real-time pipeline status and data quality metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${getStatusColor(contentStatus)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm">Content Completeness</span>
            <span className="text-2xl">{getStatusBadge(contentStatus)}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {contentCompletenessRate.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-600">
              ({totalInsights - emptyContentCount}/{totalInsights})
            </span>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                contentStatus === "healthy"
                  ? "bg-green-600"
                  : contentStatus === "warning"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
              style={{ width: `${Math.min(contentCompletenessRate, 100)}%` }}
            />
          </div>
        </div>

        <div className={`p-4 rounded-lg border ${getStatusColor(feedbackStatus)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm">Feedback Collection Rate</span>
            <span className="text-2xl">{getStatusBadge(feedbackStatus)}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">
              {feedbackCollectionRate.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-600">
              ({feedbackCount}/{totalInsights})
            </span>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                feedbackStatus === "healthy"
                  ? "bg-green-600"
                  : feedbackStatus === "warning"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
              style={{ width: `${Math.min(feedbackCollectionRate, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {hasAlerts && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠</span>
            <div>
              <h3 className="font-semibold text-red-900">Empty Content Alerts</h3>
              <p className="text-sm text-red-700 mt-1">
                {emptyContentCount} insights with empty content detected
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="font-semibold text-gray-700 mb-3">Pipeline Status by Type</h3>
        <div className="space-y-2">
          {insightTypeBreakdown.map((item) => (
            <div key={item.type} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-lg">{getStatusBadge(item.status)}</span>
                <span className="text-sm font-medium text-gray-700">{item.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  item.status === "healthy"
                    ? "bg-green-100 text-green-700"
                    : item.status === "warning"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {item.count} insights
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Total Insights: <span className="font-semibold">{totalInsights}</span>
        </div>
        {lastUpdateTime && (
          <div className="text-xs text-gray-500">
            Last updated: <span className="font-semibold">{lastUpdateTime}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightHealthMonitor;
