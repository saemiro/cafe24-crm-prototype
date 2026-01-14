import React from "react";

interface Entity {
  name: string;
  completeness: number;
  quality: number;
  recordCount: number;
  lastUpdated: string;
}

interface DataQualityMonitorProps {
  entities: Entity[];
  qualityThreshold?: number;
  timeRange?: string;
  onAlertClick?: (entity: Entity) => void;
}

const DataQualityMonitor: React.FC<DataQualityMonitorProps> = ({
  entities,
  qualityThreshold = 85,
  timeRange = "24h",
  onAlertClick,
}) => {
  const getStatusColor = (value: number) => {
    if (value >= qualityThreshold) return "text-green-600";
    if (value >= qualityThreshold - 10) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIndicator = (value: number) => {
    if (value >= qualityThreshold) return "●";
    if (value >= qualityThreshold - 10) return "◐";
    return "○";
  };

  const getStatusBg = (value: number) => {
    if (value >= qualityThreshold) return "bg-green-50 border-green-200";
    if (value >= qualityThreshold - 10) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const pipelineHealthScore =
    entities.length > 0
      ? Math.round(
          entities.reduce((sum, e) => sum + (e.completeness + e.quality) / 2, 0) /
            entities.length
        )
      : 0;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Data Quality Monitor
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Time Range:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {timeRange}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Pipeline Health</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">
                {pipelineHealthScore}%
              </span>
              <span className="text-xl text-blue-500">
                {pipelineHealthScore >= qualityThreshold ? "✓" : "⚠"}
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-gray-600 mb-1">Entities</div>
            <div className="text-3xl font-bold text-green-600">
              {entities.length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="text-sm text-gray-600 mb-1">Total Records</div>
            <div className="text-3xl font-bold text-purple-600">
              {entities.reduce((sum, e) => sum + e.recordCount, 0).toLocaleString()}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="text-sm text-gray-600 mb-1">Quality Threshold</div>
            <div className="text-3xl font-bold text-orange-600">
              {qualityThreshold}%
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {entities.map((entity, index) => {
          const avgScore = (entity.completeness + entity.quality) / 2;
          const isAlert = avgScore < qualityThreshold;

          return (
            <div
              key={index}
              className={`border-2 rounded-lg p-4 transition-all ${getStatusBg(
                avgScore
              )} ${isAlert && onAlertClick ? "cursor-pointer hover:shadow-md" : ""}`}
              onClick={() => isAlert && onAlertClick?.(entity)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-2xl ${getStatusColor(avgScore)}`}>
                    {getStatusIndicator(avgScore)}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {entity.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Last updated: {entity.lastUpdated}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {entity.recordCount.toLocaleString()} records
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-700">
                      Completeness
                    </label>
                    <span
                      className={`text-sm font-bold ${getStatusColor(
                        entity.completeness
                      )}`}
                    >
                      {entity.completeness}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        entity.completeness >= qualityThreshold
                          ? "bg-green-500"
                          : entity.completeness >= qualityThreshold - 10
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${entity.completeness}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium text-gray-700">
                      Quality Score
                    </label>
                    <span
                      className={`text-sm font-bold ${getStatusColor(
                        entity.quality
                      )}`}
                    >
                      {entity.quality}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        entity.quality >= qualityThreshold
                          ? "bg-green-500"
                          : entity.quality >= qualityThreshold - 10
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${entity.quality}%` }}
                    />
                  </div>
                </div>
              </div>

              {isAlert && (
                <div className="mt-3 text-xs font-medium text-red-700 flex items-center gap-1">
                  ⚠ Alert: Quality below threshold
                </div>
              )}
            </div>
          );
        })}
      </div>

      {entities.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-500 text-lg">
            No entities available to monitor
          </p>
        </div>
      )}
    </div>
  );
};

export default DataQualityMonitor;
