import React from "react";

interface CustomerCardProps {
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  lastPurchase: string;
  totalSpent: number;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  name,
  email,
  status,
  lastPurchase,
  totalSpent,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getAvatarColor = () => {
    const colors = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500"];
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className={`w-12 h-12 rounded-full ${getAvatarColor()} flex items-center justify-center text-white font-bold text-lg`}>
          {name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{email}</p>
          <div className="mt-4 flex justify-between text-sm">
            <div>
              <p className="text-gray-500">Last Purchase</p>
              <p className="font-medium text-gray-900">{lastPurchase}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Total Spent</p>
              <p className="font-medium text-gray-900">${totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
