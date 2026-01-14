import React from "react";

interface PipelineMetric {
  name: string;
  value: number;
  status: "healthy" | "warning" | "critical";
}

interface DataPipelineHealthCardProps {
  pipelineMetrics: PipelineMetric[];
  contentCompletionRate: number;
  feedbackCollectionRate: number;
  alertThreshold?: number;
  timeRange?: string;
}

const DataPipelineHealthCard: React.FC<DataPipelineHealthCardProps> = ({
  pipelineMetrics,
  contentCompletionRate,
  feedbackCollectionRate,
  alertThreshold = 75,
  timeRange = "Last 24 hours",
}) => {
  const getStatusColor = (
    status: "healthy" | "warning" | "critical"
  ): string => {
    switch (status) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
    }
  };

  const getStatusBadge = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return "✓";
      case "warning":
        return "⚠";
      case "critical":
        return "✕";
    }
  };

  const getTrendIndicator = (currentRate: number): string => {
    if (currentRate >= alertThreshold) return "↑";
    if (currentRate >= alertThreshold - 10) return "→";
    return "↓";
  };

  const alertCount = pipelineMetrics.filter(
    (m) => m.status !== "healthy"
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Data Pipeline Health
          </h2>
          <p className="text-sm text-gray-600 mt-1">{timeRange}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            alertCount === 0
              ? "bg-green-100 text-green-800"
              : alertCount <= 2
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {alertCount === 0 ? "✓ All Systems Nominal" : `⚠ ${alertCount} Alert${alertCount !== 1 ? "s" : ""}`}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700 font-medium">Content Completion</p>
            <span className="text-lg">{getTrendIndicator(contentCompletionRate)}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {contentCompletionRate}%
          </p>
          <div className="w-full bg-gray-300 rounded-full h-2 mt-3">
            <div
              className={`h-2 rounded-full transition-all ${
                contentCompletionRate >= alertThreshold
                  ? "bg-green-500"
                  : contentCompletionRate >= alertThreshold - 10
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${contentCompletionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700 font-medium">Feedback Collection</p>
            <span className="text-lg">{getTrendIndicator(feedbackCollectionRate)}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {feedbackCollectionRate}%
          </p>
          <div className="w-full bg-gray-300 rounded-full h-2 mt-3">
            <div
              className={`h-2 rounded-full transition-all ${
                feedbackCollectionRate >= alertThreshold
                  ? "bg-green-500"
                  : feedbackCollectionRate >= alertThreshold - 10
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${feedbackCollectionRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pipeline Status
        </h3>
        <div className="space-y-3">
          {pipelineMetrics.map((metric, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${getStatusColor(metric.status)}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{getStatusBadge(metric.status)}</span>
                <div>
                  <p className="font-medium">{metric.name}</p>
                </div>
              </div>
              <p className="text-lg font-bold">{metric.value}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-900">
          ℹ Alert threshold set to {alertThreshold}%. Adjust pipeline
          configurations to maintain optimal data quality.
        </p>
      </div>
    </div>
  );
};

export default DataPipelineHealthCard;
