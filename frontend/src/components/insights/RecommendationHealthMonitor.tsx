import React from "react";

interface Threshold {
  ctr?: number;
  conversion?: number;
  coverage?: number;
  performance?: number;
}

interface RecommendationHealthMonitorProps {
  timeRange: string;
  segmentFilter?: string[];
  algorithmType?: string;
  refreshInterval?: number;
  thresholds?: Threshold;
}

interface SegmentMetrics {
  segment: string;
  coverage: number;
  ctr: number;
  conversion: number;
  recommendations: number;
}

interface AlgorithmPerformance {
  type: string;
  effectiveness: number;
  coverage: number;
  avgCtr: number;
  trend: number;
}

const RecommendationHealthMonitor: React.FC<RecommendationHealthMonitorProps> = ({
  timeRange,
  segmentFilter = [],
  algorithmType,
  refreshInterval = 30000,
  thresholds = {
    ctr: 0.05,
    conversion: 0.02,
    coverage: 0.8,
    performance: 0.75,
  },
}) => {
  const [segmentMetrics, setSegmentMetrics] = React.useState<SegmentMetrics[]>([
    {
      segment: "Premium",
      coverage: 0.95,
      ctr: 0.082,
      conversion: 0.035,
      recommendations: 12450,
    },
    {
      segment: "Standard",
      coverage: 0.87,
      ctr: 0.058,
      conversion: 0.022,
      recommendations: 34820,
    },
    {
      segment: "Basic",
      coverage: 0.72,
      ctr: 0.042,
      conversion: 0.015,
      recommendations: 58930,
    },
    {
      segment: "Inactive",
      coverage: 0.45,
      ctr: 0.018,
      conversion: 0.008,
      recommendations: 15240,
    },
  ]);

  const [algorithmMetrics, setAlgorithmMetrics] = React.useState<AlgorithmPerformance[]>([
    {
      type: "Collaborative Filtering",
      effectiveness: 0.82,
      coverage: 0.91,
      avgCtr: 0.072,
      trend: 0.05,
    },
    {
      type: "Content-Based Filtering",
      effectiveness: 0.76,
      coverage: 0.85,
      avgCtr: 0.061,
      trend: -0.02,
    },
    {
      type: "Hybrid Approach",
      effectiveness: 0.88,
      coverage: 0.93,
      avgCtr: 0.079,
      trend: 0.08,
    },
  ]);

  const [systemHealth, setSystemHealth] = React.useState({
    uptime: 0.999,
    latency: 145,
    errorRate: 0.002,
    totalRecommendations: 121440,
    activeCustomers: 8940,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth((prev) => ({
        ...prev,
        latency: Math.floor(Math.random() * 100) + 120,
        errorRate: Math.random() * 0.005,
      }));

      setSegmentMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          ctr: Math.max(0, m.ctr + (Math.random() - 0.5) * 0.01),
          conversion: Math.max(0, m.conversion + (Math.random() - 0.5) * 0.005),
        }))
      );
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const filteredSegments = segmentFilter?.length
    ? segmentMetrics.filter((m) => segmentFilter.includes(m.segment))
    : segmentMetrics;

  const getStatusColor = (value: number, threshold: number): string => {
    if (value >= threshold * 1.1) return "bg-green-100 border-green-400 text-green-900";
    if (value >= threshold) return "bg-blue-100 border-blue-400 text-blue-900";
    return "bg-red-100 border-red-400 text-red-900";
  };

  const getStatusIcon = (value: number, threshold: number): string => {
    if (value >= threshold * 1.1) return "✓";
    if (value >= threshold) return "◑";
    return "✗";
  };

  return (
    <div className="w-full bg-gray-50 p-6 rounded-lg space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          AI Recommendation Health Monitor
        </h1>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Time Range: {timeRange}</p>
          <p className="text-green-600 font-semibold">● System Online</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">System Uptime</p>
          <p className="text-2xl font-bold text-green-600">99.9%</p>
          <p className="text-xs text-gray-500 mt-2">◆ Excellent</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Avg Latency</p>
          <p className="text-2xl font-bold text-blue-600">{systemHealth.latency}ms</p>
          <p className="text-xs text-gray-500 mt-2">◆ Healthy</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Error Rate</p>
          <p className="text-2xl font-bold text-green-600">
            {(systemHealth.errorRate * 100).toFixed(2)}%
          </p>
          <p className="text-xs text-gray-500 mt-2">◆ Normal</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">Active Customers</p>
          <p className="text-2xl font-bold text-purple-600">
            {systemHealth.activeCustomers.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">◆ Live</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Coverage by Customer Segment
        </h2>
        <div className="space-y-4">
          {filteredSegments.map((segment) => (
            <div key={segment.segment} className="border border-gray-200 rounded p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">{segment.segment}</h3>
                <span className="text-sm text-gray-600">
                  {segment.recommendations.toLocaleString()} recommendations
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`p-3 rounded border ${getStatusColor(
                    segment.coverage,
                    thresholds.coverage || 0.8
                  )}`}
                >
                  <p className="text-xs font-medium mb-1">Coverage</p>
                  <p className="text-lg font-bold">
                    {getStatusIcon(
                      segment.coverage,
                      thresholds.coverage || 0.8
                    )} {(segment.coverage * 100).toFixed(1)}%
                  </p>
                </div>
                <div
                  className={`p-3 rounded border ${getStatusColor(
                    segment.ctr,
                    thresholds.ctr || 0.05
                  )}`}
                >
                  <p className="text-xs font-medium mb-1">Click-Through Rate</p>
                  <p className="text-lg font-bold">
                    {getStatusIcon(segment.ctr, thresholds.ctr || 0.05)} {(segment.ctr * 100).toFixed(2)}%
                  </p>
                </div>
                <div
                  className={`p-3 rounded border ${getStatusColor(
                    segment.conversion,
                    thresholds.conversion || 0.02
                  )}`}
                >
                  <p className="text-xs font-medium mb-1">Conversion</p>
                  <p className="text-lg font-bold">
                    {getStatusIcon(
                      segment.conversion,
                      thresholds.conversion || 0.02
                    )} {(segment.conversion * 100).toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${segment.coverage * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Algorithm Performance</h2>
        <div className="space-y-4">
          {algorithmMetrics
            .filter((a) => !algorithmType || a.type === algorithmType)
            .map((algo) => (
              <div key={algo.type} className="border border-gray-200 rounded p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-900">{algo.type}</h3>
                  <span
                    className={`text-sm font-bold ${
                      algo.trend > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {algo.trend > 0 ? "▲" : "▼"} {Math.abs(algo.trend * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={`p-3 rounded border ${getStatusColor(
                      algo.effectiveness,
                      thresholds.performance || 0.75
                    )}`}
                  >
                    <p className="text-xs font-medium mb-1">Effectiveness</p>
                    <p className="text-lg font-bold">
                      {getStatusIcon(
                        algo.effectiveness,
                        thresholds.performance || 0.75
                      )} {(algo.effectiveness * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 rounded border border-gray-300 bg-gray-50">
                    <p className="text-xs font-medium text-gray-700 mb-1">Coverage</p>
                    <p className="text-lg font-bold text-gray-900">
                      {(algo.coverage * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 rounded border border-gray-300 bg-gray-50">
                    <p className="text-xs font-medium text-gray-700 mb-1">Avg CTR</p>
                    <p className="text-lg font-bold text-gray-900">
                      {(algo.avgCtr * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${algo.effectiveness * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
        <p className="text-sm text-gray-700">
          ◆ Dashboard updates every {refreshInterval / 1000} seconds | Time Range: {timeRange}
          {segmentFilter?.length > 0 && ` | Segments: ${segmentFilter.join(", ")}`}
          {algorithmType && ` | Algorithm: ${algorithmType}`}
        </p>
      </div>
    </div>
  );
};

export default RecommendationHealthMonitor;
