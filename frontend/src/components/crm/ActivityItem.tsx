import React from "react";

interface ActivityItemProps {
  type: "purchase" | "visit" | "support" | "email";
  description: string;
  timestamp: string;
  customerName: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  type,
  description,
  timestamp,
  customerName,
}) => {
  const getTypeIcon = () => {
    switch (type) {
      case "purchase":
        return "🛒";
      case "visit":
        return "👁️";
      case "support":
        return "💬";
      case "email":
        return "📧";
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "purchase":
        return "bg-green-100";
      case "visit":
        return "bg-blue-100";
      case "support":
        return "bg-purple-100";
      case "email":
        return "bg-yellow-100";
    }
  };

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 transition-colors">
      <div className={`w-10 h-10 rounded-full ${getTypeColor()} flex items-center justify-center text-lg`}>
        {getTypeIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{customerName}</p>
        <p className="text-sm text-gray-600 truncate">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
      </div>
    </div>
  );
};

export default ActivityItem;
