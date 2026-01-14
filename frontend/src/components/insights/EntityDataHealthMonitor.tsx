import React from "react";

interface Entity {
  id: string;
  name: string;
  recordCount: number;
  lastUpdate: Date;
  missingFieldPercentage: number;
  dataQualityScore: number;
  recordCountChange?: number;
}

interface EntityDataHealthMonitorProps {
  entities: Entity[];
  timeRange?: string;
  alertThreshold?: number;
  onEntityClick?: (entityId: string) => void;
}

const EntityDataHealthMonitor: React.FC<EntityDataHealthMonitorProps> = ({
  entities,
  timeRange = "24h",
  alertThreshold = 70,
  onEntityClick,
}) => {
  const getHealthStatus = (score: number): string => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Fair";
    return "Poor";
  };

  const getStatusColor = (score: number): string => {
    if (score >= 90) return "bg-green-50 border-green-200";
    if (score >= 75) return "bg-blue-50 border-blue-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getScoreBarColor = (score: number): string => {
    if (score >= 90) return "bg-green-500";
    if (score >= 75) return "bg-blue-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getChangeIndicator = (change?: number): React.ReactNode => {
    if (!change) return null;
    if (change > 0) return <span className="text-green-600">↑ +{change}</span>;
    if (change < 0) return <span className="text-red-600">↓ {change}</span>;
    return null;
  };

  const sortedEntities = [...entities].sort(
    (a, b) => b.dataQualityScore - a.dataQualityScore
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Data Health Monitor
        </h1>
        <p className="text-gray-600">
          Real-time visualization of data completeness and freshness • Time
          Range: {timeRange}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedEntities.map((entity) => {
          const isAlert =
            entity.dataQualityScore < alertThreshold &&
            alertThreshold !== undefined;

          return (
            <div
              key={entity.id}
              onClick={() => onEntityClick?.(entity.id)}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${getStatusColor(entity.dataQualityScore)} ${isAlert ? "border-red-400 ring-2 ring-red-200" : "border-gray-200"}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {entity.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getHealthStatus(entity.dataQualityScore)}
                    {isAlert && " ⚠️"}
                  </p>
                </div>
                <span className="text-2xl">
                  {entity.dataQualityScore >= 90
                    ? "✓"
                    : entity.dataQualityScore >= 75
                      ? "◐"
                      : "✕"}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Quality Score
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {entity.dataQualityScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getScoreBarColor(entity.dataQualityScore)}`}
                      style={{ width: `${entity.dataQualityScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Records</p>
                    <p className="font-semibold text-gray-900">
                      {entity.recordCount.toLocaleString()}
                    </p>
                    {getChangeIndicator(entity.recordCountChange)}
                  </div>
                  <div>
                    <p className="text-gray-600">Missing Fields</p>
                    <p className="font-semibold text-gray-900">
                      {entity.missingFieldPercentage}%
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-600">Last Updated</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatTimestamp(entity.lastUpdate)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedEntities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No entities to display</p>
        </div>
      )}
    </div>
  );
};

export default EntityDataHealthMonitor;
