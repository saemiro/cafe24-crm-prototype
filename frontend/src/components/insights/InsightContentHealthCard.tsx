import React from "react";

interface InsightTypeDistribution {
  [key: string]: number;
}

interface InsightContentHealthCardProps {
  totalInsights: number;
  emptyContentCount: number;
  feedbackCount: number;
  insightTypeDistribution: InsightTypeDistribution;
  timeRange?: string;
}

const InsightContentHealthCard: React.FC<InsightContentHealthCardProps> = ({
  totalInsights,
  emptyContentCount,
  feedbackCount,
  insightTypeDistribution,
  timeRange = "Last 30 days",
}) => {
  const contentCompletionRate =
    totalInsights > 0
      ? Math.round(((totalInsights - emptyContentCount) / totalInsights) * 100)
      : 0;

  const feedbackCollectionRate =
    totalInsights > 0
      ? Math.round((feedbackCount / totalInsights) * 100)
      : 0;

  const insightTypes = Object.keys(insightTypeDistribution).length;
  const maxTypeCount = Math.max(
    ...Object.values(insightTypeDistribution),
    1
  );
  const diversityScore = Math.round(
    (insightTypes / Math.max(insightTypes, 5)) * 100
  );

  const getHealthStatus = (rate: number): string => {
    if (rate >= 80) return "Excellent";
    if (rate >= 60) return "Good";
    if (rate >= 40) return "Fair";
    return "Poor";
  };

  const getHealthColor = (rate: number): string => {
    if (rate >= 80) return "bg-green-100 border-green-300";
    if (rate >= 60) return "bg-blue-100 border-blue-300";
    if (rate >= 40) return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300";
  };

  const getStatusIcon = (rate: number): string => {
    if (rate >= 80) return "✓";
    if (rate >= 60) return "◐";
    if (rate >= 40) return "△";
    return "✕";
  };

  const getStatusColor = (rate: number): string => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-blue-600";
    if (rate >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Insight Content Health
        </h2>
        <span className="text-sm text-gray-500">{timeRange}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={`rounded-lg border-2 p-4 ${getHealthColor(contentCompletionRate)}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Content Completion</p>
              <p className="text-3xl font-bold text-gray-800">
                {contentCompletionRate}%
              </p>
            </div>
            <span className={`text-3xl font-bold ${getStatusColor(contentCompletionRate)}`}>
              {getStatusIcon(contentCompletionRate)}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {totalInsights - emptyContentCount} of {totalInsights} insights with content
          </p>
          <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                contentCompletionRate >= 80
                  ? "bg-green-500"
                  : contentCompletionRate >= 60
                    ? "bg-blue-500"
                    : contentCompletionRate >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
              }`}
              style={{ width: `${contentCompletionRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {getHealthStatus(contentCompletionRate)}
          </p>
        </div>

        <div className={`rounded-lg border-2 p-4 ${getHealthColor(feedbackCollectionRate)}`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Feedback Collection</p>
              <p className="text-3xl font-bold text-gray-800">
                {feedbackCollectionRate}%
              </p>
            </div>
            <span className={`text-3xl font-bold ${getStatusColor(feedbackCollectionRate)}`}>
              {getStatusIcon(feedbackCollectionRate)}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {feedbackCount} of {totalInsights} insights with feedback
          </p>
          <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                feedbackCollectionRate >= 80
                  ? "bg-green-500"
                  : feedbackCollectionRate >= 60
                    ? "bg-blue-500"
                    : feedbackCollectionRate >= 40
                      ? "bg-yellow-500"
                      : "bg-red-500"
              }`}
              style={{ width: `${feedbackCollectionRate}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {getHealthStatus(feedbackCollectionRate)}
          </p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">
          Insight Type Diversity
        </h3>
        <div className="space-y-3">
          {Object.entries(insightTypeDistribution).map(([type, count]) => {
            const percentage = Math.round((count / totalInsights) * 100);
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{type}</span>
                  <span className="text-sm font-medium text-gray-600">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all"
                    style={{
                      width: `${(count / maxTypeCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className={`rounded-lg border-2 p-4 mt-4 ${getHealthColor(diversityScore)}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Diversity Score</p>
              <p className="text-2xl font-bold text-gray-800">{diversityScore}%</p>
            </div>
            <span className={`text-2xl font-bold ${getStatusColor(diversityScore)}`}>
              {getStatusIcon(diversityScore)}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {insightTypes} type{insightTypes !== 1 ? "s" : ""} detected
          </p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Health Summary</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            • Content is {contentCompletionRate >= 80 ? "well" : contentCompletionRate >= 60 ? "adequately" : contentCompletionRate >= 40 ? "partially" : "poorly"} completed
          </p>
          <p>
            • Feedback collection is {feedbackCollectionRate >= 80 ? "excellent" : feedbackCollectionRate >= 60 ? "good" : feedbackCollectionRate >= 40 ? "moderate" : "low"}
          </p>
          <p>
            • Type diversity is {diversityScore >= 80 ? "well" : diversityScore >= 60 ? "moderately" : "under"} distributed
          </p>
          <p>
            • Overall data quality: {(contentCompletionRate + feedbackCollectionRate + diversityScore) / 3 >= 80 ? "Excellent" : (contentCompletionRate + feedbackCollectionRate + diversityScore) / 3 >= 60 ? "Good" : (contentCompletionRate + feedbackCollectionRate + diversityScore) / 3 >= 40 ? "Fair" : "Poor"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightContentHealthCard;
