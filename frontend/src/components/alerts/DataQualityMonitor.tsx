import React from "react";

interface QualityMetric {
  completeness: number;
  freshness: number;
  validity: number;
  timestamp?: string;
  recordCount?: number;
  lastUpdated?: string;
}

interface DataQualityMonitorProps {
  entityType: string;
  qualityMetrics: QualityMetric;
  threshold?: number;
  timeRange?: string;
  onAlertClick?: (alert: string) => void;
}

const DataQualityMonitor: React.FC<DataQualityMonitorProps> = ({
  entityType,
  qualityMetrics,
  threshold = 80,
  timeRange = "24h",
  onAlertClick,
}) => {
  const getStatusColor = (value: number): string => {
    if (value >= threshold) return "text-green-600";
    if (value >= threshold - 10) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBgColor = (value: number): string => {
    if (value >= threshold) return "bg-green-50 border-green-200";
    if (value >= threshold - 10) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getStatusIcon = (value: number): string => {
    if (value >= threshold) return "✓";
    if (value >= threshold - 10) return "⚠";
    return "✕";
  };

  const MetricCard: React.FC<{
    label: string;
    value: number;
  }> = ({ label, value }) => (
    <div
      className={`p-4 rounded-lg border-2 ${getStatusBgColor(value)} transition-all`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
        <span className={`text-xl font-bold ${getStatusColor(value)}`}>
          {getStatusIcon(value)}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className={`text-2xl font-bold ${getStatusColor(value)}`}>
          {value.toFixed(1)}%
        </span>
        <div className="w-24 h-2 bg-gray-300 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              value >= threshold
                ? "bg-green-600"
                : value >= threshold - 10
                  ? "bg-yellow-600"
                  : "bg-red-600"
            }`}
            style={{ width: `${Math.min(value, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  const hasAlerts =
    qualityMetrics.completeness < threshold ||
    qualityMetrics.freshness < threshold ||
    qualityMetrics.validity < threshold;

  const alertCount = [
    qualityMetrics.completeness < threshold ? 1 : 0,
    qualityMetrics.freshness < threshold ? 1 : 0,
    qualityMetrics.validity < threshold ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Data Quality Monitor
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Entity: <span className="font-semibold">{entityType}</span> •
              Time Range: <span className="font-semibold">{timeRange}</span> •
              Threshold: <span className="font-semibold">{threshold}%</span>
            </p>
          </div>
          {hasAlerts && (
            <button
              onClick={() =>
                onAlertClick?.(
                  `${alertCount} metric(s) below threshold for ${entityType}`
                )
              }
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">⚠</span>
              <span>{alertCount} Alert{alertCount !== 1 ? "s" : ""}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard
          label="Completeness"
          value={qualityMetrics.completeness}
        />
        <MetricCard label="Freshness" value={qualityMetrics.freshness} />
        <MetricCard label="Validity" value={qualityMetrics.validity} />
      </div>

      {(qualityMetrics.recordCount || qualityMetrics.lastUpdated) && (
        <div className="border-t pt-4 mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {qualityMetrics.recordCount && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-600">Record Count</p>
                <p className="font-semibold text-gray-900">
                  {qualityMetrics.recordCount.toLocaleString()}
                </p>
              </div>
            )}
            {qualityMetrics.lastUpdated && (
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-gray-600">Last Updated</p>
                <p className="font-semibold text-gray-900">
                  {qualityMetrics.lastUpdated}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          <span className="font-semibold">ℹ Pipeline Health:</span> Monitoring
          quality metrics for {entityType} across Customer, Order, Product,
          Campaign, and CustomerSegment entities.
        </p>
      </div>
    </div>
  );
};

export default DataQualityMonitor;
