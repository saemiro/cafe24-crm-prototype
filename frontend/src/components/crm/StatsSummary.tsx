import React from "react";

interface StatItem {
  label: string;
  value: string | number;
  change?: number;
}

interface StatsSummaryProps {
  title: string;
  stats: StatItem[];
  period?: string;
}

const StatsSummary: React.FC<StatsSummaryProps> = ({
  title,
  stats,
  period = "This Month",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">{period}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              {stat.change !== undefined && (
                <p className={`text-xs mt-1 ${stat.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stat.change >= 0 ? "↑" : "↓"} {Math.abs(stat.change)}%
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
