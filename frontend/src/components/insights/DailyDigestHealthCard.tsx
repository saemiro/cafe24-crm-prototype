import React from "react";

interface InsightTypeDistribution {
  [key: string]: number;
}

interface Alert {
  type: string;
  message: string;
  severity: "low" | "medium" | "high";
}

interface DailyDigestHealthCardProps {
  totalInsights: number;
  insightTypeDistribution: InsightTypeDistribution;
  contentCompleteness: number;
  feedbackCount: number;
  date: string;
  healthScore: number;
  alerts?: Alert[];
}

const DailyDigestHealthCard: React.FC<DailyDigestHealthCardProps> = ({
  totalInsights,
  insightTypeDistribution,
  contentCompleteness,
  feedbackCount,
  date,
  healthScore,
  alerts = [],
}) => {
  const getHealthColor = (score: number): string => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getHealthTextColor = (score: number): string => {
    if (score >= 80) return "text-green-700";
    if (score >= 60) return "text-yellow-700";
    return "text-red-700";
  };

  const getScoreBadgeColor = (score: number): string => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const diversityScore = Object.keys(insightTypeDistribution).length;
  const maxConcentration = Math.max(
    ...Object.values(insightTypeDistribution),
    0
  );
  const concentrationPercentage =
    totalInsights > 0 ? (maxConcentration / totalInsights) * 100 : 0;

  const hasSingleTypeConcentration = concentrationPercentage > 70;
  const hasZeroFeedback = feedbackCount === 0;
  const hasLowCompleteness = contentCompleteness < 50;
  const hasNoContent = totalInsights === 0;

  return (
    <div
      className={`rounded-lg border-2 p-6 ${getHealthColor(healthScore)} transition-all duration-300`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Daily Digest Health
          </h2>
          <p className="text-sm text-gray-600">{date}</p>
        </div>
        <div
          className={`rounded-full px-4 py-2 text-lg font-bold ${getScoreBadgeColor(healthScore)}`}
        >
          {healthScore}%
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Total Insights</p>
          <p className={`text-2xl font-bold ${getHealthTextColor(healthScore)}`}>
            {totalInsights}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4">
          <p className="text-xs font-medium text-gray-500">
            Type Diversity
          </p>
          <p className={`text-2xl font-bold ${getHealthTextColor(healthScore)}`}>
            {diversityScore}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Completeness</p>
          <p className={`text-2xl font-bold ${getHealthTextColor(healthScore)}`}>
            {contentCompleteness}%
          </p>
        </div>
        <div className="rounded-lg bg-white p-4">
          <p className="text-xs font-medium text-gray-500">Feedback</p>
          <p className={`text-2xl font-bold ${getHealthTextColor(healthScore)}`}>
            {feedbackCount}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold text-gray-700">
          Insight Type Distribution
        </p>
        <div className="space-y-2">
          {Object.entries(insightTypeDistribution).length > 0 ? (
            Object.entries(insightTypeDistribution).map(([type, count]) => {
              const percentage =
                totalInsights > 0 ? (count / totalInsights) * 100 : 0;
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 rounded-full bg-gray-200">
                      <div
                        className="rounded-full bg-blue-500 py-1 text-center text-xs font-bold text-white transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 10 && `${percentage.toFixed(0)}%`}
                      </div>
                    </div>
                    <span className="w-12 text-right text-sm font-medium text-gray-600">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-gray-500">No distribution data</p>
          )}
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="mb-4 space-y-2 rounded-lg bg-white p-4">
          <p className="text-sm font-semibold text-gray-700">⚠️ Alerts</p>
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`rounded px-3 py-2 text-sm ${
                alert.severity === "high"
                  ? "bg-red-100 text-red-800"
                  : alert.severity === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {alert.message}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-gray-700">
          ⚡ Auto-Detected Issues
        </p>
        <div className="space-y-2">
          {hasNoContent && (
            <div className="flex items-start gap-2 text-sm text-red-700">
              <span>🔴</span>
              <span>No content detected</span>
            </div>
          )}
          {hasSingleTypeConcentration && (
            <div className="flex items-start gap-2 text-sm text-orange-700">
              <span>🟠</span>
              <span>
                Single insight type concentration ({concentrationPercentage.toFixed(0)}%)
              </span>
            </div>
          )}
          {hasLowCompleteness && (
            <div className="flex items-start gap-2 text-sm text-yellow-700">
              <span>🟡</span>
              <span>Low content completeness</span>
            </div>
          )}
          {hasZeroFeedback && (
            <div className="flex items-start gap-2 text-sm text-blue-700">
              <span>🔵</span>
              <span>No feedback received</span>
            </div>
          )}
          {!hasNoContent &&
            !hasSingleTypeConcentration &&
            !hasLowCompleteness &&
            !hasZeroFeedback && (
              <div className="flex items-start gap-2 text-sm text-green-700">
                <span>✓</span>
                <span>All systems healthy</span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DailyDigestHealthCard;
