import React from "react";

interface EngagementMetrics {
  [key: string]: {
    participationRate: number;
    feedbackGap: number;
    lastActivity: string;
    campaignInteractions: number;
    healthScore: number;
  };
}

interface CampaignBreakdown {
  [key: string]: {
    engagementRate: number;
    responseRate: number;
  };
}

interface CustomerEngagementPulseProps {
  segmentId?: string;
  timeRange: string;
  engagementMetrics: EngagementMetrics;
  alertThreshold?: number;
  showCampaignBreakdown?: boolean;
}

const CustomerEngagementPulse: React.FC<CustomerEngagementPulseProps> = ({
  segmentId,
  timeRange,
  engagementMetrics,
  alertThreshold = 40,
  showCampaignBreakdown = false,
}) => {
  const getHealthColor = (score: number): string => {
    if (score >= 75) return "bg-green-100 border-green-500";
    if (score >= 50) return "bg-yellow-100 border-yellow-500";
    return "bg-red-100 border-red-500";
  };

  const getHealthIndicator = (score: number): string => {
    if (score >= 75) return "●";
    if (score >= 50) return "◐";
    return "○";
  };

  const getAlertStatus = (metric: {
    participationRate: number;
    feedbackGap: number;
  }): string => {
    if (metric.participationRate < alertThreshold) return "⚠";
    if (metric.feedbackGap > 30) return "⚠";
    return "✓";
  };

  const segments = Object.entries(engagementMetrics);
  const averageHealthScore =
    segments.length > 0
      ? segments.reduce((sum, [, metric]) => sum + metric.healthScore, 0) /
        segments.length
      : 0;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Customer Engagement Pulse
        </h1>
        <p className="text-gray-600">
          Real-time engagement health monitoring {segmentId && `for ${segmentId}`}{" "}
          • {timeRange}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Overall Health</div>
          <div className="text-3xl font-bold text-blue-600">
            {Math.round(averageHealthScore)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {getHealthIndicator(averageHealthScore)}
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-sm text-gray-600 mb-1">Active Segments</div>
          <div className="text-3xl font-bold text-purple-600">
            {segments.length}
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-sm text-gray-600 mb-1">Alert Threshold</div>
          <div className="text-3xl font-bold text-orange-600">
            {alertThreshold}%
          </div>
        </div>

        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
          <div className="text-sm text-gray-600 mb-1">Critical Alerts</div>
          <div className="text-3xl font-bold text-pink-600">
            {segments.filter(
              ([, metric]) => metric.participationRate < alertThreshold
            ).length}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Segment Health Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {segments.map(([segment, metric]) => (
            <div
              key={segment}
              className={`p-4 rounded-lg border-l-4 ${getHealthColor(
                metric.healthScore
              )}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{segment}</h3>
                  <p className="text-xs text-gray-500">
                    Last activity: {metric.lastActivity}
                  </p>
                </div>
                <div className="text-2xl">
                  {getAlertStatus(metric)}
                  {metric.healthScore >= 75 ? "✓" : "⚠"}
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700">Participation Rate</span>
                    <span
                      className={
                        metric.participationRate < alertThreshold
                          ? "text-red-600 font-semibold"
                          : "text-gray-600"
                      }
                    >
                      {metric.participationRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${metric.participationRate}%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700">Health Score</span>
                    <span className="text-gray-600">
                      {Math.round(metric.healthScore)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        metric.healthScore >= 75
                          ? "bg-green-500"
                          : metric.healthScore >= 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${metric.healthScore}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-600 pt-1">
                  <span>Feedback Gap: {metric.feedbackGap}%</span>
                  <span>
                    Campaigns: {metric.campaignInteractions} interactions
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCampaignBreakdown && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Campaign Interaction Breakdown
          </h2>
          <div className="space-y-2">
            {segments.map(([segment, metric]) => (
              <div key={`campaign-${segment}`} className="text-sm">
                <div className="font-medium text-gray-700 mb-1">{segment}</div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                    {metric.campaignInteractions}
                  </div>
                  <span className="text-gray-600">
                    active campaign interactions
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-600">
          <div>
            <div className="text-lg mb-1">✓</div>
            <div>Healthy</div>
          </div>
          <div>
            <div className="text-lg mb-1">◐</div>
            <div>At Risk</div>
          </div>
          <div>
            <div className="text-lg mb-1">⚠</div>
            <div>Critical</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerEngagementPulse;
