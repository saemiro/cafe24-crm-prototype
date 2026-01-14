import React from "react";

interface InsightType {
  name: string;
  count: number;
  completenessRate: number;
  missingDataCount: number;
  lastUpdated: string;
}

interface DataQualityMonitorProps {
  totalInsights: number;
  emptyContentCount: number;
  feedbackCount: number;
  insightTypes: InsightType[];
  lastUpdateTime: string;
  healthScore?: number;
}

const DataQualityMonitor: React.FC<DataQualityMonitorProps> = ({
  totalInsights,
  emptyContentCount,
  feedbackCount,
  insightTypes,
  lastUpdateTime,
  healthScore = 0,
}) => {
  const completenessRate =
    totalInsights > 0
      ? Math.round(((totalInsights - emptyContentCount) / totalInsights) * 100)
      : 0;

  const getHealthStatus = (score: number) => {
    if (score >= 85) return { text: "Healthy", color: "text-green-600", bg: "bg-green-50" };
    if (score >= 70) return { text: "Fair", color: "text-yellow-600", bg: "bg-yellow-50" };
    return { text: "Poor", color: "text-red-600", bg: "bg-red-50" };
  };

  const health = getHealthStatus(healthScore);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString();
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Data Quality Monitor</h1>
          <p className="text-gray-600">Real-time pipeline health dashboard</p>
        </div>

        {/* Health Score Card */}
        <div className={`${health.bg} rounded-lg p-6 mb-8 border-l-4 ${health.color.replace("text", "border")}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-semibold">SYSTEM HEALTH</p>
              <p className={`${health.color} text-3xl font-bold mt-2`}>{healthScore.toFixed(1)}%</p>
              <p className={`${health.color} font-semibold mt-1`}>{health.text}</p>
            </div>
            <div className="text-5xl opacity-50">{healthScore >= 85 ? "✓" : healthScore >= 70 ? "⚠" : "✕"}</div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Insights */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm font-semibold mb-2">TOTAL INSIGHTS</p>
            <p className="text-3xl font-bold text-gray-900">{totalInsights.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-3">Active insights in pipeline</p>
          </div>

          {/* Completeness Rate */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm font-semibold mb-2">COMPLETENESS RATE</p>
            <p className="text-3xl font-bold text-gray-900">{completenessRate}%</p>
            <p className="text-gray-500 text-xs mt-3">{emptyContentCount} insights with missing content</p>
          </div>

          {/* Missing Data */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm font-semibold mb-2">MISSING DATA ALERTS</p>
            <p className="text-3xl font-bold text-orange-600">{emptyContentCount}</p>
            <p className="text-gray-500 text-xs mt-3">Require immediate attention</p>
          </div>

          {/* Feedback Metrics */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 text-sm font-semibold mb-2">FEEDBACK COLLECTED</p>
            <p className="text-3xl font-bold text-blue-600">{feedbackCount}</p>
            <p className="text-gray-500 text-xs mt-3">User submissions received</p>
          </div>
        </div>

        {/* Data Freshness */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📊 Data Freshness</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Last Update</p>
              <p className="text-xl font-mono text-gray-900">{formatTime(lastUpdateTime)}</p>
            </div>
            <div className="text-4xl">🕐</div>
          </div>
        </div>

        {/* Insight Types Breakdown */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">📈 Insight Types</h2>
          </div>

          {insightTypes.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {insightTypes.map((insight, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">{insight.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">Total: {insight.count}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{insight.completenessRate}%</p>
                      <p className="text-xs text-gray-500">Complete</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${insight.completenessRate}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Missing: {insight.missingDataCount}</span>
                    <span>Updated: {formatTime(insight.lastUpdated)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <p className="text-base">No insight types to display</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Dashboard auto-refreshes in real-time • Last updated {formatTime(lastUpdateTime)}</p>
        </div>
      </div>
    </div>
  );
};

export default DataQualityMonitor;
