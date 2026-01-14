import React from "react";

interface EntityHealth {
  score: number;
  status: "healthy" | "warning" | "critical";
}

interface EntityHealthScores {
  customerEngagement?: EntityHealth;
  orderVolume?: EntityHealth;
  campaignPerformance?: EntityHealth;
}

interface DailyDigestHealthCardProps {
  date: string;
  totalInsights: number;
  entityHealthScores: EntityHealthScores;
  contentGapCount: number;
  feedbackCount: number;
  onDrillDown?: (entity: string) => void;
}

const DailyDigestHealthCard: React.FC<DailyDigestHealthCardProps> = ({
  date,
  totalInsights,
  entityHealthScores,
  contentGapCount,
  feedbackCount,
  onDrillDown,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-50 border-green-200 text-green-700";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "critical":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return "✓";
      case "warning":
        return "⚠";
      case "critical":
        return "✕";
      default:
        return "◯";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Daily Digest Health Report</h2>
        <p className="text-sm text-gray-600 mt-1">{date}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm font-semibold text-blue-900 mb-2">Total Insights</div>
          <div className="text-3xl font-bold text-blue-700">{totalInsights}</div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="text-sm font-semibold text-purple-900 mb-2">Content Gaps</div>
          <div className="text-3xl font-bold text-purple-700">{contentGapCount}</div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="text-sm font-semibold text-indigo-900 mb-2">Feedback Items</div>
          <div className="text-3xl font-bold text-indigo-700">{feedbackCount}</div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ontology Entity Health</h3>

        <div className="space-y-3">
          {entityHealthScores.customerEngagement && (
            <button
              onClick={() => onDrillDown?.("customerEngagement")}
              className={`w-full text-left p-4 border rounded-lg transition-all hover:shadow-md ${getStatusColor(
                entityHealthScores.customerEngagement.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getStatusIcon(entityHealthScores.customerEngagement.status)}</span>
                  <span className="font-semibold">Customer Engagement</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{entityHealthScores.customerEngagement.score}%</div>
                  <div className="text-xs opacity-75">Health Score</div>
                </div>
              </div>
            </button>
          )}

          {entityHealthScores.orderVolume && (
            <button
              onClick={() => onDrillDown?.("orderVolume")}
              className={`w-full text-left p-4 border rounded-lg transition-all hover:shadow-md ${getStatusColor(
                entityHealthScores.orderVolume.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getStatusIcon(entityHealthScores.orderVolume.status)}</span>
                  <span className="font-semibold">Order Volume</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{entityHealthScores.orderVolume.score}%</div>
                  <div className="text-xs opacity-75">Health Score</div>
                </div>
              </div>
            </button>
          )}

          {entityHealthScores.campaignPerformance && (
            <button
              onClick={() => onDrillDown?.("campaignPerformance")}
              className={`w-full text-left p-4 border rounded-lg transition-all hover:shadow-md ${getStatusColor(
                entityHealthScores.campaignPerformance.status
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getStatusIcon(entityHealthScores.campaignPerformance.status)}</span>
                  <span className="font-semibold">Campaign Performance</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{entityHealthScores.campaignPerformance.score}%</div>
                  <div className="text-xs opacity-75">Health Score</div>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyDigestHealthCard;
