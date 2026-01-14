import React from 'react';

interface InsightCardProps {
  title: string;
  value: string | number;
  trend: "up" | "down" | "neutral";
  description: string;
}

export default function InsightCard({
  title,
  value,
  trend,
  description,
}: InsightCardProps) {
  const getTrendIndicator = () => {
    switch (trend) {
      case "up":
        return {
          icon: "↑",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "down":
        return {
          icon: "↓",
          color: "text-red-600",
          bgColor: "bg-red-50",
        };
      case "neutral":
        return {
          icon: "→",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
        };
    }
  };

  const { icon, color, bgColor } = getTrendIndicator();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <div className={`${bgColor} ${color} rounded-full p-2 text-lg font-bold`}>
          {icon}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>

      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
