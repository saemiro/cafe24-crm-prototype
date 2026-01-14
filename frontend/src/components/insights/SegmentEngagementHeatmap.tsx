import React from "react";

interface Segment {
  id: string;
  name: string;
}

interface Campaign {
  id: string;
  name: string;
}

interface EngagementScore {
  [segmentId: string]: {
    [campaignId: string]: number;
  };
}

interface SegmentEngagementHeatmapProps {
  segments: Segment[];
  campaigns: Campaign[];
  engagementData: EngagementScore;
  alertThreshold?: number;
  onSegmentClick?: (segmentId: string) => void;
}

const SegmentEngagementHeatmap: React.FC<SegmentEngagementHeatmapProps> = ({
  segments,
  campaigns,
  engagementData,
  alertThreshold = 0.4,
  onSegmentClick,
}) => {
  const getEngagementScore = (segmentId: string, campaignId: string): number => {
    return engagementData[segmentId]?.[campaignId] ?? 0;
  };

  const getColorClass = (score: number): string => {
    if (score >= 0.8) return "bg-green-600";
    if (score >= 0.6) return "bg-green-400";
    if (score >= 0.4) return "bg-yellow-400";
    if (score >= 0.2) return "bg-orange-400";
    return "bg-red-500";
  };

  const getAlertIcon = (score: number): string => {
    if (score < alertThreshold) return "⚠";
    return "";
  };

  const calculateAverageEngagement = (segmentId: string): number => {
    const scores = campaigns.map((campaign) =>
      getEngagementScore(segmentId, campaign.id)
    );
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  };

  const calculateCampaignAverage = (campaignId: string): number => {
    const scores = segments.map((segment) =>
      getEngagementScore(segment.id, campaignId)
    );
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg overflow-x-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Segment Engagement Heatmap
        </h2>
        <p className="text-gray-600">
          Customer engagement levels across segments and campaigns
        </p>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <span className="text-sm text-gray-700">High (80%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <span className="text-sm text-gray-700">Good (60-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-400 rounded"></div>
          <span className="text-sm text-gray-700">Fair (40-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-400 rounded"></div>
          <span className="text-sm text-gray-700">Low (20-40%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-700">Critical (&lt;20%)</span>
        </div>
      </div>

      <div className="inline-block border border-gray-300 rounded">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 p-3 text-left font-semibold text-gray-700 min-w-48">
                Segment
              </th>
              {campaigns.map((campaign) => (
                <th
                  key={campaign.id}
                  className="border border-gray-300 bg-gray-100 p-3 text-center font-semibold text-gray-700 min-w-32"
                >
                  <div className="text-sm">{campaign.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {(calculateCampaignAverage(campaign.id) * 100).toFixed(0)}%
                  </div>
                </th>
              ))}
              <th className="border border-gray-300 bg-gray-100 p-3 text-center font-semibold text-gray-700 min-w-32">
                Avg
              </th>
            </tr>
          </thead>
          <tbody>
            {segments.map((segment) => {
              const avgEngagement = calculateAverageEngagement(segment.id);
              const isLowEngagement = avgEngagement < alertThreshold;

              return (
                <tr
                  key={segment.id}
                  className={isLowEngagement ? "bg-red-50" : "hover:bg-gray-50"}
                >
                  <td
                    className="border border-gray-300 p-3 font-medium text-gray-800 cursor-pointer hover:bg-blue-100"
                    onClick={() => onSegmentClick?.(segment.id)}
                  >
                    <div className="flex items-center gap-2">
                      {isLowEngagement && (
                        <span className="text-lg" title="Low engagement alert">
                          ⚠
                        </span>
                      )}
                      <span>{segment.name}</span>
                    </div>
                  </td>
                  {campaigns.map((campaign) => {
                    const score = getEngagementScore(segment.id, campaign.id);
                    const alert = getAlertIcon(score);

                    return (
                      <td
                        key={`${segment.id}-${campaign.id}`}
                        className={`border border-gray-300 p-3 text-center font-semibold text-white ${getColorClass(score)} cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg">
                            {(score * 100).toFixed(0)}%
                          </span>
                          {alert && (
                            <span className="text-base" title="Below threshold">
                              {alert}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="border border-gray-300 p-3 text-center font-semibold text-gray-800 bg-gray-50">
                    {(avgEngagement * 100).toFixed(0)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Alert Threshold:</strong> {(alertThreshold * 100).toFixed(0)}%
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Segments with average engagement below the threshold are highlighted in red.
          Click on a segment name to view detailed interactions.
        </p>
      </div>
    </div>
  );
};

export default SegmentEngagementHeatmap;
