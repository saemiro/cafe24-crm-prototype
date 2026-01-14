import React from "react";

interface Entity {
  name: string;
  completeness: number;
  dataQuality: number;
  lastUpdated: string;
  missingFields?: number;
  staleDataCount?: number;
  pipelineErrors?: number;
}

interface Thresholds {
  completeness?: number;
  quality?: number;
  staleness?: number;
}

interface DataHealthMonitorProps {
  entities: Entity[];
  timeWindow?: string;
  thresholds?: Thresholds;
  onAlertClick?: (alert: Alert) => void;
}

interface Alert {
  id: string;
  type: "missing" | "stale" | "pipeline";
  entity: string;
  severity: "critical" | "warning" | "info";
  message: string;
}

const DataHealthMonitor: React.FC<DataHealthMonitorProps> = ({
  entities,
  timeWindow = "24h",
  thresholds = { completeness: 80, quality: 85, staleness: 24 },
  onAlertClick,
}) => {
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];
    let alertId = 0;

    entities.forEach((entity) => {
      if (entity.completeness < (thresholds.completeness || 80)) {
        alerts.push({
          id: `alert-${alertId++}`,
          type: "missing",
          entity: entity.name,
          severity: entity.completeness < 50 ? "critical" : "warning",
          message: `Missing ${entity.missingFields || 0} fields (${100 - entity.completeness}% incomplete)`,
        });
      }

      if (entity.dataQuality < (thresholds.quality || 85)) {
        alerts.push({
          id: `alert-${alertId++}`,
          type: "stale",
          entity: entity.name,
          severity: entity.dataQuality < 60 ? "critical" : "warning",
          message: `Data quality degraded to ${entity.dataQuality}%`,
        });
      }

      if ((entity.pipelineErrors || 0) > 0) {
        alerts.push({
          id: `alert-${alertId++}`,
          type: "pipeline",
          entity: entity.name,
          severity: (entity.pipelineErrors || 0) > 5 ? "critical" : "warning",
          message: `${entity.pipelineErrors} pipeline errors detected`,
        });
      }
    });

    return alerts;
  };

  const alerts = generateAlerts();
  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const warningAlerts = alerts.filter((a) => a.severity === "warning");

  const getHealthColor = (value: number): string => {
    if (value >= 90) return "text-green-600";
    if (value >= 80) return "text-yellow-600";
    if (value >= 70) return "text-orange-600";
    return "text-red-600";
  };

  const getHealthBgColor = (value: number): string => {
    if (value >= 90) return "bg-green-50";
    if (value >= 80) return "bg-yellow-50";
    if (value >= 70) return "bg-orange-50";
    return "bg-red-50";
  };

  const getProgressBarColor = (value: number): string => {
    if (value >= 90) return "bg-green-500";
    if (value >= 80) return "bg-yellow-500";
    if (value >= 70) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            📊 Data Health Monitor
          </h1>
          <div className="text-sm text-gray-500">Time Window: {timeWindow}</div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-2xl font-bold text-blue-600">
              {entities.length}
            </div>
            <div className="text-sm text-gray-600">Total Entities</div>
          </div>
          <div className="bg-red-50 p-4 rounded">
            <div className="text-2xl font-bold text-red-600">
              {criticalAlerts.length}
            </div>
            <div className="text-sm text-gray-600">Critical Alerts</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded">
            <div className="text-2xl font-bold text-yellow-600">
              {warningAlerts.length}
            </div>
            <div className="text-sm text-gray-600">Warnings</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(
                entities.reduce((sum, e) => sum + e.completeness, 0) /
                  entities.length
              )}
              %
            </div>
            <div className="text-sm text-gray-600">Avg Completeness</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Entity Health Status
          </h2>
          <div className="space-y-4">
            {entities.map((entity) => (
              <div
                key={entity.name}
                className={`p-4 rounded-lg border ${getHealthBgColor(entity.completeness)} border-gray-200`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900">
                    {entity.name}
                  </h3>
                  <span
                    className={`font-bold text-lg ${getHealthColor(entity.completeness)}`}
                  >
                    {entity.completeness}%
                  </span>
                </div>

                <div className="mb-2">
                  <div className="text-sm text-gray-600 mb-1">
                    Completeness
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressBarColor(entity.completeness)}`}
                      style={{ width: `${entity.completeness}%` }}
                    ></div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-sm text-gray-600 mb-1">Data Quality</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressBarColor(entity.dataQuality)}`}
                      style={{ width: `${entity.dataQuality}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 mt-2">
                  Last Updated: {entity.lastUpdated}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            ⚠️ Active Alerts
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                <div className="text-green-700 font-semibold">
                  ✓ All systems healthy!
                </div>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => onAlertClick?.(alert)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    alert.severity === "critical"
                      ? "bg-red-50 border-red-300"
                      : "bg-yellow-50 border-yellow-300"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">
                      {alert.type === "missing"
                        ? "❌"
                        : alert.type === "stale"
                          ? "⏰"
                          : "🔧"}
                    </span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {alert.entity}
                      </div>
                      <div className="text-sm text-gray-700">
                        {alert.message}
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          alert.severity === "critical"
                            ? "text-red-600 font-semibold"
                            : "text-yellow-600"
                        }`}
                      >
                        {alert.severity.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">📋 Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Average Completeness: </span>
            <span className="font-bold text-gray-900">
              {Math.round(
                entities.reduce((sum, e) => sum + e.completeness, 0) /
                  entities.length
              )}
              %
            </span>
          </div>
          <div>
            <span className="text-gray-600">Average Quality: </span>
            <span className="font-bold text-gray-900">
              {Math.round(
                entities.reduce((sum, e) => sum + e.dataQuality, 0) /
                  entities.length
              )}
              %
            </span>
          </div>
          <div>
            <span className="text-gray-600">Total Issues: </span>
            <span className="font-bold text-red-600">{alerts.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataHealthMonitor;
