import React from "react";

interface Segment {
  id: string;
  name: string;
  [key: string]: any;
}

interface Product {
  id: string;
  name: string;
  [key: string]: any;
}

interface AffinityValue {
  intensity: number;
  effectiveness: number;
  [key: string]: any;
}

interface AffinityData {
  [segmentId: string]: {
    [productId: string]: AffinityValue;
  };
}

interface SegmentProductAffinityHeatmapProps {
  segments: Segment[];
  products: Product[];
  affinityData: AffinityData;
  metric?: "intensity" | "effectiveness";
  onCellClick?: (segmentId: string, productId: string, data: AffinityValue) => void;
}

const SegmentProductAffinityHeatmap: React.FC<SegmentProductAffinityHeatmapProps> = ({
  segments,
  products,
  affinityData,
  metric = "intensity",
  onCellClick,
}) => {
  const getColorClass = (value: number): string => {
    if (value >= 0.8) return "bg-red-600";
    if (value >= 0.6) return "bg-orange-500";
    if (value >= 0.4) return "bg-yellow-400";
    if (value >= 0.2) return "bg-green-400";
    return "bg-blue-300";
  };

  const getMetricValue = (data: AffinityValue): number => {
    const val = data[metric] ?? 0;
    return Math.min(Math.max(val, 0), 1);
  };

  const handleCellClick = (segmentId: string, productId: string) => {
    if (onCellClick && affinityData[segmentId]?.[productId]) {
      onCellClick(segmentId, productId, affinityData[segmentId][productId]);
    }
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow-lg overflow-x-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Segment-Product Affinity Matrix
        </h2>
        <p className="text-gray-600 text-sm">
          Metric: <span className="font-semibold">{metric}</span> | ◼ High ◼
          Medium ◼ Low
        </p>
      </div>

      <div className="inline-block min-w-full">
        <table className="border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-100 p-3 text-left text-sm font-semibold text-gray-700 w-32">
                Segment
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="border border-gray-300 bg-gray-100 p-2 text-center text-xs font-semibold text-gray-700 min-w-24"
                >
                  <div className="truncate">{product.name}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {segments.map((segment) => (
              <tr key={segment.id}>
                <td className="border border-gray-300 bg-gray-50 p-3 text-sm font-medium text-gray-700 w-32">
                  {segment.name}
                </td>
                {products.map((product) => {
                  const cellData = affinityData[segment.id]?.[product.id];
                  const value = cellData ? getMetricValue(cellData) : 0;
                  const colorClass = getColorClass(value);

                  return (
                    <td
                      key={`${segment.id}-${product.id}`}
                      className={`border border-gray-300 p-2 text-center cursor-pointer transition-all hover:opacity-80 ${colorClass}`}
                      onClick={() => handleCellClick(segment.id, product.id)}
                      title={`${segment.name} - ${product.name}: ${(value * 100).toFixed(1)}%`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-white text-sm font-bold">
                          {(value * 100).toFixed(0)}%
                        </span>
                        {cellData && (
                          <span className="text-white text-xs opacity-75">
                            {metric === "intensity" ? "📊" : "✓"}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-2 text-sm">Legend</h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span className="text-gray-700">Very High (80-100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-gray-700">High (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-gray-700">Medium (40-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-gray-700">Low (20-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <span className="text-gray-700">Minimal (0-20%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentProductAffinityHeatmap;
