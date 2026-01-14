import React from "react";

interface MetricCardProps {
  label: string;
  value: number;
  previousValue: number;
  format: "number" | "currency" | "percent";
}

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  previousValue,
  format,
}) => {
  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return "$" + val.toLocaleString();
      case "percent":
        return val.toFixed(1) + "%";
      default:
        return val.toLocaleString();
    }
  };

  const change = previousValue !== 0 ? ((value - previousValue) / previousValue) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mb-2">{formatValue(value)}</p>
      <div className="flex items-center">
        <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%
        </span>
        <span className="text-sm text-gray-500 ml-2">vs previous</span>
      </div>
    </div>
  );
};

export default MetricCard;
