import React, { useMemo } from "react";

interface Campaign {
  id: string;
  name: string;
  metrics?: {
    conversionRate?: number;
    revenue?: number;
    engagement?: number;
  };
}

interface Segment {
  id: string;
  name: string;
}

interface DateRange {
  start?: string;
  end?: string;
}

interface CampaignSegmentMatrixProps {
  campaigns: Campaign[];
  segments: Segment[];
  metric?: "conversionRate" | "revenue" | "engagement";
  dateRange?: DateRange;
}

const CampaignSegmentMatrix: React.FC<CampaignSegmentMatrixProps> = ({
  campaigns,
  segments,
  metric = "conversionRate",
  dateRange,
}) => {
  // Generate mock data based on campaign and segment combinations
  const matrixData = useMemo(() => {
    const data: Record<string, Record<string, number>> = {};

    campaigns.forEach((campaign) => {
      data[campaign.id] = {};
      segments.forEach((segment) => {
        // Generate deterministic pseudo-random value based on campaign and segment
        const seed =
          campaign.id.charCodeAt(0) * 31 + segment.id.charCodeAt(0);
        const value = (Math.abs(Math.sin(seed) * 100) % 100) * 0.8 + 10;
        data[campaign.id][segment.id] = Math.round(value * 100) / 100;
      });
    });

    return data;
  }, [campaigns, segments]);

  // Get min and max values for color scaling
  const allValues = campaigns.flatMap((campaign) =>
    segments.map((segment) => matrixData[campaign.id][segment.id])
  );
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Function to get color intensity based on value
  const getColorClass = (value: number): string => {
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;

    if (percentage < 20) return "bg-red-100 text-red-900";
    if (percentage < 40) return "bg-orange-100 text-orange-900";
    if (percentage < 60) return "bg-yellow-100 text-yellow-900";
    if (percentage < 80) return "bg-lime-100 text-lime-900";
    return "bg-green-100 text-green-900";
  };

  // Get metric label and unit
  const getMetricLabel = (): string => {
    switch (metric) {
      case "revenue":
        return "Revenue ($)";
      case "engagement":
        return "Engagement (%)";
      default:
        return "Conversion Rate (%)";
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Campaign Performance Heatmap
        </h2>
        <p className="text-gray-600">
          {getMetricLabel()}
          {dateRange && dateRange.start
            ? ` (${dateRange.start} to ${dateRange.end || "Present"})`
            : ""}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-gray-100 p-3 text-left font-semibold text-gray-700 border border-gray-300">
                Campaign
              </th>
              {segments.map((segment) => (
                <th
                  key={segment.id}
                  className="bg-gray-100 p-3 text-center font-semibold text-gray-700 border border-gray-300 min-w-[140px]"
                >
                  {segment.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="bg-gray-50 p-3 font-semibold text-gray-800 border border-gray-300 sticky left-0 z-10">
                  {campaign.name}
                </td>
                {segments.map((segment) => {
                  const value = matrixData[campaign.id][segment.id];
                  return (
                    <td
                      key={`${campaign.id}-${segment.id}`}
                      className={`p-3 text-center border border-gray-300 font-semibold transition-colors duration-200 hover:opacity-80 ${getColorClass(
                        value
                      )}`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-lg">
                          {value >= 70 ? "🔥" : value >= 50 ? "⬆️" : "📊"}
                        </span>
                        <span className="text-sm mt-1">{value.toFixed(1)}</span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-100"></div>
            <span className="text-sm text-gray-600">Low (0-20%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-100"></div>
            <span className="text-sm text-gray-600">Medium (40-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100"></div>
            <span className="text-sm text-gray-600">High (80-100%)</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Total Campaigns: {campaigns.length} × Segments: {segments.length}
        </div>
      </div>
    </div>
  );
};

export default CampaignSegmentMatrix;
