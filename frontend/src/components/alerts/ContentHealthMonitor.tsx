import React from "react";

interface Entity {
  name: string;
  dataFreshness: number;
  successRate: number;
  lastUpdated: string;
  missingInsights: number;
  staleInsights: number;
}

interface ContentHealthMonitorProps {
  entities: Entity[];
  timeWindow?: string;
  alertThreshold?: number;
  onEntityClick?: (entity: Entity) => void;
}

const ContentHealthMonitor: React.FC<ContentHealthMonitorProps> = ({
  entities,
  timeWindow = "24h",
  alertThreshold = 70,
  onEntityClick,
}) => {
  const getStatusColor = (value: number, threshold: number): string => {
    if (value >= threshold) return "bg-green-100 border-green-400 text-green-900";
    if (value >= threshold * 0.7)
      return "bg-yellow-100 border-yellow-400 text-yellow-900";
    return "bg-red-100 border-red-400 text-red-900";
  };

  const getStatusIndicator = (value: number, threshold: number): string => {
    if (value >= threshold) return "🟢";
    if (value >= threshold * 0.7) return "🟡";
    return "🔴";
  };

  const getLastUpdatedDisplay = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const averageHealth =
    entities.length > 0
      ? Math.round(
          entities.reduce((sum, e) => sum + e.successRate, 0) / entities.length
        )
      : 0;

  const totalAlerts = entities.reduce(
    (sum, e) => sum + e.missingInsights + e.staleInsights,
    0
  );

  const sortedEntities = [...entities].sort(
    (a, b) => a.successRate - b.successRate
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Content Health Monitor
        </h1>
        <p className="text-gray-600">
          Real-time CRM data pipeline health • {timeWindow} window
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 rounded">
          <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
            Overall Health
          </div>
          <div className="text-4xl font-bold text-blue-900 mt-1">
            {averageHealth}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-l-4 border-orange-500 p-4 rounded">
          <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
            Active Alerts
          </div>
          <div className="text-4xl font-bold text-orange-900 mt-1">
            {totalAlerts}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 p-4 rounded">
          <div className="text-sm text-gray-600 font-semibold uppercase tracking-wide">
            Monitored Entities
          </div>
          <div className="text-4xl font-bold text-purple-900 mt-1">
            {entities.length}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Entity Status</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {sortedEntities.map((entity) => (
            <div
              key={entity.name}
              onClick={() => onEntityClick?.(entity)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${getStatusColor(
                entity.successRate,
                alertThreshold
              )}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">
                      {getStatusIndicator(entity.successRate, alertThreshold)}
                    </span>
                    <h3 className="text-lg font-semibold capitalize">
                      {entity.name}
                    </h3>
                  </div>
                  <p className="text-xs opacity-75">
                    Updated {getLastUpdatedDisplay(entity.lastUpdated)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Success Rate</span>
                    <span className="text-sm font-bold">
                      {entity.successRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${entity.successRate}%`,
                        backgroundColor:
                          entity.successRate >= alertThreshold
                            ? "#22c55e"
                            : entity.successRate >= alertThreshold * 0.7
                              ? "#eab308"
                              : "#ef4444",
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Data Freshness</span>
                    <span className="text-sm font-bold">
                      {entity.dataFreshness}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${entity.dataFreshness}%`,
                        backgroundColor:
                          entity.dataFreshness >= alertThreshold
                            ? "#22c55e"
                            : entity.dataFreshness >= alertThreshold * 0.7
                              ? "#eab308"
                              : "#ef4444",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {(entity.missingInsights > 0 || entity.staleInsights > 0) && (
                <div className="mt-3 pt-3 border-t border-current border-opacity-20 grid grid-cols-2 gap-2 text-xs">
                  {entity.missingInsights > 0 && (
                    <div className="flex items-center gap-1">
                      <span>⚠️</span>
                      <span>
                        {entity.missingInsights} missing insight
                        {entity.missingInsights !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  {entity.staleInsights > 0 && (
                    <div className="flex items-center gap-1">
                      <span>📦</span>
                      <span>
                        {entity.staleInsights} stale insight
                        {entity.staleInsights !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Health Indicators
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🟢</span>
            <div>
              <p className="font-medium text-gray-900">Healthy</p>
              <p className="text-gray-600">≥ {alertThreshold}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🟡</span>
            <div>
              <p className="font-medium text-gray-900">Caution</p>
              <p className="text-gray-600">
                {Math.round(alertThreshold * 0.7)}% - {alertThreshold}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔴</span>
            <div>
              <p className="font-medium text-gray-900">Critical</p>
              <p className="text-gray-600">
                &lt; {Math.round(alertThreshold * 0.7)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentHealthMonitor;
