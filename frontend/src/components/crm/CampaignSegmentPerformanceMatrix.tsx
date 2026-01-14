import React from "react";

interface Campaign {
  id: string;
  name: string;
}

interface Segment {
  id: string;
  name: string;
}

interface PerformanceData {
  conversionRate?: number;
  revenue?: number;
  engagement?: number;
  clicks?: number;
  impressions?: number;
}

interface PerformanceMetrics {
  [campaignId: string]: {
    [segmentId: string]: PerformanceData;
  };
}

interface DateRange {
  startDate?: string;
  endDate?: string;
}

interface CampaignSegmentPerformanceMatrixProps {
  campaigns: Campaign[];
  segments: Segment[];
  performanceMetrics: PerformanceMetrics;
  dateRange?: DateRange;
  metricType?: "conversionRate" | "revenue" | "engagement" | "clicks" | "impressions";
  onCellClick?: (campaignId: string, segmentId: string, data: PerformanceData) => void;
}

const CampaignSegmentPerformanceMatrix: React.FC<CampaignSegmentPerformanceMatrixProps> = ({
  campaigns,
  segments,
  performanceMetrics,
  dateRange,
  metricType = "conversionRate",
  onCellClick,
}) => {
  const getMetricValue = (data: PerformanceData): number => {
    return data[metricType as keyof PerformanceData] ?? 0;
  };

  const getHeatColor = (value: number, maxValue: number): string => {
    if (maxValue === 0) return "bg-gray-100";
    const normalized = value / maxValue;

    if (normalized >= 0.8) return "bg-red-600";
    if (normalized >= 0.6) return "bg-orange-500";
    if (normalized >= 0.4) return "bg-yellow-400";
    if (normalized >= 0.2) return "bg-lime-300";
    return "bg-green-100";
  };

  const getMaxMetricValue = (): number => {
    let max = 0;
    Object.values(performanceMetrics).forEach((campaignData) => {
      Object.values(campaignData).forEach((segmentData) => {
        const value = getMetricValue(segmentData);
        if (value > max) max = value;
      });
    });
    return max;
  };

  const maxValue = getMaxMetricValue();

  const getMetricLabel = (): string => {
    const labels: Record<string, string> = {
      conversionRate: "Conv. Rate (%)",
      revenue: "Revenue ($)",
      engagement: "Engagement",
      clicks: "Clicks",
      impressions: "Impressions",
    };
    return labels[metricType] || metricType;
  };

  const handleCellClick = (campaignId: string, segmentId: string) => {
    const data = performanceMetrics[campaignId]?.[segmentId];
    if (data && onCellClick) {
      onCellClick(campaignId, segmentId, data);
    }
  };

  const formatValue = (value: number): string => {
    if (metricType === "revenue") {
      return `$${value.toFixed(0)}`;
    }
    if (metricType === "conversionRate") {
      return `${value.toFixed(1)}%`;
    }
    return value.toFixed(1);
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Campaign Segment Performance Matrix
        </h2>
        <p className="text-gray-600 text-sm">
          {getMetricLabel()}
          {dateRange?.startDate && (
            <span className="ml-4">
              • {dateRange.startDate} to {dateRange.endDate || "Present"}
            </span>
          )}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-gray-200 p-3 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                Campaign
              </th>
              {segments.map((segment) => (
                <th
                  key={segment.id}
                  className="bg-gray-200 p-3 text-center text-sm font-semibold text-gray-700 border border-gray-300"
                >
                  {segment.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="bg-gray-100 p-3 text-sm font-medium text-gray-700 border border-gray-300 w-32">
                  {campaign.name}
                </td>
                {segments.map((segment) => {
                  const data = performanceMetrics[campaign.id]?.[segment.id];
                  const value = data ? getMetricValue(data) : 0;
                  const bgColor = data ? getHeatColor(value, maxValue) : "bg-gray-50";

                  return (
                    <td
                      key={`${campaign.id}-${segment.id}`}
                      onClick={() => handleCellClick(campaign.id, segment.id)}
                      className={`p-3 text-center border border-gray-300 cursor-pointer transition-opacity hover:opacity-80 ${bgColor}`}
                    >
                      <div className="text-xs font-semibold text-gray-800">
                        {data ? formatValue(value) : "—"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Legend:</span>
        <div className="flex gap-1 items-center">
          <div className="w-6 h-6 bg-green-100 border border-gray-300"></div>
          <span className="text-xs text-gray-600">Low</span>
          <div className="w-6 h-6 bg-lime-300 border border-gray-300"></div>
          <div className="w-6 h-6 bg-yellow-400 border border-gray-300"></div>
          <div className="w-6 h-6 bg-orange-500 border border-gray-300"></div>
          <div className="w-6 h-6 bg-red-600 border border-gray-300"></div>
          <span className="text-xs text-gray-600">High</span>
        </div>
      </div>
    </div>
  );
};

export default CampaignSegmentPerformanceMatrix;
