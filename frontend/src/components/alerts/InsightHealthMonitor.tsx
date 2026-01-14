import React from "react";

interface EntityData {
  type: string;
  totalCount: number;
  withInsights: number;
  insightTypes: {
    [key: string]: number;
  };
  missingDataEntities: string[];
}

interface InsightHealthMonitorProps {
  entityTypes: string[];
  timeRange?: string;
  alertThreshold?: number;
  onAlertClick?: (entityType: string, missingData: string[]) => void;
}

const InsightHealthMonitor: React.FC<InsightHealthMonitorProps> = ({
  entityTypes,
  timeRange = "30 days",
  alertThreshold = 0.8,
  onAlertClick,
}) => {
  const [entityData, setEntityData] = React.useState<EntityData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const mockData: EntityData[] = entityTypes.map((type) => {
      const totalCount = Math.floor(Math.random() * 100) + 50;
      const withInsights = Math.floor(totalCount * (Math.random() * 0.3 + 0.5));
      const insightTypes = {
        behavioral: Math.floor(withInsights * 0.4),
        predictive: Math.floor(withInsights * 0.35),
        recommendations: Math.floor(withInsights * 0.25),
      };
      const missingDataEntities = Array.from(
        { length: Math.floor(Math.random() * 5) },
        (_, i) => `${type}_${i + 1}`
      );

      return {
        type,
        totalCount,
        withInsights,
        insightTypes,
        missingDataEntities,
      };
    });

    setEntityData(mockData);
    setLoading(false);
  }, [entityTypes]);

  const calculateContentRate = (entity: EntityData): number => {
    return entity.totalCount > 0 ? entity.withInsights / entity.totalCount : 0;
  };

  const getStatusIndicator = (rate: number): string => {
    if (rate >= alertThreshold) return "✓";
    if (rate >= 0.6) return "⚠";
    return "✗";
  };

  const getStatusColor = (rate: number): string => {
    if (rate >= alertThreshold) return "text-green-600";
    if (rate >= 0.6) return "text-yellow-600";
    return "text-red-600";
  };

  const getBgColor = (rate: number): string => {
    if (rate >= alertThreshold) return "bg-green-50";
    if (rate >= 0.6) return "bg-yellow-50";
    return "bg-red-50";
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Insight Health Monitor
        </h1>
        <p className="text-gray-600">
          Monitoring insight generation quality • Time Range: {timeRange}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Total Entities</div>
          <div className="text-2xl font-bold text-blue-700">
            {entityData.reduce((sum, e) => sum + e.totalCount, 0)}
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-gray-600 mb-1">With Insights</div>
          <div className="text-2xl font-bold text-purple-700">
            {entityData.reduce((sum, e) => sum + e.withInsights, 0)}
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
          <div className="text-sm text-gray-600 mb-1">
            Average Coverage Rate
          </div>
          <div className="text-2xl font-bold text-indigo-700">
            {Math.round(
              (entityData.reduce((sum, e) => sum + calculateContentRate(e), 0) /
                entityData.length) *
                100
            )}
            %
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-sm text-gray-600 mb-1">Alerts</div>
          <div className="text-2xl font-bold text-orange-700">
            {entityData.filter(
              (e) => calculateContentRate(e) < alertThreshold
            ).length}
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-bold text-gray-900">Entity Overview</h2>

        {entityData.map((entity) => {
          const contentRate = calculateContentRate(entity);
          const statusColor = getStatusColor(contentRate);
          const bgColor = getBgColor(contentRate);
          const statusIndicator = getStatusIndicator(contentRate);

          return (
            <div key={entity.type} className={`rounded-lg border p-6 ${bgColor}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`text-2xl font-bold ${statusColor} w-8 text-center`}
                  >
                    {statusIndicator}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {entity.type}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {entity.withInsights} of {entity.totalCount} entities have
                      insights
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-2xl font-bold ${statusColor}`}>
                    {Math.round(contentRate * 100)}%
                  </div>
                  <div className="text-xs text-gray-600">coverage rate</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className={`h-2 rounded-full transition-all ${
                    contentRate >= alertThreshold
                      ? "bg-green-600"
                      : contentRate >= 0.6
                        ? "bg-yellow-600"
                        : "bg-red-600"
                  }`}
                  style={{ width: `${contentRate * 100}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded p-3">
                  <div className="text-xs text-gray-600 mb-1">Behavioral</div>
                  <div className="font-semibold text-gray-900">
                    {entity.insightTypes.behavioral}
                  </div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="text-xs text-gray-600 mb-1">Predictive</div>
                  <div className="font-semibold text-gray-900">
                    {entity.insightTypes.predictive}
                  </div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="text-xs text-gray-600 mb-1">
                    Recommendations
                  </div>
                  <div className="font-semibold text-gray-900">
                    {entity.insightTypes.recommendations}
                  </div>
                </div>
              </div>

              {entity.missingDataEntities.length > 0 && (
                <div className="border-t pt-4">
                  <button
                    onClick={() =>
                      onAlertClick?.(
                        entity.type,
                        entity.missingDataEntities
                      )
                    }
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer flex items-center gap-2"
                  >
                    <span>⚠ {entity.missingDataEntities.length}</span>
                    <span>
                      entities missing data:
                      {entity.missingDataEntities.slice(0, 2).join(", ")}
                      {entity.missingDataEntities.length > 2 && "..."}
                    </span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <span>ℹ</span> Health Status Summary
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Healthy: ≥
            {Math.round(alertThreshold * 100)}% coverage rate
          </li>
          <li className="flex items-center gap-2">
            <span className="text-yellow-600">⚠</span> Warning: 60-
            {Math.round(alertThreshold * 100) - 1}% coverage rate
          </li>
          <li className="flex items-center gap-2">
            <span className="text-red-600">✗</span> Critical: &lt;60% coverage
            rate
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InsightHealthMonitor;
