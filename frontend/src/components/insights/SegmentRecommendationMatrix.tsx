import React from "react";

interface SegmentData {
  id: string;
  name: string;
  size: number;
  acceptanceRate: number;
}

interface CategoryData {
  id: string;
  name: string;
}

interface MatrixCell {
  ctr: number;
  conversionRate: number;
  revenuePerSegment: number;
  acceptanceRate: number;
}

interface SegmentRecommendationMatrixProps {
  segmentData: SegmentData[];
  categoryData: CategoryData[];
  metricType?: "ctr" | "conversion" | "revenue" | "acceptance";
  timeRange?: string;
  onCellClick?: (segmentId: string, categoryId: string, data: MatrixCell) => void;
}

const SegmentRecommendationMatrix: React.FC<SegmentRecommendationMatrixProps> = ({
  segmentData,
  categoryData,
  metricType = "acceptance",
  timeRange = "30d",
  onCellClick,
}) => {
  const generateMatrixData = (
    segmentId: string,
    categoryId: string
  ): MatrixCell => {
    const segmentHash = segmentId.charCodeAt(0) + categoryId.charCodeAt(0);
    const baseValue = (segmentHash % 100) / 100;

    return {
      ctr: baseValue * 0.08,
      conversionRate: baseValue * 0.12,
      revenuePerSegment: baseValue * 5000,
      acceptanceRate: baseValue,
    };
  };

  const getMetricValue = (cell: MatrixCell): number => {
    switch (metricType) {
      case "ctr":
        return cell.ctr;
      case "conversion":
        return cell.conversionRate;
      case "revenue":
        return cell.revenuePerSegment;
      case "acceptance":
      default:
        return cell.acceptanceRate;
    }
  };

  const getHeatmapColor = (value: number): string => {
    if (value < 0.2) return "bg-red-100";
    if (value < 0.4) return "bg-orange-100";
    if (value < 0.6) return "bg-yellow-100";
    if (value < 0.8) return "bg-lime-100";
    return "bg-green-100";
  };

  const getTextColor = (value: number): string => {
    if (value < 0.2) return "text-red-900";
    if (value < 0.4) return "text-orange-900";
    if (value < 0.6) return "text-yellow-900";
    if (value < 0.8) return "text-lime-900";
    return "text-green-900";
  };

  const formatMetricValue = (value: number): string => {
    switch (metricType) {
      case "ctr":
        return `${(value * 100).toFixed(1)}%`;
      case "conversion":
        return `${(value * 100).toFixed(1)}%`;
      case "revenue":
        return `$${Math.round(value)}`;
      case "acceptance":
      default:
        return `${(value * 100).toFixed(0)}%`;
    }
  };

  const getMetricLabel = (): string => {
    switch (metricType) {
      case "ctr":
        return "Click-Through Rate";
      case "conversion":
        return "Conversion Rate";
      case "revenue":
        return "Revenue per Segment";
      case "acceptance":
      default:
        return "Acceptance Rate";
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 p-6 rounded-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Segment Recommendation Matrix
        </h2>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>📊 {getMetricLabel()}</span>
          <span>⏱️ {timeRange}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-gray-200 p-3 text-left text-sm font-semibold text-gray-700 border border-gray-300 w-32">
                Segment
              </th>
              {categoryData.map((category) => (
                <th
                  key={category.id}
                  className="bg-gray-200 p-3 text-center text-sm font-semibold text-gray-700 border border-gray-300 min-w-32"
                >
                  {category.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {segmentData.map((segment) => (
              <tr key={segment.id}>
                <td className="bg-gray-100 p-3 text-sm font-medium text-gray-900 border border-gray-300">
                  <div>{segment.name}</div>
                  <div className="text-xs text-gray-500">
                    Size: {segment.size.toLocaleString()}
                  </div>
                </td>
                {categoryData.map((category) => {
                  const cellData = generateMatrixData(segment.id, category.id);
                  const metricValue = getMetricValue(cellData);
                  const heatmapColor = getHeatmapColor(metricValue);
                  const textColor = getTextColor(metricValue);

                  return (
                    <td
                      key={`${segment.id}-${category.id}`}
                      onClick={() =>
                        onCellClick && onCellClick(segment.id, category.id, cellData)
                      }
                      className={`${heatmapColor} ${textColor} p-3 border border-gray-300 text-center cursor-pointer hover:opacity-80 transition-opacity`}
                    >
                      <div className="text-sm font-bold">
                        {formatMetricValue(metricValue)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        📈 {(cellData.acceptanceRate * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-600">
                        💰 ${Math.round(cellData.revenuePerSegment)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex gap-8">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Heat Scale:</span>
          <div className="flex gap-1">
            <div className="w-6 h-6 bg-red-100 border border-gray-300"></div>
            <div className="w-6 h-6 bg-orange-100 border border-gray-300"></div>
            <div className="w-6 h-6 bg-yellow-100 border border-gray-300"></div>
            <div className="w-6 h-6 bg-lime-100 border border-gray-300"></div>
            <div className="w-6 h-6 bg-green-100 border border-gray-300"></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">Low → High</span>
        </div>
      </div>
    </div>
  );
};

export default SegmentRecommendationMatrix;
