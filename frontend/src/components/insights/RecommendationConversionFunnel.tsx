import React from "react";

interface DateRange {
  startDate: string;
  endDate: string;
}

interface RecommendationConversionFunnelProps {
  campaignId: string;
  dateRange: DateRange;
  segmentFilter?: string;
  showComparison?: boolean;
}

interface FunnelStage {
  name: string;
  count: number;
  rate: number;
  dropoff: number;
}

const RecommendationConversionFunnel: React.FC<
  RecommendationConversionFunnelProps
> = ({ campaignId, dateRange, segmentFilter, showComparison = false }) => {
  const funnelData: FunnelStage[] = [
    { name: "Impression", count: 10000, rate: 100, dropoff: 0 },
    { name: "Click", count: 6500, rate: 65, dropoff: 35 },
    { name: "Add-to-Cart", count: 3250, rate: 32.5, dropoff: 50 },
    { name: "Purchase", count: 812, rate: 8.12, dropoff: 75 },
  ];

  const comparisonData: FunnelStage[] = [
    { name: "Impression", count: 8000, rate: 100, dropoff: 0 },
    { name: "Click", count: 5200, rate: 65, dropoff: 35 },
    { name: "Add-to-Cart", count: 2340, rate: 29.25, dropoff: 55 },
    { name: "Purchase", count: 527, rate: 6.6, dropoff: 77.5 },
  ];

  const maxCount = Math.max(...funnelData.map((s) => s.count));

  const stages = [
    { label: "📊 Impression", icon: "👁️" },
    { label: "🔗 Click", icon: "👆" },
    { label: "🛒 Add-to-Cart", icon: "🛍️" },
    { label: "✅ Purchase", icon: "💳" },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Recommendation Conversion Funnel
        </h2>
        <p className="text-sm text-gray-600">
          Campaign: {campaignId} | Period:{" "}
          {dateRange.startDate} to {dateRange.endDate}
          {segmentFilter && ` | Segment: ${segmentFilter}`}
        </p>
      </div>

      <div className="space-y-8">
        {funnelData.map((stage, index) => {
          const width = (stage.count / maxCount) * 100;
          const comparisonStage = showComparison ? comparisonData[index] : null;
          const comparisonWidth = comparisonStage
            ? (comparisonStage.count / maxCount) * 100
            : 0;

          return (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stages[index].icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {stages[index].label}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {stage.count.toLocaleString()} users ({stage.rate.toFixed(1)}%)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">
                    {stage.dropoff > 0 ? `↓ ${stage.dropoff.toFixed(1)}%` : "-"}
                  </p>
                  <p className="text-xs text-gray-500">drop-off rate</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center px-4 transition-all duration-300"
                    style={{ width: `${width}%` }}
                  >
                    <span className="text-white font-semibold text-sm">
                      {width > 20 ? `${(stage.count / 1000).toFixed(1)}K` : ""}
                    </span>
                  </div>
                </div>

                {showComparison && comparisonStage && (
                  <div className="relative h-8 bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                    <div
                      className="h-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center px-4"
                      style={{ width: `${comparisonWidth}%` }}
                    >
                      <span className="text-white font-semibold text-xs">
                        {comparisonWidth > 20
                          ? `${(comparisonStage.count / 1000).toFixed(1)}K`
                          : ""}
                      </span>
                    </div>
                    <p className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-600">
                      Previous
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">10K</p>
            <p className="text-xs text-gray-600">Total Impressions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">65%</p>
            <p className="text-xs text-gray-600">Click-through Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">32.5%</p>
            <p className="text-xs text-gray-600">Cart Conversion</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">8.12%</p>
            <p className="text-xs text-gray-600">Purchase Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationConversionFunnel;
