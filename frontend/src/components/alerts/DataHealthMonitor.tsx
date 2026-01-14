import React from "react";

interface Entity {
  name: string;
  completeness: number;
  freshness: number;
  quality: number;
  lastUpdated: string;
  recordCount: number;
}

interface DataHealthMonitorProps {
  entities: Entity[];
  timeWindow?: string;
  alertThreshold?: number;
  onEntityClick?: (entity: Entity) => void;
}

const DataHealthMonitor: React.FC<DataHealthMonitorProps> = ({
  entities,
  timeWindow = "24h",
  alertThreshold = 70,
  onEntityClick,
}) => {
  const getHealthStatus = (
    completeness: number,
    freshness: number,
    quality: number
  ): string => {
    const average = (completeness + freshness + quality) / 3;
    if (average >= alertThreshold) return "healthy";
    if (average >= alertThreshold - 20) return "warning";
    return "critical";
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "healthy":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "critical":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusIndicator = (status: string): string => {
    switch (status) {
      case "healthy":
        return "🟢";
      case "warning":
        return "🟡";
      case "critical":
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getAlertIcon = (value: number, threshold: number): string => {
    if (value < threshold) return "⚠️";
    return "✓";
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg shadow">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Data Health Monitor
        </h1>
        <p className="text-gray-600">
          Time Window: <span className="font-semibold">{timeWindow}</span> |
          Alert Threshold: <span className="font-semibold">{alertThreshold}%</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {entities.map((entity) => {
          const status = getHealthStatus(
            entity.completeness,
            entity.freshness,
            entity.quality
          );
          const average =
            (entity.completeness + entity.freshness + entity.quality) / 3;

          return (
            <div
              key={entity.name}
              onClick={() => onEntityClick?.(entity)}
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${getStatusColor(
                status
              )}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getStatusIndicator(status)}</span>
                  <h2 className="text-xl font-bold text-gray-900">
                    {entity.name}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(average)}%
                  </p>
                  <p className="text-sm text-gray-600">Overall Health</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-gray-700">
                      Completeness
                    </label>
                    <span className="text-sm text-gray-600">
                      {getAlertIcon(entity.completeness, alertThreshold)}{" "}
                      {entity.completeness}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${entity.completeness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-gray-700">
                      Freshness
                    </label>
                    <span className="text-sm text-gray-600">
                      {getAlertIcon(entity.freshness, alertThreshold)}{" "}
                      {entity.freshness}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{ width: `${entity.freshness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-gray-700">
                      Quality
                    </label>
                    <span className="text-sm text-gray-600">
                      {getAlertIcon(entity.quality, alertThreshold)}{" "}
                      {entity.quality}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all"
                      style={{ width: `${entity.quality}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-300 flex justify-between text-sm text-gray-600">
                <div>
                  <p className="font-semibold">Records: {entity.recordCount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs">Last Updated</p>
                  <p className="font-semibold">{entity.lastUpdated}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {entities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No entities to monitor</p>
        </div>
      )}
    </div>
  );
};

export default DataHealthMonitor;
