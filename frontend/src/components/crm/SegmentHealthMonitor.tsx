import React from "react";

interface Metric {
  name: string;
  value: number;
  trend: "up" | "down" | "stable";
  threshold?: number;
}

interface ComparisonSegment {
  id: string;
  name: string;
  value: number;
}

interface SegmentHealthMonitorProps {
  segmentId: string;
  timeRange?: string;
  metrics: Metric[];
  showChurnPrediction?: boolean;
  comparisonSegments?: ComparisonSegment[];
}

const SegmentHealthMonitor: React.FC<SegmentHealthMonitorProps> = ({
  segmentId,
  timeRange = "30d",
  metrics,
  showChurnPrediction = false,
  comparisonSegments = [],
}) => {
  const getTrendIcon = (trend: "up" | "down" | "stable"): string => {
    switch (trend) {
      case "up":
        return "📈";
      case "down":
        return "📉";
      case "stable":
        return "→";
    }
  };

  const getTrendColor = (trend: "up" | "down" | "stable"): string => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "stable":
        return "text-gray-600";
    }
  };

  const getHealthStatus = (): "healthy" | "warning" | "critical" => {
    const avgValue =
      metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
    if (avgValue >= 75) return "healthy";
    if (avgValue >= 50) return "warning";
    return "critical";
  };

  const getStatusColor = (status: "healthy" | "warning" | "critical") => {
    switch (status) {
      case "healthy":
        return "bg-green-100 border-green-400 text-green-800";
      case "warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-800";
      case "critical":
        return "bg-red-100 border-red-400 text-red-800";
    }
  };

  const healthStatus = getHealthStatus();
  const detectedAnomalies = metrics.filter(
    (m) => m.threshold && Math.abs(m.value - m.threshold) > 20
  );
  const churnRisk = metrics.find((m) => m.name.toLowerCase().includes("churn"));

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Segment Health</h2>
          <p className="text-sm text-gray-500">ID: {segmentId}</p>
        </div>
        <div className={`px-4 py-2 rounded-full border-2 font-semibold ${getStatusColor(healthStatus)}`}>
          {healthStatus === "healthy" && "✓ Healthy"}
          {healthStatus === "warning" && "⚠ Warning"}
          {healthStatus === "critical" && "✗ Critical"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-700">{metric.name}</h3>
              <span className={`text-xl ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metric.value}%
            </div>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  metric.value >= 75
                    ? "bg-green-500"
                    : metric.value >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {detectedAnomalies.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
          <div className="flex items-start">
            <span className="text-xl mr-3">🤖</span>
            <div>
              <h4 className="font-semibold text-orange-900 mb-2">
                Anomalies Detected
              </h4>
              <ul className="space-y-1 text-sm text-orange-800">
                {detectedAnomalies.map((anomaly) => (
                  <li key={anomaly.name}>
                    • {anomaly.name}: {anomaly.value}% (Threshold:
                    {anomaly.threshold}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {showChurnPrediction && churnRisk && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <span className="text-xl mr-3">⚡</span>
            <div>
              <h4 className="font-semibold text-red-900">Churn Risk Analysis</h4>
              <p className="text-sm text-red-800 mt-1">
                Current risk level: {churnRisk.value}%
              </p>
              <p className="text-xs text-red-700 mt-2">
                {churnRisk.value > 70
                  ? "High risk - immediate intervention recommended"
                  : churnRisk.value > 40
                    ? "Moderate risk - monitor closely"
                    : "Low risk - stable segment"}
              </p>
            </div>
          </div>
        </div>
      )}

      {comparisonSegments.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">
            📊 Segment Comparison
          </h4>
          <div className="space-y-2">
            {comparisonSegments.map((segment) => (
              <div
                key={segment.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-blue-800">{segment.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${segment.value}%` }}
                    />
                  </div>
                  <span className="font-semibold text-blue-900 w-10 text-right">
                    {segment.value}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 text-right">
        Time Range: {timeRange} • Last Updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SegmentHealthMonitor;
