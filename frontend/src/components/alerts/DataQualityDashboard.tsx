import React from "react";

interface EntityMetric {
  entity: string;
  completeness: number;
  freshness: number;
  recordCount: number;
  missingFields: string[];
  staleRecords: number;
  lastUpdated: string;
}

interface DataQualityDashboardProps {
  entityMetrics: EntityMetric[];
  timeRange?: string;
  onAlertClick?: (entity: string, alertType: string) => void;
}

const DataQualityDashboard: React.FC<DataQualityDashboardProps> = ({
  entityMetrics,
  timeRange = "Last 30 days",
  onAlertClick,
}) => {
  const getHealthStatus = (completeness: number, freshness: number) => {
    const average = (completeness + freshness) / 2;
    if (average >= 90) return { status: "Healthy", color: "bg-green-100 border-green-300", textColor: "text-green-800", icon: "✓" };
    if (average >= 70) return { status: "Warning", color: "bg-yellow-100 border-yellow-300", textColor: "text-yellow-800", icon: "⚠" };
    return { status: "Critical", color: "bg-red-100 border-red-300", textColor: "text-red-800", icon: "✕" };
  };

  const ProgressBar: React.FC<{ percentage: number; label: string }> = ({ percentage, label }) => (
    <div className="mb-2">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-600">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${
            percentage >= 90 ? "bg-green-500" : percentage >= 70 ? "bg-yellow-500" : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );

  const MetricCard: React.FC<{ metric: EntityMetric }> = ({ metric }) => {
    const health = getHealthStatus(metric.completeness, metric.freshness);

    return (
      <div className={`rounded-lg border-2 p-6 mb-4 ${health.color}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className={`text-xl ${health.textColor}`}>{health.icon}</span>
              {metric.entity}
            </h3>
            <p className={`text-sm ${health.textColor} font-medium`}>{health.status}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{metric.recordCount}</p>
            <p className="text-xs text-gray-600">Records</p>
          </div>
        </div>

        <ProgressBar percentage={metric.completeness} label="Completeness" />
        <ProgressBar percentage={metric.freshness} label="Freshness" />

        <div className="mt-4 pt-4 border-t border-gray-300">
          {metric.staleRecords > 0 && (
            <button
              onClick={() => onAlertClick?.(metric.entity, "stale")}
              className="block w-full text-left text-sm mb-2 hover:opacity-75 transition-opacity"
            >
              <span className="font-semibold">⏱ Stale Records:</span> {metric.staleRecords}
            </button>
          )}
          {metric.missingFields.length > 0 && (
            <button
              onClick={() => onAlertClick?.(metric.entity, "missing")}
              className="block w-full text-left text-sm hover:opacity-75 transition-opacity"
            >
              <span className="font-semibold">📋 Missing Fields:</span>{" "}
              {metric.missingFields.slice(0, 3).join(", ")}
              {metric.missingFields.length > 3 && ` +${metric.missingFields.length - 3}`}
            </button>
          )}
        </div>

        <p className="text-xs text-gray-600 mt-3">Updated: {metric.lastUpdated}</p>
      </div>
    );
  };

  const overallHealth = entityMetrics.reduce((sum, m) => sum + (m.completeness + m.freshness) / 2, 0) / entityMetrics.length;
  const overallStatus = getHealthStatus(overallHealth, overallHealth);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Quality Dashboard</h1>
        <p className="text-gray-600">{timeRange}</p>
      </div>

      <div className={`rounded-lg border-2 p-6 mb-8 ${overallStatus.color}`}>
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className={`text-2xl ${overallStatus.textColor}`}>{overallStatus.icon}</span>
          Overall Health: {overallStatus.status}
        </h2>
        <div className="bg-white bg-opacity-60 rounded p-4">
          <ProgressBar percentage={Math.round(overallHealth)} label="Overall Score" />
        </div>
      </div>

      <div className="space-y-4">
        {entityMetrics.map((metric) => (
          <MetricCard key={metric.entity} metric={metric} />
        ))}
      </div>

      {entityMetrics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No metrics available</p>
        </div>
      )}
    </div>
  );
};

export default DataQualityDashboard;
