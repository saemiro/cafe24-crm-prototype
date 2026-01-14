import React from "react";

interface Entity {
  name: string;
  completeness: number;
  missingFields: Record<string, number>;
  totalRecords: number;
  lastUpdated: string;
}

interface DataHealthMonitorProps {
  entities: Entity[];
  threshold?: number;
  timeRange?: string;
  onAlertClick?: (entity: string, field: string) => void;
}

const DataHealthMonitor: React.FC<DataHealthMonitorProps> = ({
  entities,
  threshold = 90,
  timeRange = "24h",
  onAlertClick,
}) => {
  const getHealthStatus = (completeness: number) => {
    if (completeness >= threshold) return "healthy";
    if (completeness >= threshold - 10) return "warning";
    return "critical";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "critical":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusBadge = (status: string) => {
    const icons = {
      healthy: "✓",
      warning: "!",
      critical: "✕",
    };
    return icons[status as keyof typeof icons] || "?";
  };

  const sortedEntities = [...entities].sort(
    (a, b) => a.completeness - b.completeness
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Data Health Monitor
        </h1>
        <p className="text-gray-600">
          Real-time data quality dashboard • Time Range: {timeRange}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {sortedEntities.map((entity) => {
          const status = getHealthStatus(entity.completeness);
          const statusColor = getStatusColor(status);

          return (
            <div
              key={entity.name}
              className={`p-4 rounded-lg border-2 ${statusColor.split(" ")[1]} border-current`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {entity.name}
                </h3>
                <span className={`text-lg font-bold ${statusColor.split(" ")[0]}`}>
                  {getStatusBadge(status)}
                </span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-600">Completeness</span>
                  <span className="text-lg font-bold text-gray-900">
                    {entity.completeness}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      status === "healthy"
                        ? "bg-green-500"
                        : status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${entity.completeness}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p>Records: {entity.totalRecords.toLocaleString()}</p>
                <p className="text-gray-500">
                  Updated: {new Date(entity.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Missing Fields Details</h2>

        {sortedEntities.map((entity) => {
          const missingFieldsEntries = Object.entries(entity.missingFields).sort(
            ([, a], [, b]) => b - a
          );

          if (missingFieldsEntries.length === 0) {
            return null;
          }

          return (
            <div key={`${entity.name}-details`} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{entity.name}</h3>

              <div className="space-y-2">
                {missingFieldsEntries.map(([field, count]) => {
                  const missingPercent = ((count / entity.totalRecords) * 100).toFixed(1);
                  const isAlert = parseFloat(missingPercent) > 100 - threshold;

                  return (
                    <div
                      key={`${entity.name}-${field}`}
                      className={`flex items-center justify-between p-3 rounded border ${
                        isAlert
                          ? "bg-red-50 border-red-200 cursor-pointer hover:bg-red-100"
                          : "bg-white border-gray-200"
                      }`}
                      onClick={() =>
                        isAlert && onAlertClick && onAlertClick(entity.name, field)
                      }
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{field}</p>
                        <p className="text-xs text-gray-500">
                          {count} missing records
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-24">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                isAlert ? "bg-red-500" : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(parseFloat(missingPercent), 100)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                          {missingPercent}%
                        </span>

                        {isAlert && (
                          <span className="text-lg">⚠️</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {sortedEntities.every((entity) => Object.keys(entity.missingFields).length === 0) && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-medium">✓ All entities have complete data</p>
          </div>
        )}
      </div>

      <div className="mt-8 text-xs text-gray-500 flex justify-between items-center">
        <p>Health Threshold: {threshold}%</p>
        <p>Showing {entities.length} entities</p>
      </div>
    </div>
  );
};

export default DataHealthMonitor;
