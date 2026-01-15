import React from 'react';

interface InsightCardProps {
  title: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  value,
  trend,
  description,
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'neutral':
        return '→';
      default:
        return '→';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-700 font-semibold text-sm uppercase tracking-wide">
          {title}
        </h3>
        <span className={`text-lg font-bold ${getTrendColor()}`}>
          {getTrendIcon()}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      </div>

      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default InsightCard;
