import React from "react";

interface Segment {
  id: string;
  name: string;
  [key: string]: any;
}

interface Metrics {
  [segmentId: string]: {
    feedbackRate: number;
    contentInteraction: number;
    campaignResponse: number;
  };
}

interface SegmentEngagementHeatmapProps {
  segments: Segment[];
  metrics: Metrics;
  dateRange?: string;
  threshold?: number;
  onSegmentClick?: (segmentId: string) => void;
}

const SegmentEngagementHeatmap: React.FC<SegmentEngagementHeatmapProps> = ({
  segments,
  metrics,
  dateRange,
  threshold = 0.3,
  onSegmentClick,
}) => {
  const metricLabels = ["Feedback Rate", "Content Interaction", "Campaign Response"];
  const metricKeys: (keyof typeof metrics[string])[] = [
    "feedbackRate",
    "contentInteraction",
    "campaignResponse",
  ];

  const getColorClass = (value: number): string => {
    if (value >= 0.8) return "bg-green-600";
    if (value >= 0.6) return "bg-green-400";
    if (value >= 0.4) return "bg-yellow-400";
    if (value >= threshold) return "bg-orange-400";
    return "bg-red-400";
  };

  const getTextColor = (value: number): string => {
    if (value >= 0.4) return "text-gray-900";
    return "text-white";
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg overflow-x-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Segment Engagement Heatmap</h2>
        {dateRange && <p className="text-sm text-gray-600 mt-1">Period: {dateRange}</p>}
      </div>

      <div className="min-w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 border-b-2 border-gray-300 w-32">
                Segment
              </th>
              {metricLabels.map((label) => (
                <th
                  key={label}
                  className="p-3 text-center text-sm font-semibold text-gray-700 border-b-2 border-gray-300"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {segments.map((segment) => {
              const segmentMetrics = metrics[segment.id];
              return (
                <tr key={segment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-sm font-medium text-gray-800 border-b border-gray-200">
                    <button
                      onClick={() => onSegmentClick?.(segment.id)}
                      className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left w-full"
                    >
                      {segment.name}
                    </button>
                  </td>
                  {metricKeys.map((metricKey) => {
                    const value = segmentMetrics?.[metricKey] ?? 0;
                    const isUnderEngaged = value < threshold;
                    return (
                      <td key={`${segment.id}-${metricKey}`} className="p-2 text-center border-b border-gray-200">
                        <div
                          className={`${getColorClass(value)} ${getTextColor(value)} rounded-md p-3 font-semibold text-sm transition-all hover:shadow-md cursor-pointer`}
                          title={`${(value * 100).toFixed(1)}%`}
                        >
                          <span className="flex items-center justify-center gap-1">
                            {isUnderEngaged ? "⚠️" : "✓"}
                            {(value * 100).toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-600 rounded"></div>
          <span className="text-gray-700">Excellent (80%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-400 rounded"></div>
          <span className="text-gray-700">Good (60-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 rounded"></div>
          <span className="text-gray-700">Fair (40-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-400 rounded"></div>
          <span className="text-gray-700">Low ({threshold * 100}%-40%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-400 rounded"></div>
          <span className="text-gray-700">Critical (below {threshold * 100}%)</span>
        </div>
      </div>
    </div>
  );
};

export default SegmentEngagementHeatmap;
