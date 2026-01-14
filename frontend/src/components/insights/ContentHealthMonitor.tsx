import React from "react";

interface InsightType {
  name: string;
  count: number;
}

interface ContentHealthMonitorProps {
  totalInsights: number;
  insightTypes: InsightType[];
  contentCompletionRate: number;
  feedbackCollectionRate: number;
  emptyContentCount: number;
  lastUpdated: string;
  alertThreshold?: number;
}

const ContentHealthMonitor: React.FC<ContentHealthMonitorProps> = ({
  totalInsights,
  insightTypes,
  contentCompletionRate,
  feedbackCollectionRate,
  emptyContentCount,
  lastUpdated,
  alertThreshold = 80,
}) => {
  const getTrendIndicator = (value: number): string => {
    if (value >= alertThreshold) return "↑";
    if (value >= alertThreshold - 10) return "→";
    return "↓";
  };

  const getTrendColor = (value: number): string => {
    if (value >= alertThreshold) return "text-green-600";
    if (value >= alertThreshold - 10) return "text-yellow-600";
    return "text-red-600";
  };

  const getBarColor = (value: number): string => {
    if (value >= alertThreshold) return "bg-green-500";
    if (value >= alertThreshold - 10) return "bg-yellow-500";
    return "bg-red-500";
  };

  const emptyContentRate = totalInsights > 0 ? (emptyContentCount / totalInsights) * 100 : 0;
  const healthScore = (contentCompletionRate + feedbackCollectionRate) / 2;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Content Health Monitor</h1>
        <div className="text-sm text-gray-500">Last updated: {lastUpdated}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Total Insights</h2>
            <span className="text-3xl font-bold text-blue-600">{totalInsights}</span>
          </div>
          <div className="text-sm text-gray-600">Insight content generated</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-700">Overall Health</h2>
            <span className={`text-3xl font-bold ${getTrendColor(healthScore)}`}>
              {healthScore.toFixed(1)}%
            </span>
          </div>
          <div className="text-sm text-gray-600">Pipeline health score</div>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Content Completion Rate</h3>
            <span className={`font-semibold ${getTrendColor(contentCompletionRate)}`}>
              {contentCompletionRate.toFixed(1)}% {getTrendIndicator(contentCompletionRate)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getBarColor(contentCompletionRate)} transition-all duration-300`}
              style={{ width: `${contentCompletionRate}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Feedback Collection Rate</h3>
            <span className={`font-semibold ${getTrendColor(feedbackCollectionRate)}`}>
              {feedbackCollectionRate.toFixed(1)}% {getTrendIndicator(feedbackCollectionRate)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full ${getBarColor(feedbackCollectionRate)} transition-all duration-300`}
              style={{ width: `${feedbackCollectionRate}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700">Empty Content Rate</h3>
            <span className={`font-semibold ${getTrendColor(100 - emptyContentRate)}`}>
              {emptyContentRate.toFixed(1)}% {getTrendIndicator(100 - emptyContentRate)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${emptyContentRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Type Distribution</h3>
        <div className="space-y-3">
          {insightTypes.length > 0 ? (
            insightTypes.map((type, index) => {
              const percentage = totalInsights > 0 ? (type.count / totalInsights) * 100 : 0;
              return (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-32">{type.name}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-16 text-right">
                    {type.count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-sm text-gray-500">No insight types available</div>
          )}
        </div>
      </div>

      {emptyContentRate > alertThreshold - 80 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-yellow-800">Content Quality Alert</h4>
              <p className="text-sm text-yellow-700 mt-1">
                {emptyContentCount} insights have empty content. Review and complete missing content to maintain health standards.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentHealthMonitor;
