import React from "react";

interface Segment {
  id: string;
  name: string;
  engagementScore: number;
  orderVelocity: number;
  churnRisk: number;
  campaignResponsiveness: number;
  size: number;
  lastUpdated: string;
}

interface SegmentHealthMonitorProps {
  segments: Segment[];
  timeRange?: string;
  healthThreshold?: number;
  onSegmentClick?: (segment: Segment) => void;
}

const SegmentHealthMonitor: React.FC<SegmentHealthMonitorProps> = ({
  segments,
  timeRange = "30d",
  healthThreshold = 60,
  onSegmentClick,
}) => {
  const getHealthScore = (segment: Segment): number => {
    return (
      (segment.engagementScore * 0.3 +
        segment.orderVelocity * 0.3 +
        (100 - segment.churnRisk) * 0.2 +
        segment.campaignResponsiveness * 0.2) /
      100
    );
  };

  const getHealthStatus = (score: number): string => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  const getHealthColor = (score: number): string => {
    if (score >= 80) return "bg-green-100 border-green-500";
    if (score >= 60) return "bg-blue-100 border-blue-500";
    if (score >= 40) return "bg-yellow-100 border-yellow-500";
    return "bg-red-100 border-red-500";
  };

  const getAlerts = (segment: Segment): string[] => {
    const alerts: string[] = [];
    if (segment.churnRisk > 70) alerts.push("High churn risk");
    if (segment.engagementScore < 40) alerts.push("Low engagement");
    if (segment.orderVelocity < 2) alerts.push("Declining order velocity");
    if (segment.campaignResponsiveness < 30) alerts.push("Poor campaign response");
    return alerts;
  };

  const sortedSegments = [...segments].sort(
    (a, b) => getHealthScore(b) - getHealthScore(a)
  );

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Segment Health Monitor
        </h1>
        <p className="text-gray-600">
          Time Range: {timeRange} | Health Threshold: {healthThreshold}%
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sortedSegments.map((segment) => {
          const healthScore = getHealthScore(segment);
          const status = getHealthStatus(healthScore);
          const alerts = getAlerts(segment);
          const isUnhealthy = healthScore < healthThreshold;

          return (
            <div
              key={segment.id}
              onClick={() => onSegmentClick?.(segment)}
              className={`border-l-4 p-4 rounded-lg cursor-pointer transition-all hover:shadow-lg ${getHealthColor(
                healthScore
              )} ${isUnhealthy ? "ring-2 ring-red-400" : ""}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {segment.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {segment.size.toLocaleString()} customers
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(healthScore)}%
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {status}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    📊 Engagement: {segment.engagementScore}%
                  </span>
                  <div className="w-32 bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${segment.engagementScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    📈 Order Velocity: {segment.orderVelocity.toFixed(1)}x
                  </span>
                  <div className="w-32 bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.min(segment.orderVelocity * 20, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    ⚠️ Churn Risk: {segment.churnRisk}%
                  </span>
                  <div className="w-32 bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${segment.churnRisk}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    🎯 Campaign Response: {segment.campaignResponsiveness}%
                  </span>
                  <div className="w-32 bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${segment.campaignResponsiveness}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {alerts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded p-2">
                  <div className="text-sm font-semibold text-red-800 mb-1">
                    🔔 Alerts:
                  </div>
                  <ul className="text-sm text-red-700 space-y-1">
                    {alerts.map((alert, idx) => (
                      <li key={idx}>• {alert}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-xs text-gray-500 mt-3">
                Last updated: {segment.lastUpdated}
              </div>
            </div>
          );
        })}
      </div>

      {sortedSegments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No segments to display</p>
        </div>
      )}
    </div>
  );
};

export default SegmentHealthMonitor;
