import React from "react";

interface HealthMetric {
  completeness: number;
  quality: number;
  staleness: number;
  freshness: number;
  missingFields: string[];
  staleRecords: number;
  totalRecords: number;
}

interface Entity {
  name: string;
  type: string;
  recordCount: number;
}

interface DataHealthMatrixProps {
  entities: Entity[];
  healthMetrics: Record<string, HealthMetric>;
  timeRange?: string;
  onEntityClick?: (entityName: string) => void;
}

const DataHealthMatrix: React.FC<DataHealthMatrixProps> = ({
  entities,
  healthMetrics,
  timeRange = "Last 30 days",
  onEntityClick,
}) => {
  const getHealthColor = (score: number): string => {
    if (score >= 90) return "bg-green-100 text-green-900";
    if (score >= 70) return "bg-yellow-100 text-yellow-900";
    if (score >= 50) return "bg-orange-100 text-orange-900";
    return "bg-red-100 text-red-900";
  };

  const getHealthIndicator = (score: number): string => {
    if (score >= 90) return "●";
    if (score >= 70) return "◐";
    if (score >= 50) return "◑";
    return "○";
  };

  const getOverallHealth = (metric: HealthMetric): number => {
    return (metric.completeness + metric.quality + metric.freshness) / 3;
  };

  const sortedEntities = [...entities].sort((a, b) => {
    const scoreA = getOverallHealth(healthMetrics[a.name] || {
      completeness: 0,
      quality: 0,
      staleness: 0,
      freshness: 0,
      missingFields: [],
      staleRecords: 0,
      totalRecords: 0,
    });
    const scoreB = getOverallHealth(healthMetrics[b.name] || {
      completeness: 0,
      quality: 0,
      staleness: 0,
      freshness: 0,
      missingFields: [],
      staleRecords: 0,
      totalRecords: 0,
    });
    return scoreB - scoreA;
  });

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Health Matrix</h1>
        <p className="text-sm text-gray-500">{timeRange}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sortedEntities.map((entity) => {
          const metric = healthMetrics[entity.name];
          if (!metric)
            return (
              <div key={entity.name} className="text-gray-500">
                No data for {entity.name}
              </div>
            );

          const overallHealth = getOverallHealth(metric);
          const healthIndicator = getHealthIndicator(overallHealth);

          return (
            <div
              key={entity.name}
              onClick={() => onEntityClick?.(entity.name)}
              className={`border rounded-lg p-4 transition-all ${
                onEntityClick ? "cursor-pointer hover:shadow-md hover:bg-gray-50" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-2xl ${getHealthColor(overallHealth)}`}>
                    {healthIndicator}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{entity.name}</h3>
                    <p className="text-xs text-gray-500">
                      {entity.recordCount.toLocaleString()} records
                    </p>
                  </div>
                </div>
                <div className={`text-2xl font-bold ${getHealthColor(overallHealth)} px-3 py-1 rounded`}>
                  {Math.round(overallHealth)}%
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                <div
                  className={`p-2 rounded text-center ${getHealthColor(metric.completeness)}`}
                >
                  <div className="text-xs font-semibold">Completeness</div>
                  <div className="text-lg font-bold">{Math.round(metric.completeness)}%</div>
                </div>
                <div className={`p-2 rounded text-center ${getHealthColor(metric.quality)}`}>
                  <div className="text-xs font-semibold">Quality</div>
                  <div className="text-lg font-bold">{Math.round(metric.quality)}%</div>
                </div>
                <div className={`p-2 rounded text-center ${getHealthColor(metric.freshness)}`}>
                  <div className="text-xs font-semibold">Freshness</div>
                  <div className="text-lg font-bold">{Math.round(metric.freshness)}%</div>
                </div>
                <div className="p-2 rounded text-center bg-gray-100 text-gray-900">
                  <div className="text-xs font-semibold">Stale</div>
                  <div className="text-lg font-bold">{metric.staleRecords}</div>
                </div>
              </div>

              {metric.missingFields.length > 0 && (
                <div className="mb-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                  <div className="text-xs font-semibold text-yellow-900 mb-1">
                    ⚠ Missing Fields ({metric.missingFields.length})
                  </div>
                  <div className="text-xs text-yellow-800">
                    {metric.missingFields.slice(0, 3).join(", ")}
                    {metric.missingFields.length > 3 && ` +${metric.missingFields.length - 3} more`}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-600">
                <div>
                  <span className="font-semibold">Staleness:</span> {Math.round(metric.staleness)}%
                </div>
                <div className="text-right">
                  {metric.staleRecords > 0 && (
                    <span className="text-orange-600 font-semibold">
                      🔄 {metric.staleRecords} stale records
                    </span>
                  )}
                  {metric.staleRecords === 0 && (
                    <span className="text-green-600 font-semibold">✓ All records current</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sortedEntities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No entities to display</p>
        </div>
      )}
    </div>
  );
};

export default DataHealthMatrix;
