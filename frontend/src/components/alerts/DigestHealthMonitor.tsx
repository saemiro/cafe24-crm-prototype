import React from "react";

interface DigestHealthMonitorProps {
  totalDigests: number;
  emptyDigests: number;
  contentRate: number;
  lastSuccessfulDigest?: string;
  pipelineStatus: string;
}

const DigestHealthMonitor: React.FC<DigestHealthMonitorProps> = ({
  totalDigests,
  emptyDigests,
  contentRate,
  lastSuccessfulDigest,
  pipelineStatus,
}) => {
  const emptyPercentage =
    totalDigests > 0 ? ((emptyDigests / totalDigests) * 100).toFixed(1) : 0;
  const healthScore = Math.max(0, 100 - parseFloat(emptyPercentage as string));

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "healthy":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthIndicator = (score: number): string => {
    if (score >= 90) return "✓";
    if (score >= 70) return "⚠";
    return "✕";
  };

  const getContentRateStatus = (rate: number): string => {
    if (rate >= 0.8) return "Excellent";
    if (rate >= 0.6) return "Good";
    if (rate >= 0.4) return "Fair";
    return "Poor";
  };

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 rounded-lg border-2 ${getStatusColor(pipelineStatus)}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Digest Health Monitor</h1>
            <p className="text-sm text-gray-600 mt-1">Pipeline performance and content generation tracking</p>
          </div>
          <div className="text-right">
            <div className={`inline-block px-4 py-2 rounded-full ${getStatusBadgeColor(pipelineStatus)}`}>
              <span className="font-semibold">{pipelineStatus}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Health Score</span>
              <span className="text-2xl">{getHealthIndicator(healthScore)}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{healthScore.toFixed(1)}</span>
              <span className="text-gray-500">/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className={`h-2 rounded-full transition-all ${
                  healthScore >= 90
                    ? "bg-green-500"
                    : healthScore >= 70
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${healthScore}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Empty Digests</span>
              <span className="text-2xl">⚠</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{emptyDigests}</span>
              <span className="text-gray-500">of {totalDigests}</span>
            </div>
            <div className="text-sm text-gray-600 mt-2">{emptyPercentage}% empty rate</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Content Generation Rate</span>
              <span className="text-2xl">📊</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{(contentRate * 100).toFixed(1)}%</span>
            </div>
            <div className="text-sm text-gray-600 mt-2">{getContentRateStatus(contentRate)}</div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Last Successful Digest</span>
              <span className="text-2xl">🕐</span>
            </div>
            <div className="text-sm text-gray-900 mt-2">
              {lastSuccessfulDigest ? (
                <div>
                  <p className="font-mono text-xs">{lastSuccessfulDigest}</p>
                  <p className="text-gray-500 text-xs mt-1">✓ Pipeline operational</p>
                </div>
              ) : (
                <p className="text-gray-500">No successful digests yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📈</span>
            <h3 className="font-semibold text-gray-900">Pipeline Summary</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Total Digests</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{totalDigests}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Success Rate</div>
              <div className="text-2xl font-bold text-green-600 mt-1">
                {totalDigests > 0 ? ((((totalDigests - emptyDigests) / totalDigests) * 100).toFixed(1)) : "0"}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="text-lg font-semibold text-gray-900 mt-1 capitalize">{pipelineStatus}</div>
            </div>
          </div>
        </div>

        {parseFloat(emptyPercentage as string) > 20 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-yellow-900">High Empty Digest Rate</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  Currently {emptyPercentage}% of digests are empty. Investigate data collection or content generation issues.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DigestHealthMonitor;
