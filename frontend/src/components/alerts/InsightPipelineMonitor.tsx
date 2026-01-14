import React from "react";

interface TypeDistributionItem {
  type: string;
  count: number;
}

interface InsightPipelineMonitorProps {
  totalInsights: number;
  emptyContentCount: number;
  typeDistribution: TypeDistributionItem[];
  pipelineStatus: string;
  lastSuccessfulSync?: string;
}

const InsightPipelineMonitor: React.FC<InsightPipelineMonitorProps> = ({
  totalInsights,
  emptyContentCount,
  typeDistribution,
  pipelineStatus,
  lastSuccessfulSync,
}) => {
  const completenessRate = totalInsights > 0
    ? ((totalInsights - emptyContentCount) / totalInsights * 100).toFixed(1)
    : 0;

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
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
      case "error":
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
      case "error":
        return "✕";
      default:
        return "○";
    }
  };

  const maxTypeCount = typeDistribution.length > 0
    ? Math.max(...typeDistribution.map((item) => item.count))
    : 1;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Insight Pipeline Monitor
        </h1>
        <p className="text-gray-600">Real-time data pipeline health metrics</p>
      </div>

      <div
        className={`border rounded-lg p-4 mb-6 ${getStatusColor(pipelineStatus)}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`text-2xl w-10 h-10 rounded-full flex items-center justify-center font-bold ${getStatusBadgeColor(pipelineStatus)}`}
            >
              {getStatusIcon(pipelineStatus)}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Pipeline Status
              </h2>
              <p className={`text-sm font-medium ${getStatusBadgeColor(pipelineStatus)}`}>
                {pipelineStatus.charAt(0).toUpperCase() + pipelineStatus.slice(1)}
              </p>
            </div>
          </div>
          {lastSuccessfulSync && (
            <div className="text-right">
              <p className="text-xs text-gray-600">Last sync</p>
              <p className="text-sm font-medium text-gray-800">
                {lastSuccessfulSync}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-700 text-sm font-medium">Total Insights</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {totalInsights.toLocaleString()}
              </p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-700 text-sm font-medium">
                Content Completeness
              </p>
              <p className="text-3xl font-bold text-purple-900 mt-2">
                {completenessRate}%
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {emptyContentCount} empty
              </p>
            </div>
            <span className="text-3xl">✓</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-700 text-sm font-medium">
                Type Variants
              </p>
              <p className="text-3xl font-bold text-orange-900 mt-2">
                {typeDistribution.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {typeDistribution.length === 1 ? "type" : "types"} detected
              </p>
            </div>
            <span className="text-3xl">🏷</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Type Distribution
        </h3>
        {typeDistribution.length > 0 ? (
          <div className="space-y-4">
            {typeDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {item.type}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.count} ({((item.count / totalInsights) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(item.count / maxTypeCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No type distribution data available</p>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-600">Feed Quality</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {completenessRate > 90 ? "Excellent" : completenessRate > 70 ? "Good" : "Fair"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Processing Rate</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">→</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Alert Status</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {pipelineStatus.toLowerCase() === "error" ? "⚠ Active" : "✓ Clear"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Sync Status</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
              {lastSuccessfulSync ? "✓ OK" : "○ Pending"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightPipelineMonitor;
