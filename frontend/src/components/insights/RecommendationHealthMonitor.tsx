import React from "react";

interface EngineStatus {
  isHealthy: boolean;
  uptime: number;
  lastUpdate: string;
  activeRecommendations: number;
  errorRate: number;
}

interface Metrics {
  qualityScore: number;
  conversionRate: number;
  customerSatisfaction: number;
  recommendationAccuracy: number;
  engagementRate: number;
  avgResponseTime: number;
}

interface RecommendationHealthMonitorProps {
  engineStatus: EngineStatus;
  metrics: Metrics;
  contentGenerationRate: number;
  alertThreshold?: number;
  timeWindow?: string;
}

const RecommendationHealthMonitor: React.FC<RecommendationHealthMonitorProps> = ({
  engineStatus,
  metrics,
  contentGenerationRate,
  alertThreshold = 0.7,
  timeWindow = "24h",
}) => {
  const getStatusColor = (value: number, threshold: number = alertThreshold) => {
    if (value >= threshold) return "text-green-600";
    if (value >= threshold * 0.8) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBgColor = (value: number, threshold: number = alertThreshold) => {
    if (value >= threshold) return "bg-green-50 border-green-200";
    if (value >= threshold * 0.8) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getStatusIndicator = (value: number, threshold: number = alertThreshold) => {
    if (value >= threshold) return "● Online";
    if (value >= threshold * 0.8) return "● Warning";
    return "● Offline";
  };

  const formatUptime = (uptime: number) => {
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Recommendation Health Monitor
          </h1>
          <p className="text-slate-400 text-lg">
            Real-time AI Engine Health Dashboard • {timeWindow}
          </p>
        </div>

        {/* Engine Status Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className={`p-6 rounded-lg border-2 ${getStatusBgColor(engineStatus.isHealthy ? 1 : 0)}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                Engine Status
              </h2>
              <span className={`text-2xl ${getStatusColor(engineStatus.isHealthy ? 1 : 0)}`}>
                {getStatusIndicator(engineStatus.isHealthy ? 1 : 0)}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 dark:text-slate-300">Uptime</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {formatUptime(engineStatus.uptime)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700 dark:text-slate-300">Active Recommendations</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {engineStatus.activeRecommendations.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700 dark:text-slate-300">Error Rate</span>
                <span className={`font-mono font-semibold ${getStatusColor(1 - engineStatus.errorRate)}`}>
                  {formatPercentage(engineStatus.errorRate)}
                </span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-3">
                Last updated: {engineStatus.lastUpdate}
              </div>
            </div>
          </div>

          {/* Content Generation Card */}
          <div className={`p-6 rounded-lg border-2 ${getStatusBgColor(contentGenerationRate)}`}>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
              Content Generation
            </h2>
            <div className="text-center">
              <div className={`text-5xl font-bold ${getStatusColor(contentGenerationRate)} mb-2`}>
                {(contentGenerationRate * 100).toFixed(0)}%
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-4">Generation Rate</p>
              <div className="w-full bg-slate-300 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    contentGenerationRate >= alertThreshold
                      ? "bg-green-500"
                      : contentGenerationRate >= alertThreshold * 0.8
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${contentGenerationRate * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-slate-700 border-2 border-slate-600 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Quality Score</span>
                <span className={`font-semibold ${getStatusColor(metrics.qualityScore)}`}>
                  {(metrics.qualityScore * 100).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Satisfaction</span>
                <span className={`font-semibold ${getStatusColor(metrics.customerSatisfaction)}`}>
                  {(metrics.customerSatisfaction * 100).toFixed(0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Conversion Rate</span>
                <span className={`font-semibold ${getStatusColor(metrics.conversionRate)}`}>
                  {(metrics.conversionRate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quality Score */}
          <div className="bg-slate-700 border-2 border-slate-600 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Recommendation Accuracy</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <div className="mb-3">
              <div className="text-4xl font-bold text-white mb-2">
                {(metrics.recommendationAccuracy * 100).toFixed(1)}%
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="h-2 bg-blue-500 rounded-full"
                  style={{ width: `${metrics.recommendationAccuracy * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-slate-400">Prediction accuracy rate</p>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-slate-700 border-2 border-slate-600 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Customer Satisfaction</h3>
              <span className="text-2xl">😊</span>
            </div>
            <div className="mb-3">
              <div className="text-4xl font-bold text-white mb-2">
                {(metrics.customerSatisfaction * 100).toFixed(0)}%
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="h-2 bg-purple-500 rounded-full"
                  style={{ width: `${metrics.customerSatisfaction * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-slate-400">Average customer rating</p>
          </div>

          {/* Engagement Rate */}
          <div className="bg-slate-700 border-2 border-slate-600 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Engagement Rate</h3>
              <span className="text-2xl">💬</span>
            </div>
            <div className="mb-3">
              <div className="text-4xl font-bold text-white mb-2">
                {(metrics.engagementRate * 100).toFixed(1)}%
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="h-2 bg-pink-500 rounded-full"
                  style={{ width: `${metrics.engagementRate * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-slate-400">Customer interaction rate</p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-slate-700 border-2 border-slate-600 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Conversion Rate</h3>
              <span className="text-2xl">💰</span>
            </div>
            <div className="mb-3">
              <div className="text-4xl font-bold text-white mb-2">
                {(metrics.conversionRate * 100).toFixed(2)}%
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="h-2 bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(metrics.conversionRate * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-slate-400">Recommendation conversions</p>
          </div>

          {/* Quality Score */}
          <div className="bg-slate-700 border-2 border-slate-600 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Quality Score</h3>
              <span className="text-2xl">⭐</span>
            </div>
            <div className="mb-3">
              <div className="text-4xl font-bold text-white mb-2">
                {(metrics.qualityScore * 100).toFixed(0)}%
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="h-2 bg-yellow-500 rounded-full"
                  style={{ width: `${metrics.qualityScore * 100}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-slate-400">Overall recommendation quality</p>
          </div>

          {/* Response Time */}
          <div className="bg-slate-700 border-2 border-slate-600 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">Response Time</h3>
              <span className="text-2xl">⚡</span>
            </div>
            <div className="mb-3">
              <div className="text-4xl font-bold text-white mb-2">
                {metrics.avgResponseTime.toFixed(0)}
                <span className="text-lg text-slate-400">ms</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="h-2 bg-cyan-500 rounded-full"
                  style={{ width: `${Math.min((metrics.avgResponseTime / 1000) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-slate-400">Average engine latency</p>
          </div>
        </div>

        {/* Health Status Footer */}
        <div className="mt-6 p-4 bg-slate-700 border-2 border-slate-600 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {engineStatus.isHealthy && metrics.qualityScore >= alertThreshold
                  ? "✅"
                  : metrics.qualityScore >= alertThreshold * 0.8
                    ? "⚠️"
                    : "❌"}
              </span>
              <div>
                <p className="text-white font-semibold">
                  {engineStatus.isHealthy && metrics.qualityScore >= alertThreshold
                    ? "All Systems Nominal"
                    : metrics.qualityScore >= alertThreshold * 0.8
                      ? "Performance Degradation Detected"
                      : "Critical Issues Detected"}
                </p>
                <p className="text-slate-400 text-sm">
                  Engine: {engineStatus.isHealthy ? "Running" : "Offline"} • Quality: {formatPercentage(metrics.qualityScore)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-300 text-sm">Threshold: {formatPercentage(alertThreshold)}</p>
              <p className="text-slate-400 text-xs">Monitoring active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationHealthMonitor;
