import React from "react";

interface Segment {
  id: string;
  name: string;
  count: number;
  growth?: number;
}

interface SegmentDistributionCardProps {
  segments: Segment[];
  totalCustomers: number;
  showTrends?: boolean;
  onSegmentClick?: (segmentId: string) => void;
}

const SegmentDistributionCard: React.FC<SegmentDistributionCardProps> = ({
  segments,
  totalCustomers,
  showTrends = false,
  onSegmentClick,
}) => {
  const getPercentage = (count: number): number => {
    return totalCustomers > 0 ? (count / totalCustomers) * 100 : 0;
  };

  const getTrendIcon = (growth?: number): string => {
    if (!growth) return "-";
    return growth > 0 ? "↑" : growth < 0 ? "↓" : "→";
  };

  const getTrendColor = (growth?: number): string => {
    if (!growth) return "text-gray-500";
    return growth > 0 ? "text-green-600" : growth < 0 ? "text-red-600" : "text-gray-500";
  };

  const sortedSegments = [...segments].sort((a, b) => b.count - a.count);

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Segment Distribution</h2>
        <p className="text-gray-600 text-sm mt-1">Total Customers: {totalCustomers.toLocaleString()}</p>
      </div>

      <div className="space-y-4">
        {sortedSegments.map((segment) => {
          const percentage = getPercentage(segment.count);
          const trendIcon = getTrendIcon(segment.growth);
          const trendColor = getTrendColor(segment.growth);

          return (
            <div
              key={segment.id}
              onClick={() => onSegmentClick?.(segment.id)}
              className={`p-4 border border-gray-200 rounded-lg transition-all ${
                onSegmentClick ? "cursor-pointer hover:border-blue-400 hover:shadow-md" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{segment.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    {segment.count.toLocaleString()}
                  </span>
                  {showTrends && segment.growth !== undefined && (
                    <span className={`text-sm font-semibold ${trendColor}`}>
                      {trendIcon} {Math.abs(segment.growth).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{percentage.toFixed(1)}% of total</span>
                {onSegmentClick && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSegmentClick(segment.id);
                    }}
                    className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100 transition-colors"
                  >
                    Campaign →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {segments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">No segments available</p>
          <p className="text-sm">Add customer segments to get started</p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-800">{segments.length}</p>
            <p className="text-xs text-gray-600">Total Segments</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {segments.length > 0 ? (getPercentage(segments[0].count).toFixed(1)) : "0"}%
            </p>
            <p className="text-xs text-gray-600">Largest Segment</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-800">
              {segments.length > 0 ? (getPercentage(segments[segments.length - 1].count).toFixed(1)) : "0"}%
            </p>
            <p className="text-xs text-gray-600">Smallest Segment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentDistributionCard;
