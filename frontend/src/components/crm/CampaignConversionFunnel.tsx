import React from "react";

interface Stage {
  name: string;
  count: number;
  revenue?: number;
}

interface DateRange {
  startDate: string;
  endDate: string;
}

interface CampaignConversionFunnelProps {
  campaignId: string;
  dateRange: DateRange;
  stages: Stage[];
  showRevenue?: boolean;
  compareMode?: boolean;
}

const CampaignConversionFunnel: React.FC<
  CampaignConversionFunnelProps
> = ({
  campaignId,
  dateRange,
  stages,
  showRevenue = false,
  compareMode = false,
}) => {
  if (!stages || stages.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        No stage data available
      </div>
    );
  }

  const maxCount = Math.max(...stages.map((s) => s.count));
  const totalRevenue = stages.reduce((sum, s) => sum + (s.revenue || 0), 0);

  const getDropOffRate = (
    currentCount: number,
    previousCount: number
  ): number => {
    if (previousCount === 0) return 0;
    return ((previousCount - currentCount) / previousCount) * 100;
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Campaign Conversion Funnel
        </h2>
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Campaign ID: {campaignId}</span>
          <span>
            {dateRange.startDate} to {dateRange.endDate}
          </span>
        </div>
      </div>

      {showRevenue && totalRevenue > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-sm font-semibold text-blue-900">
            Total Revenue: ${totalRevenue.toLocaleString()}
          </p>
        </div>
      )}

      <div
        className={`space-y-4 ${compareMode ? "grid grid-cols-2 gap-4" : ""}`}
      >
        {stages.map((stage, index) => {
          const percentage =
            maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          const dropOff =
            index > 0
              ? getDropOffRate(stage.count, stages[index - 1].count)
              : 0;
          const revenuePerItem =
            stage.count > 0 ? (stage.revenue || 0) / stage.count : 0;

          return (
            <div key={`${stage.name}-${index}`} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-700">
                  {index === 0 && "📢"}
                  {index === 1 && "👥"}
                  {index === 2 && "🛒"}
                  {index > 2 && "✓"} {stage.name}
                </h3>
                <span className="text-sm font-bold text-gray-600">
                  {stage.count.toLocaleString()} visitors
                </span>
              </div>

              <div className="relative w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full flex items-center justify-end pr-3 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                >
                  {percentage > 20 && (
                    <span className="text-white font-bold text-sm">
                      {percentage.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <div>
                  {index > 0 && (
                    <span className="text-red-600 font-semibold">
                      ↓ Drop-off: {dropOff.toFixed(1)}%
                    </span>
                  )}
                </div>
                {showRevenue && stage.revenue !== undefined && (
                  <div className="text-right">
                    <p className="text-gray-700 font-medium">
                      Revenue: ${stage.revenue.toLocaleString()}
                    </p>
                    {revenuePerItem > 0 && (
                      <p className="text-gray-500">
                        ${revenuePerItem.toFixed(2)}/visitor
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-3">Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Initial Exposure</p>
            <p className="text-xl font-bold text-blue-600">
              {stages[0]?.count.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Final Conversion</p>
            <p className="text-xl font-bold text-green-600">
              {stages[stages.length - 1]?.count.toLocaleString() || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Conversion Rate</p>
            <p className="text-xl font-bold text-purple-600">
              {stages.length > 0 && stages[0].count > 0
                ? (
                    (stages[stages.length - 1].count /
                      stages[0].count) *
                    100
                  ).toFixed(2)
                : 0}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignConversionFunnel;
