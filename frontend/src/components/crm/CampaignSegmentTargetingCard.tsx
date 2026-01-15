import React from "react";

interface Segment {
  id: string;
  name: string;
  size: number;
  conversionRate: number;
  engagement: number;
  recommended: boolean;
}

interface Metrics {
  totalConversions: number;
  avgEngagement: number;
  topPerformingSegment: string;
  improvementOpportunities: number;
}

interface CampaignSegmentTargetingCardProps {
  campaignId: string;
  segments: Segment[];
  metrics: Metrics;
  showRecommendations?: boolean;
}

const CampaignSegmentTargetingCard: React.FC<
  CampaignSegmentTargetingCardProps
> = ({
  campaignId,
  segments,
  metrics,
  showRecommendations = false,
}) => {
  const sortedSegments = [...segments].sort(
    (a, b) => b.conversionRate - a.conversionRate
  );

  const recommendedSegments = segments.filter((seg) => seg.recommended);

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Campaign Segment Performance
          </h2>
          <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            ID: {campaignId}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Total Conversions</p>
            <p className="text-2xl font-bold text-green-600">
              {metrics.totalConversions}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Avg Engagement</p>
            <p className="text-2xl font-bold text-blue-600">
              {metrics.avgEngagement.toFixed(1)}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Top Segment</p>
            <p className="text-lg font-bold text-purple-600">
              {metrics.topPerformingSegment}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Opportunities</p>
            <p className="text-2xl font-bold text-orange-600">
              {metrics.improvementOpportunities}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Segment Breakdown
        </h3>

        <div className="space-y-4">
          {sortedSegments.map((segment) => (
            <div
              key={segment.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                segment.recommended
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {segment.recommended ? "✓" : "•"}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {segment.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size: {segment.size.toLocaleString()} customers
                    </p>
                  </div>
                </div>
                {segment.recommended && (
                  <span className="text-xs font-bold text-green-700 bg-green-200 px-2 py-1 rounded">
                    RECOMMENDED
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Conversion Rate
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {segment.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(segment.conversionRate, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Engagement</span>
                    <span className="text-sm font-bold text-gray-800">
                      {segment.engagement.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(segment.engagement, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showRecommendations && recommendedSegments.length > 0 && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <span>💡</span> Recommended Segments for Future Targeting
          </h3>
          <ul className="space-y-2">
            {recommendedSegments.map((segment) => (
              <li
                key={segment.id}
                className="text-sm text-green-700 flex items-center gap-2"
              >
                <span>→</span>
                <span>
                  {segment.name} ({segment.conversionRate.toFixed(1)}% conversion)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showRecommendations && recommendedSegments.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <p className="text-sm text-yellow-700 flex items-center gap-2">
            <span>⚠</span> No segments marked as recommended yet
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignSegmentTargetingCard;
