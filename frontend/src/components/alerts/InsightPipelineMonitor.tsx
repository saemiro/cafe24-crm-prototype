import React from "react";
import { useState, useEffect } from "react";

interface InsightType {
  id: string;
  name: string;
  contentQuality: number;
  processingStatus: "idle" | "processing" | "completed" | "failed";
  lastUpdated: Date;
  itemCount: number;
}

interface InsightPipelineMonitorProps {
  insightTypes: InsightType[];
  contentQualityThreshold?: number;
  alertOnEmptyContent?: boolean;
  refreshInterval?: number;
}

const InsightPipelineMonitor: React.FC<InsightPipelineMonitorProps> = ({
  insightTypes,
  contentQualityThreshold = 70,
  alertOnEmptyContent = true,
  refreshInterval = 30000,
}) => {
  const [metrics, setMetrics] = useState<InsightType[]>(insightTypes);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(
        metrics.map((metric) => ({
          ...metric,
          contentQuality: Math.max(
            50,
            metric.contentQuality + (Math.random() - 0.5) * 10
          ),
          processingStatus:
            Math.random() > 0.7
              ? "processing"
              : metric.processingStatus === "processing"
                ? "completed"
                : metric.processingStatus,
        }))
      );
      setLastRefresh(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, metrics]);

  const getQualityColor = (quality: number): string => {
    if (quality >= contentQualityThreshold) return "text-green-600";
    if (quality >= contentQualityThreshold - 20) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = (
    status: "idle" | "processing" | "completed" | "failed"
  ): string => {
    switch (status) {
      case "processing":
        return "⟳";
      case "completed":
        return "✓";
      case "failed":
        return "✕";
      default:
        return "◯";
    }
  };

  const getStatusColor = (
    status: "idle" | "processing" | "completed" | "failed"
  ): string => {
    switch (status) {
      case "processing":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getDataFreshness = (lastUpdated: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getFreshnessColor = (lastUpdated: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 5) return "text-green-600";
    if (diffMins < 60) return "text-yellow-600";
    return "text-red-600";
  };

  const hasEmptyContent = metrics.some((m) => m.itemCount === 0);
  const avgQuality =
    metrics.reduce((sum, m) => sum + m.contentQuality, 0) / metrics.length;
  const processingCount = metrics.filter(
    (m) => m.processingStatus === "processing"
  ).length;
  const failedCount = metrics.filter(
    (m) => m.processingStatus === "failed"
  ).length;

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Insight Pipeline Monitor
        </h1>
        <p className="text-sm text-gray-600">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </p>
      </div>

      {hasEmptyContent && alertOnEmptyContent && (
        <div className="mb-4 p-3 bg-orange-100 border border-orange-400 rounded text-orange-800 text-sm">
          ⚠ Some insight types have no content
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Average Quality</p>
          <p className={`text-2xl font-bold ${getQualityColor(avgQuality)}`}>
            {avgQuality.toFixed(1)}%
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Processing</p>
          <p className="text-2xl font-bold text-blue-600">{processingCount}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Failed</p>
          <p className="text-2xl font-bold text-red-600">{failedCount}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded">
          <p className="text-gray-600 text-sm">Total Types</p>
          <p className="text-2xl font-bold text-gray-800">
            {metrics.length}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {metrics.map((insight) => (
          <div
            key={insight.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span
                  className={`text-xl ${getStatusColor(insight.processingStatus)}`}
                >
                  {getStatusIcon(insight.processingStatus)}
                </span>
                <h3 className="font-semibold text-gray-800">
                  {insight.name}
                </h3>
              </div>
              <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                {insight.processingStatus}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Content Quality</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      insight.contentQuality >= contentQualityThreshold
                        ? "bg-green-500"
                        : insight.contentQuality >=
                            contentQualityThreshold - 20
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(100, insight.contentQuality)}%`,
                    }}
                  ></div>
                </div>
                <p
                  className={`text-xs font-semibold mt-1 ${getQualityColor(insight.contentQuality)}`}
                >
                  {insight.contentQuality.toFixed(1)}%
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Data Freshness</p>
                <p
                  className={`text-sm font-medium ${getFreshnessColor(insight.lastUpdated)}`}
                >
                  {getDataFreshness(insight.lastUpdated)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600 mb-1">Items</p>
                <p className="text-sm font-medium text-gray-800">
                  {insight.itemCount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {metrics.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No insight types configured
        </div>
      )}
    </div>
  );
};

export default InsightPipelineMonitor;
