import React from "react";

interface DateRange {
  startDate?: Date;
  endDate?: Date;
}

interface CustomerJourneyTimelineProps {
  customerId: string;
  dateRange?: DateRange;
  eventTypes?: string[];
  showPredictiveInsights?: boolean;
}

interface TimelineEvent {
  id: string;
  type: "order" | "payment" | "shipping";
  date: Date;
  description: string;
  status: "completed" | "pending" | "failed";
  amount?: number;
}

const CustomerJourneyTimeline: React.FC<CustomerJourneyTimelineProps> = ({
  customerId,
  dateRange,
  eventTypes = ["order", "payment", "shipping"],
  showPredictiveInsights = false,
}) => {
  // Mock data - replace with actual API calls
  const mockEvents: TimelineEvent[] = [
    {
      id: "evt_001",
      type: "order",
      date: new Date("2024-01-15"),
      description: "Order placed - Product Bundle",
      status: "completed",
      amount: 299.99,
    },
    {
      id: "evt_002",
      type: "payment",
      date: new Date("2024-01-15"),
      description: "Payment processed",
      status: "completed",
      amount: 299.99,
    },
    {
      id: "evt_003",
      type: "shipping",
      date: new Date("2024-01-16"),
      description: "Package shipped",
      status: "completed",
    },
    {
      id: "evt_004",
      type: "order",
      date: new Date("2024-06-20"),
      description: "Order placed - Electronics",
      status: "completed",
      amount: 899.99,
    },
    {
      id: "evt_005",
      type: "payment",
      date: new Date("2024-06-20"),
      description: "Payment processed",
      status: "completed",
      amount: 899.99,
    },
    {
      id: "evt_006",
      type: "shipping",
      date: new Date("2024-06-21"),
      description: "Package shipped",
      status: "completed",
    },
    {
      id: "evt_007",
      type: "order",
      date: new Date("2024-12-10"),
      description: "Order placed - Holiday Gift",
      status: "pending",
      amount: 150.0,
    },
  ];

  // Filter events based on eventTypes and dateRange
  const filteredEvents = mockEvents.filter((event) => {
    const eventTypeMatch = eventTypes.includes(event.type);
    let dateMatch = true;

    if (dateRange?.startDate && dateRange?.endDate) {
      dateMatch =
        event.date >= dateRange.startDate && event.date <= dateRange.endDate;
    }

    return eventTypeMatch && dateMatch;
  });

  // Sort events by date (newest first)
  const sortedEvents = [...filteredEvents].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  // Calculate engagement metrics
  const orderCount = filteredEvents.filter((e) => e.type === "order").length;
  const totalSpent = filteredEvents
    .filter((e) => e.type === "order" && e.status === "completed")
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const getEventIcon = (type: string, status: string) => {
    const iconMap: Record<string, string> = {
      order: "📦",
      payment: "💳",
      shipping: "🚚",
    };
    const baseIcon = iconMap[type] || "📌";

    if (status === "failed") return "❌";
    if (status === "pending") return "⏳";
    return baseIcon;
  };

  const getEventColor = (
    type: string,
    status: string
  ): Record<string, string> => {
    const colorMap: Record<string, Record<string, string>> = {
      completed: {
        order: "bg-blue-50 border-blue-300",
        payment: "bg-green-50 border-green-300",
        shipping: "bg-purple-50 border-purple-300",
      },
      pending: {
        order: "bg-yellow-50 border-yellow-300",
        payment: "bg-yellow-50 border-yellow-300",
        shipping: "bg-yellow-50 border-yellow-300",
      },
      failed: {
        order: "bg-red-50 border-red-300",
        payment: "bg-red-50 border-red-300",
        shipping: "bg-red-50 border-red-300",
      },
    };

    return colorMap[status]?.[type] || "bg-gray-50 border-gray-300";
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getChurnRisk = (): "low" | "medium" | "high" => {
    if (orderCount === 0) return "high";
    const lastEventDate = sortedEvents[0]?.date;
    const daysSinceLastEvent = lastEventDate
      ? Math.floor(
          (new Date().getTime() - lastEventDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

    if (daysSinceLastEvent > 180) return "high";
    if (daysSinceLastEvent > 90) return "medium";
    return "low";
  };

  const churnRisk = getChurnRisk();

  const churnRiskColor = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Journey Timeline
        </h1>
        <p className="text-gray-600">Customer ID: {customerId}</p>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="text-sm font-semibold text-blue-900 mb-1">
            Total Orders
          </div>
          <div className="text-3xl font-bold text-blue-600">{orderCount}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="text-sm font-semibold text-green-900 mb-1">
            Total Spent
          </div>
          <div className="text-3xl font-bold text-green-600">
            ${totalSpent.toFixed(2)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="text-sm font-semibold text-purple-900 mb-1">
            Lifetime Value
          </div>
          <div className="text-3xl font-bold text-purple-600">
            ${totalSpent.toFixed(2)}
          </div>
        </div>

        <div
          className={`rounded-lg p-6 border ${churnRiskColor[churnRisk]} bg-opacity-50`}
        >
          <div className="text-sm font-semibold mb-1">Churn Risk</div>
          <div className="text-2xl font-bold capitalize">{churnRisk}</div>
        </div>
      </div>

      {/* Event Filters */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Filter by Event Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {["order", "payment", "shipping"].map((type) => (
            <span
              key={type}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                eventTypes.includes(type)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Timeline Events */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Event Timeline</h2>

        {sortedEvents.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No events found</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 to-purple-300"></div>

            {/* Events */}
            <div className="space-y-6">
              {sortedEvents.map((event) => (
                <div key={event.id} className="relative pl-24">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-2 w-16 h-16 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white border-4 border-blue-400 flex items-center justify-center text-2xl shadow-md">
                      {getEventIcon(event.type, event.status)}
                    </div>
                  </div>

                  {/* Event card */}
                  <div
                    className={`p-5 rounded-lg border-2 transition-all hover:shadow-lg ${getEventColor(event.type, event.status)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {event.description}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.status === "completed"
                            ? "bg-green-200 text-green-800"
                            : event.status === "pending"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-red-200 text-red-800"
                        }`}
                      >
                        {event.status.charAt(0).toUpperCase() +
                          event.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {formatDate(event.date)}
                    </p>
                    {event.amount && (
                      <p className="text-sm font-medium text-gray-700">
                        Amount: ${event.amount.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Predictive Insights */}
      {showPredictiveInsights && (
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-300">
          <h3 className="text-lg font-bold text-indigo-900 mb-4">
            ⚡ Predictive Insights
          </h3>

          <div className="space-y-3 text-sm text-indigo-800">
            <div className="flex items-start">
              <span className="mr-3 text-lg">📊</span>
              <p>
                Purchase frequency suggests{" "}
                <span className="font-semibold">
                  {orderCount > 2 ? "high-value" : "developing"}
                </span>{" "}
                customer relationship
              </p>
            </div>

            {churnRisk === "high" && (
              <div className="flex items-start">
                <span className="mr-3 text-lg">⚠️</span>
                <p>
                  Customer shows <span className="font-semibold">high churn risk</span>. Consider
                  targeted retention campaigns.
                </p>
              </div>
            )}

            <div className="flex items-start">
              <span className="mr-3 text-lg">🎯</span>
              <p>
                Recommended next step:{" "}
                <span className="font-semibold">
                  {orderCount === 1
                    ? "Cross-sell complementary products"
                    : "Exclusive loyalty program enrollment"}
                </span>
              </p>
            </div>

            <div className="flex items-start">
              <span className="mr-3 text-lg">📈</span>
              <p>
                Optimal engagement window:{" "}
                <span className="font-semibold">30-45 days after purchase</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-600 text-sm">Total Events</p>
            <p className="text-2xl font-bold text-gray-900">
              {sortedEvents.length}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Avg Order Value</p>
            <p className="text-2xl font-bold text-gray-900">
              {orderCount > 0
                ? `$${(totalSpent / orderCount).toFixed(2)}`
                : "$0.00"}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Last Activity</p>
            <p className="text-lg font-bold text-gray-900">
              {sortedEvents.length > 0
                ? (() => {
                    const daysAgo = Math.floor(
                      (new Date().getTime() -
                        sortedEvents[0].date.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return daysAgo === 0
                      ? "Today"
                      : `${daysAgo} days ago`;
                  })()
                : "Never"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerJourneyTimeline;
