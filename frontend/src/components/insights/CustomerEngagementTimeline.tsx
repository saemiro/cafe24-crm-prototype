import React from "react";

interface DateRange {
  startDate: string;
  endDate: string;
}

interface TimelineDataPoint {
  date: string;
  value: number;
  segment?: string;
  campaign?: string;
  metric: string;
}

interface CustomerEngagementTimelineProps {
  dateRange: DateRange;
  segmentIds?: string[];
  campaignIds?: string[];
  metrics: string[];
  granularity?: "daily" | "weekly" | "monthly";
  showTrendline?: boolean;
}

const CustomerEngagementTimeline: React.FC<CustomerEngagementTimelineProps> = ({
  dateRange,
  segmentIds = [],
  campaignIds = [],
  metrics,
  granularity = "monthly",
  showTrendline = false,
}) => {
  const [selectedMetrics, setSelectedMetrics] = React.useState<string[]>(metrics);
  const [hoveredDate, setHoveredDate] = React.useState<string | null>(null);
  const [selectedSegment, setSelectedSegment] = React.useState<string | null>(null);

  const generateMockData = (): TimelineDataPoint[] => {
    const data: TimelineDataPoint[] = [];
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const currentDate = new Date(startDate);

    const segmentsToUse = segmentIds.length > 0 ? segmentIds : ["VIP", "Standard", "At-Risk"];
    const campaignsToUse = campaignIds.length > 0 ? campaignIds : ["Email", "SMS", "Push"];

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];

      segmentsToUse.forEach((segment) => {
        metrics.forEach((metric) => {
          data.push({
            date: dateStr,
            segment,
            metric,
            value: Math.floor(Math.random() * 100) + 20,
          });
        });
      });

      if (granularity === "daily") {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (granularity === "weekly") {
        currentDate.setDate(currentDate.getDate() + 7);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    return data;
  };

  const data = generateMockData();

  const getMetricColor = (metric: string): string => {
    const colors: { [key: string]: string } = {
      "order-frequency": "bg-blue-500",
      "campaign-response": "bg-green-500",
      "segment-migration": "bg-purple-500",
      engagement: "bg-orange-500",
      retention: "bg-pink-500",
      churn: "bg-red-500",
    };
    return colors[metric] || "bg-gray-500";
  };

  const getMetricIcon = (metric: string): string => {
    const icons: { [key: string]: string } = {
      "order-frequency": "📦",
      "campaign-response": "📧",
      "segment-migration": "🔄",
      engagement: "💬",
      retention: "🔄",
      churn: "👋",
    };
    return icons[metric] || "📊";
  };

  const calculateTrendline = (metricData: TimelineDataPoint[]): number[] => {
    if (metricData.length < 2) return metricData.map((d) => d.value);

    const values = metricData.map((d) => d.value);
    const n = values.length;
    const xMean = (n - 1) / 2;
    const yMean = values.reduce((a, b) => a + b) / n;

    let numerator = 0;
    let denominator = 0;

    values.forEach((y, i) => {
      numerator += (i - xMean) * (y - yMean);
      denominator += (i - xMean) ** 2;
    });

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = yMean - slope * xMean;

    return values.map((_, i) => slope * i + intercept);
  };

  const getMaxValue = () => {
    return Math.max(...data.map((d) => d.value), 100);
  };

  const maxValue = getMaxValue();
  const uniqueDates = Array.from(new Set(data.map((d) => d.date))).sort();
  const filteredData = data.filter(
    (d) => selectedMetrics.includes(d.metric) && (!selectedSegment || d.segment === selectedSegment)
  );

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Customer Engagement Timeline</h2>
        <p className="text-sm text-gray-600">
          {dateRange.startDate} to {dateRange.endDate} • Granularity: {granularity}
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Metrics</h3>
          <div className="flex flex-wrap gap-2">
            {metrics.map((metric) => (
              <button
                key={metric}
                onClick={() =>
                  setSelectedMetrics((prev) =>
                    prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
                  )
                }
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  selectedMetrics.includes(metric)
                    ? `${getMetricColor(metric)} text-white`
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {getMetricIcon(metric)} {metric}
              </button>
            ))}
          </div>
        </div>

        {segmentIds.length > 0 && (
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Segments</h3>
            <select
              value={selectedSegment || ""}
              onChange={(e) => setSelectedSegment(e.target.value || null)}
              className="px-3 py-1 border border-gray-300 rounded text-sm bg-white text-gray-700"
            >
              <option value="">All Segments</option>
              {Array.from(new Set(data.map((d) => d.segment))).map((segment) => (
                <option key={segment} value={segment || ""}>
                  {segment}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-x-auto">
        <div className="min-w-max">
          <div className="flex gap-1 mb-4">
            <div className="w-24 text-xs font-semibold text-gray-600">Date</div>
            <div className="flex gap-4 flex-1">
              {selectedMetrics.map((metric) => (
                <div key={metric} className="w-32 text-xs font-semibold text-gray-600">
                  {metric}
                </div>
              ))}
            </div>
          </div>

          {uniqueDates.map((date) => {
            const dateDataPoints = filteredData.filter((d) => d.date === date);
            const metricValues: { [key: string]: number[] } = {};

            selectedMetrics.forEach((metric) => {
              metricValues[metric] = dateDataPoints
                .filter((d) => d.metric === metric)
                .map((d) => d.value);
            });

            return (
              <div
                key={date}
                className="flex gap-1 py-3 border-t border-gray-200 hover:bg-blue-50 transition-colors"
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <div className="w-24 text-xs font-medium text-gray-700">{date}</div>
                <div className="flex gap-4 flex-1">
                  {selectedMetrics.map((metric) => {
                    const values = metricValues[metric] || [];
                    const avgValue = values.length > 0 ? values.reduce((a, b) => a + b) / values.length : 0;
                    const percentage = (avgValue / maxValue) * 100;
                    const trendData = data.filter((d) => d.metric === metric && d.date <= date);
                    const trendline = showTrendline ? calculateTrendline(trendData) : [];
                    const trend =
                      trendline.length > 1
                        ? trendline[trendline.length - 1] > trendline[trendline.length - 2]
                          ? "↗"
                          : "↘"
                        : "→";

                    return (
                      <div key={metric} className="w-32">
                        <div className="relative h-8 bg-gray-200 rounded overflow-hidden">
                          <div
                            className={`${getMetricColor(metric)} h-full transition-all duration-200 ${
                              hoveredDate === date ? "opacity-100" : "opacity-75"
                            }`}
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {Math.round(avgValue)} {showTrendline && trend}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {selectedMetrics.map((metric) => {
          const metricData = filteredData.filter((d) => d.metric === metric);
          const avgValue = metricData.length > 0 ? metricData.reduce((a, b) => a + b.value, 0) / metricData.length : 0;
          const maxVal = metricData.length > 0 ? Math.max(...metricData.map((d) => d.value)) : 0;

          return (
            <div key={metric} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{getMetricIcon(metric)}</span>
                <h4 className="text-sm font-semibold text-gray-700">{metric}</h4>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-bold text-gray-800">{Math.round(avgValue)}</div>
                <div className="text-xs text-gray-600">Avg: {Math.round(avgValue)}</div>
                <div className="text-xs text-gray-600">Max: {maxVal}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerEngagementTimeline;
