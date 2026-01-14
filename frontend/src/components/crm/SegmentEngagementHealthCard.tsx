import React from "react";

interface SegmentEngagementHealthCardProps {
  segmentId: string;
  segmentName: string;
  feedbackCount: number;
  engagementScore: number;
  trendDirection: string;
  customerCount: number;
  lastActivityDate?: string;
}

const SegmentEngagementHealthCard: React.FC<SegmentEngagementHealthCardProps> = ({
  segmentId,
  segmentName,
  feedbackCount,
  engagementScore,
  trendDirection,
  customerCount,
  lastActivityDate,
}) => {
  const getEngagementColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getEngagementBgColor = (score: number): string => {
    if (score >= 80) return "bg-green-50";
    if (score >= 60) return "bg-yellow-50";
    if (score >= 40) return "bg-orange-50";
    return "bg-red-50";
  };

  const getTrendIcon = (direction: string): string => {
    if (direction === "up") return "↑";
    if (direction === "down") return "↓";
    return "→";
  };

  const getTrendColor = (direction: string): string => {
    if (direction === "up") return "text-green-600";
    if (direction === "down") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className={`rounded-lg border border-gray-200 p-6 shadow-sm ${getEngagementBgColor(engagementScore)}`}>
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{segmentName}</h3>
            <p className="text-sm text-gray-500">ID: {segmentId}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getEngagementBgColor(engagementScore)}`}>
            <span className={`text-2xl font-bold ${getEngagementColor(engagementScore)}`}>
              {engagementScore}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-md bg-white p-3">
          <p className="text-xs font-medium text-gray-600">Feedback Volume</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{feedbackCount}</p>
        </div>
        <div className="rounded-md bg-white p-3">
          <p className="text-xs font-medium text-gray-600">Active Customers</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{customerCount}</p>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-md bg-white p-3 mb-4">
        <div>
          <p className="text-xs font-medium text-gray-600">Engagement Trend</p>
          <p className="mt-1 text-sm text-gray-900">
            {trendDirection === "up" && "Increasing"}
            {trendDirection === "down" && "Decreasing"}
            {trendDirection !== "up" && trendDirection !== "down" && "Stable"}
          </p>
        </div>
        <span className={`text-3xl font-bold ${getTrendColor(trendDirection)}`}>
          {getTrendIcon(trendDirection)}
        </span>
      </div>

      {lastActivityDate && (
        <div className="rounded-md bg-white p-3">
          <p className="text-xs font-medium text-gray-600">Last Activity</p>
          <p className="mt-1 text-sm text-gray-900">{lastActivityDate}</p>
        </div>
      )}

      {engagementScore < 50 && (
        <div className="mt-4 rounded-md bg-red-100 p-3">
          <p className="text-sm font-medium text-red-800">
            ⚠️ Low engagement detected. Re-activation campaign recommended.
          </p>
        </div>
      )}
    </div>
  );
};

export default SegmentEngagementHealthCard;
