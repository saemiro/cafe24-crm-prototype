import React from "react";

interface Metric {
  value: number;
  trend?: number;
  unit?: string;
}

interface Segment {
  name: string;
  accuracy: number;
  ctr: number;
  conversion: number;
}

interface RecommendationAnalyticsCardProps {
  timeRange: string;
  metrics: {
    productAccuracy?: Metric;
    customerAccuracy?: Metric;
    ctr?: Metric;
    conversionRate?: Metric;
    avgOrderValue?: Metric;
    recommendationCount?: Metric;
  };
  segmentBreakdown?: Segment[];
  comparisonEnabled?: boolean;
}

const RecommendationAnalyticsCard: React.FC<
  RecommendationAnalyticsCardProps
> = ({ timeRange, metrics, segmentBreakdown, comparisonEnabled = false }) => {
  const MetricCard = ({
    label,
    metric,
    icon,
  }: {
    label: string;
    metric?: Metric;
    icon: string;
  }) => (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-900">
          {metric?.value ?? 0}
          {metric?.unit || ""}
        </span>
        {metric?.trend !== undefined && (
          <span
            className={`text-sm font-semibold ${
              metric.trend >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {metric.trend >= 0 ? "↑" : "↓"} {Math.abs(metric.trend)}%
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recommendation Analytics
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Performance metrics for {timeRange}
            </p>
          </div>
          {comparisonEnabled && (
            <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
              Comparison Enabled
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <MetricCard
            label="Product Accuracy"
            metric={metrics.productAccuracy}
            icon="🎯"
          />
          <MetricCard
            label="Customer Accuracy"
            metric={metrics.customerAccuracy}
            icon="👤"
          />
          <MetricCard label="Click-Through Rate" metric={metrics.ctr} icon="🖱️" />
          <MetricCard
            label="Conversion Rate"
            metric={metrics.conversionRate}
            icon="✓"
          />
          <MetricCard
            label="Avg Order Value"
            metric={metrics.avgOrderValue}
            icon="💰"
          />
          <MetricCard
            label="Total Recommendations"
            metric={metrics.recommendationCount}
            icon="📊"
          />
        </div>

        {segmentBreakdown && segmentBreakdown.length > 0 && (
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              📈 Segment Performance
            </h3>
            <div className="space-y-3">
              {segmentBreakdown.map((segment, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {segment.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-500">Accuracy</span>
                      <span className="text-sm font-bold text-slate-900">
                        {segment.accuracy}%
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-500">CTR</span>
                      <span className="text-sm font-bold text-slate-900">
                        {segment.ctr}%
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-slate-500">Conversion</span>
                      <span className="text-sm font-bold text-slate-900">
                        {segment.conversion}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {segmentBreakdown && segmentBreakdown.length === 0 && (
          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-center py-8 text-slate-400">
              <span className="text-sm">No segment data available</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationAnalyticsCard;
