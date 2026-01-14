import React from "react";

interface DateRange {
  startDate: string;
  endDate: string;
}

interface FeedbackCollectionHeatmapProps {
  campaignIds?: string[];
  segmentIds?: string[];
  dateRange: DateRange;
  sentimentBreakdown?: boolean;
  showAlerts?: boolean;
}

interface FeedbackDataPoint {
  date: string;
  campaign: string;
  segment: string;
  volume: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  engagementRate: number;
}

const FeedbackCollectionHeatmap: React.FC<FeedbackCollectionHeatmapProps> = ({
  campaignIds = [],
  segmentIds = [],
  dateRange,
  sentimentBreakdown = false,
  showAlerts = true,
}) => {
  const [feedbackData] = React.useState<FeedbackDataPoint[]>([
    {
      date: "2025-01-01",
      campaign: "Spring Launch",
      segment: "Premium",
      volume: 145,
      sentiment: { positive: 89, neutral: 36, negative: 20 },
      engagementRate: 0.85,
    },
    {
      date: "2025-01-01",
      campaign: "Spring Launch",
      segment: "Standard",
      volume: 78,
      sentiment: { positive: 42, neutral: 24, negative: 12 },
      engagementRate: 0.62,
    },
    {
      date: "2025-01-02",
      campaign: "Spring Launch",
      segment: "Premium",
      volume: 0,
      sentiment: { positive: 0, neutral: 0, negative: 0 },
      engagementRate: 0,
    },
    {
      date: "2025-01-02",
      campaign: "Holiday Promo",
      segment: "Standard",
      volume: 156,
      sentiment: { positive: 98, neutral: 41, negative: 17 },
      engagementRate: 0.91,
    },
  ]);

  const getHeatmapColor = (volume: number, maxVolume: number): string => {
    if (volume === 0) return "bg-gray-100";
    const intensity = volume / maxVolume;
    if (intensity < 0.2) return "bg-blue-100";
    if (intensity < 0.4) return "bg-blue-300";
    if (intensity < 0.6) return "bg-blue-500";
    if (intensity < 0.8) return "bg-blue-700";
    return "bg-blue-900";
  };

  const getSentimentColor = (positive: number, total: number): string => {
    if (total === 0) return "bg-gray-50";
    const positiveRatio = positive / total;
    if (positiveRatio > 0.7) return "bg-green-100";
    if (positiveRatio > 0.5) return "bg-yellow-100";
    return "bg-red-100";
  };

  const uniqueCampaigns = Array.from(
    new Set(feedbackData.map((d) => d.campaign))
  );
  const uniqueSegments = Array.from(
    new Set(feedbackData.map((d) => d.segment))
  );
  const uniqueDates = Array.from(new Set(feedbackData.map((d) => d.date)));

  const maxVolume = Math.max(...feedbackData.map((d) => d.volume), 1);

  const getDataPoint = (
    date: string,
    campaign: string,
    segment: string
  ): FeedbackDataPoint | undefined => {
    return feedbackData.find(
      (d) => d.date === date && d.campaign === campaign && d.segment === segment
    );
  };

  const filteredCampaigns =
    campaignIds.length > 0
      ? uniqueCampaigns.filter((c) => campaignIds.includes(c))
      : uniqueCampaigns;

  const filteredSegments =
    segmentIds.length > 0
      ? uniqueSegments.filter((s) => segmentIds.includes(s))
      : uniqueSegments;

  const collectionGaps = feedbackData.filter((d) => d.volume === 0);
  const lowEngagementPoints = feedbackData.filter((d) => d.engagementRate < 0.5);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Feedback Collection Heatmap
        </h1>
        <p className="text-sm text-gray-600">
          📊 Visualizing feedback volume and sentiment patterns across{" "}
          {filteredCampaigns.length} campaign(s) and {filteredSegments.length}{" "}
          segment(s)
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Period: {dateRange.startDate} to {dateRange.endDate}
        </p>
      </div>

      {showAlerts && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {collectionGaps.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-1">
                ⚠️ Collection Gaps Detected
              </p>
              <p className="text-xs text-yellow-800">
                {collectionGaps.length} data point(s) with zero feedback volume
              </p>
            </div>
          )}
          {lowEngagementPoints.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-orange-900 mb-1">
                ⚡ Low Engagement Alerts
              </p>
              <p className="text-xs text-orange-800">
                {lowEngagementPoints.length} segment(s) below 50% engagement
              </p>
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-gray-50 border border-gray-200 p-3 text-left text-xs font-semibold text-gray-700 w-32">
                Campaign / Segment
              </th>
              {uniqueDates.map((date) => (
                <th
                  key={date}
                  className="bg-gray-50 border border-gray-200 p-3 text-center text-xs font-semibold text-gray-700 min-w-24"
                >
                  {date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredCampaigns.map((campaign) =>
              filteredSegments.map((segment) => (
                <tr key={`${campaign}-${segment}`}>
                  <td className="sticky left-0 bg-gray-50 border border-gray-200 p-3 text-sm font-medium text-gray-900">
                    <div className="font-semibold">{campaign}</div>
                    <div className="text-xs text-gray-500">{segment}</div>
                  </td>
                  {uniqueDates.map((date) => {
                    const dataPoint = getDataPoint(date, campaign, segment);
                    const bgColor = dataPoint
                      ? sentimentBreakdown
                        ? getSentimentColor(
                            dataPoint.sentiment.positive,
                            dataPoint.volume
                          )
                        : getHeatmapColor(dataPoint.volume, maxVolume)
                      : "bg-gray-50";

                    return (
                      <td
                        key={`${campaign}-${segment}-${date}`}
                        className={`border border-gray-200 p-3 text-center ${bgColor} hover:opacity-80 transition-opacity cursor-pointer`}
                      >
                        {dataPoint && dataPoint.volume > 0 ? (
                          <div className="text-sm">
                            <div className="font-bold text-gray-900">
                              {dataPoint.volume}
                            </div>
                            {sentimentBreakdown && (
                              <div className="text-xs text-gray-600 mt-1">
                                <div>
                                  ✓ {dataPoint.sentiment.positive.toString()}
                                </div>
                                <div>
                                  — {dataPoint.sentiment.neutral.toString()}
                                </div>
                                <div>
                                  ✗ {dataPoint.sentiment.negative.toString()}
                                </div>
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              {(dataPoint.engagementRate * 100).toFixed(0)}%
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-xs">— No data</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            📈 Volume Intensity Legend
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-xs text-gray-700">No feedback</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded"></div>
              <span className="text-xs text-gray-700">Low (0-20%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-700">Medium (40-60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-900 rounded"></div>
              <span className="text-xs text-gray-700">High (80%+)</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            📊 Summary Metrics
          </h3>
          <div className="space-y-2 text-xs text-gray-700">
            <p>
              <span className="font-medium">Total Feedback:</span>{" "}
              {feedbackData.reduce((sum, d) => sum + d.volume, 0)}
            </p>
            <p>
              <span className="font-medium">Avg Engagement:</span>{" "}
              {(
                feedbackData.reduce((sum, d) => sum + d.engagementRate, 0) /
                feedbackData.length
              ).toFixed(1)}
              %
            </p>
            <p>
              <span className="font-medium">Data Coverage:</span>{" "}
              {(
                ((feedbackData.length - collectionGaps.length) /
                  feedbackData.length) *
                100
              ).toFixed(0)}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCollectionHeatmap;
