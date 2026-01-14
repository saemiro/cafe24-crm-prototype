import React from "react";

interface InsightCardProps {
  title: string;
  value: string | number;
  trend: "up" | "down" | "neutral";
  description: string;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  value,
  trend,
  description,
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      case "neutral":
        return "→";
      default:
        return "→";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "neutral":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendBackgroundColor = () => {
    switch (trend) {
      case "up":
        return "bg-green-100";
      case "down":
        return "bg-red-100";
      case "neutral":
        return "bg-gray-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <div
          className={`${getTrendBackgroundColor()} ${getTrendColor()} rounded-full w-8 h-8 flex items-center justify-center text-lg font-semibold`}
        >
          {getTrendIcon()}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>

      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default InsightCard;
