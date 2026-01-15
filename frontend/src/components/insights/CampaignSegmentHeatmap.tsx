import React from "react";

interface Campaign {
  id: string;
  name: string;
}

interface Segment {
  id: string;
  name: string;
}

interface DateRange {
  start?: string;
  end?: string;
}

interface CampaignSegmentHeatmapProps {
  campaigns: Campaign[];
  segments: Segment[];
  metric: string;
  dateRange?: DateRange;
  onCellClick?: (campaignId: string, segmentId: string, value: number) => void;
}

const CampaignSegmentHeatmap: React.FC<CampaignSegmentHeatmapProps> = ({
  campaigns,
  segments,
  metric,
  dateRange,
  onCellClick,
}) => {
  const generateHeatmapValue = (campaignId: string, segmentId: string): number => {
    const hash = campaignId.charCodeAt(0) + segmentId.charCodeAt(0);
    return (hash % 101) / 100;
  };

  const getColorClass = (value: number): string => {
    if (value >= 0.8) return "bg-red-600";
    if (value >= 0.6) return "bg-orange-500";
    if (value >= 0.4) return "bg-yellow-400";
    if (value >= 0.2) return "bg-lime-300";
    return "bg-emerald-100";
  };

  const getMetricDisplay = (metric: string): string => {
    const metricMap: Record<string, string> = {
      "conversion_rate": "Conversion Rate",
      "engagement": "Engagement",
      "revenue": "Revenue",
    };
    return metricMap[metric] || metric;
  };

  const maxSegments = segments.length;
  const maxCampaigns = campaigns.length;
  const isLargeDataset = maxSegments > 10 || maxCampaigns > 10;

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Campaign Performance Heatmap
        </h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-semibold">{getMetricDisplay(metric)}</span>
          {dateRange && (
            <span>
              📅 {dateRange.start || "Any"} to {dateRange.end || "Any"}
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">
                Segment
              </th>
              {campaigns.map((campaign) => (
                <th
                  key={campaign.id}
                  className="px-3 py-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200 whitespace-nowrap"
                >
                  {isLargeDataset ? campaign.name.substring(0, 10) : campaign.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {segments.map((segment, segmentIdx) => (
              <tr
                key={segment.id}
                className={`${segmentIdx % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-200 hover:bg-blue-50 transition-colors`}
              >
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200 bg-gray-50">
                  {isLargeDataset ? segment.name.substring(0, 15) : segment.name}
                </th>
                {campaigns.map((campaign) => {
                  const value = generateHeatmapValue(campaign.id, segment.id);
                  const percentage = Math.round(value * 100);

                  return (
                    <td
                      key={`${campaign.id}-${segment.id}`}
                      className={`px-3 py-3 text-center cursor-pointer transition-all hover:shadow-md ${getColorClass(value)} border-r border-gray-200`}
                      onClick={() =>
                        onCellClick?.(campaign.id, segment.id, value)
                      }
                      title={`${campaign.name} - ${segment.name}: ${percentage}%`}
                    >
                      <span className="text-sm font-semibold text-gray-800">
                        {percentage}%
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center gap-8">
        <div className="text-sm font-medium text-gray-700">Scale:</div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-emerald-100 border border-gray-300 rounded"></div>
            <span className="text-xs text-gray-600">0-20%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-lime-300 border border-gray-300 rounded"></div>
            <span className="text-xs text-gray-600">20-40%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-400 border border-gray-300 rounded"></div>
            <span className="text-xs text-gray-600">40-60%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 border border-gray-300 rounded"></div>
            <span className="text-xs text-gray-600">60-80%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 border border-gray-300 rounded"></div>
            <span className="text-xs text-gray-600">80-100%</span>
          </div>
        </div>
      </div>

      {campaigns.length === 0 || segments.length === 0 ? (
        <div className="mt-8 p-8 text-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {campaigns.length === 0
              ? "No campaigns available"
              : "No segments available"}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default CampaignSegmentHeatmap;
