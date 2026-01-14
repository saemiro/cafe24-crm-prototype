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
  const getTrendStyles = () => {
    switch (trend) {
      case "up":
        return "text-green-600 bg-green-50";
      case "down":
        return "text-red-600 bg-red-50";
      case "neutral":
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTrendIndicator = () => {
    switch (trend) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      case "neutral":
        return "→";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 mb-4">{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-semibold ${getTrendStyles()}`}
        >
          {getTrendIndicator()}
        </div>
      </div>
    </div>
  );
}
