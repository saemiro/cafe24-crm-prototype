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
  startDate: string;
  endDate: string;
}

interface CampaignSegmentMatrixProps {
  campaigns: Campaign[];
  segments: Segment[];
  metric?: string;
  dateRange?: DateRange;
}

const CampaignSegmentMatrix: React.FC<CampaignSegmentMatrixProps> = ({
  campaigns,
  segments,
  metric = "conversion_rate",
  dateRange,
}) => {
  const getMetricValue = (campaignId: string, segmentId: string): number => {
    const hash = (str: string) => {
      let result = 0;
      for (let i = 0; i < str.length; i++) {
        result = (result << 5) - result + str.charCodeAt(i);
        result = result & result;
      }
      return Math.abs(result);
    };

    const seed = hash(`${campaignId}-${segmentId}-${metric}`);
    return (seed % 100) / 100;
  };

  const getMetricLabel = (): string => {
    const labels: Record<string, string> = {
      conversion_rate: "Conversion Rate",
      revenue: "Revenue",
      engagement: "Engagement",
    };
    return labels[metric] || "Performance";
  };

  const getHeatmapColor = (value: number): string => {
    if (value >= 0.8) return "bg-red-600";
    if (value >= 0.6) return "bg-orange-500";
    if (value >= 0.4) return "bg-yellow-400";
    if (value >= 0.2) return "bg-yellow-200";
    return "bg-gray-200";
  };

  const getTextColor = (value: number): string => {
    return value >= 0.4 ? "text-white" : "text-gray-900";
  };

  const formatMetricValue = (value: number): string => {
    if (metric === "revenue") {
      return `$${(value * 10000).toFixed(0)}`;
    }
    if (metric === "engagement") {
      return `${(value * 100).toFixed(0)}%`;
    }
    return `${(value * 100).toFixed(0)}%`;
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Campaign Segment Performance Matrix
        </h2>
        <p className="text-sm text-gray-600">
          {getMetricLabel()}
          {dateRange && ` • ${dateRange.startDate} to ${dateRange.endDate}`}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-900 bg-gray-100 border border-gray-300 min-w-32">
                Campaign / Segment
              </th>
              {segments.map((segment) => (
                <th
                  key={segment.id}
                  className="p-3 text-center text-sm font-semibold text-gray-900 bg-gray-100 border border-gray-300 min-w-40"
                >
                  {segment.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="p-3 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-300">
                  {campaign.name}
                </td>
                {segments.map((segment) => {
                  const value = getMetricValue(campaign.id, segment.id);
                  const bgColor = getHeatmapColor(value);
                  const textColor = getTextColor(value);

                  return (
                    <td
                      key={`${campaign.id}-${segment.id}`}
                      className={`p-3 text-center text-sm font-semibold border border-gray-300 ${bgColor} ${textColor} cursor-pointer hover:opacity-90 transition-opacity`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{formatMetricValue(value)}</span>
                        <span className="text-xs opacity-80">
                          {value >= 0.7 ? "⭐" : value >= 0.5 ? "✓" : "○"}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-center gap-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-600 rounded"></div>
          <span className="text-gray-700">Excellent (80%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded"></div>
          <span className="text-gray-700">Good (60-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 rounded"></div>
          <span className="text-gray-700">Fair (40-59%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <span className="text-gray-700">Poor (&lt;40%)</span>
        </div>
      </div>
    </div>
  );
};

export default CampaignSegmentMatrix;
