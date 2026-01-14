import React from "react";

interface Payment {
  id: string;
  amount: number;
  status: "success" | "failed" | "pending";
  method: string;
  customerId: string;
  orderId: string;
  timestamp: string;
}

interface PaymentHealthDashboardProps {
  timeRange: string;
  paymentData: Payment[];
  failureThreshold?: number;
  showMethodBreakdown?: boolean;
}

const PaymentHealthDashboard: React.FC<PaymentHealthDashboardProps> = ({
  timeRange,
  paymentData,
  failureThreshold = 5,
  showMethodBreakdown = true,
}) => {
  const successCount = paymentData.filter(
    (p) => p.status === "success"
  ).length;
  const failureCount = paymentData.filter(
    (p) => p.status === "failed"
  ).length;
  const pendingCount = paymentData.filter(
    (p) => p.status === "pending"
  ).length;

  const successRate =
    paymentData.length > 0 ? (successCount / paymentData.length) * 100 : 0;
  const failureRate =
    paymentData.length > 0 ? (failureCount / paymentData.length) * 100 : 0;

  const totalRevenue = paymentData
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  const methodDistribution: Record<string, number> = {};
  paymentData.forEach((p) => {
    methodDistribution[p.method] = (methodDistribution[p.method] || 0) + 1;
  });

  const failureAlert = failureRate > failureThreshold;

  const revenueByDay: Record<string, number> = {};
  paymentData
    .filter((p) => p.status === "success")
    .forEach((p) => {
      const date = new Date(p.timestamp).toLocaleDateString();
      revenueByDay[date] = (revenueByDay[date] || 0) + p.amount;
    });

  const sortedDates = Object.keys(revenueByDay).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="w-full bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-lg shadow-2xl text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Payment Health Dashboard</h1>
        <p className="text-slate-400">Time Range: {timeRange}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm font-semibold">
              SUCCESS RATE
            </span>
            <span className="text-2xl">✓</span>
          </div>
          <div className="text-4xl font-bold text-green-400">
            {successRate.toFixed(1)}%
          </div>
          <p className="text-slate-400 text-xs mt-2">
            {successCount} successful payments
          </p>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm font-semibold">
              FAILURE RATE
            </span>
            <span className="text-2xl">✗</span>
          </div>
          <div
            className={`text-4xl font-bold ${
              failureAlert ? "text-red-400" : "text-orange-400"
            }`}
          >
            {failureRate.toFixed(1)}%
          </div>
          <p className="text-slate-400 text-xs mt-2">
            {failureCount} failed payments
          </p>
          {failureAlert && (
            <p className="text-red-400 text-xs mt-2 font-semibold">
              ⚠ Above threshold ({failureThreshold}%)
            </p>
          )}
        </div>

        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm font-semibold">
              TOTAL REVENUE
            </span>
            <span className="text-2xl">$</span>
          </div>
          <div className="text-4xl font-bold text-blue-400">
            ${totalRevenue.toFixed(0)}
          </div>
          <p className="text-slate-400 text-xs mt-2">
            {successCount} successful transactions
          </p>
        </div>

        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-300 text-sm font-semibold">
              PENDING
            </span>
            <span className="text-2xl">⏳</span>
          </div>
          <div className="text-4xl font-bold text-yellow-400">
            {pendingCount}
          </div>
          <p className="text-slate-400 text-xs mt-2">
            {((pendingCount / paymentData.length) * 100).toFixed(1)}% of total
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
          <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
          <div className="space-y-4">
            {sortedDates.length > 0 ? (
              sortedDates.map((date) => {
                const maxRevenue = Math.max(
                  ...Object.values(revenueByDay)
                );
                const percentage =
                  (revenueByDay[date] / maxRevenue) * 100;
                return (
                  <div key={date}>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300 text-sm">{date}</span>
                      <span className="text-blue-400 font-semibold">
                        ${revenueByDay[date].toFixed(0)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-sm">No revenue data available</p>
            )}
          </div>
        </div>

        {showMethodBreakdown && (
          <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
            <h2 className="text-xl font-bold mb-4">Payment Method Distribution</h2>
            <div className="space-y-3">
              {Object.entries(methodDistribution).length > 0 ? (
                Object.entries(methodDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([method, count]) => {
                    const percentage =
                      (count / paymentData.length) * 100;
                    return (
                      <div key={method}>
                        <div className="flex justify-between mb-2">
                          <span className="text-slate-300 text-sm capitalize">
                            {method}
                          </span>
                          <span className="text-green-400 font-semibold">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <p className="text-slate-400 text-sm">
                  No payment method data available
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {failureCount > 0 && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-400 mb-4">
            ⚠ Failed Payment Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentData
              .filter((p) => p.status === "failed")
              .slice(0, 6)
              .map((payment) => (
                <div
                  key={payment.id}
                  className="bg-slate-700 rounded p-4 border border-red-700/50"
                >
                  <p className="text-red-400 font-semibold text-sm mb-2">
                    Payment #{payment.id.slice(0, 8)}
                  </p>
                  <p className="text-slate-300 text-xs mb-1">
                    Amount: ${payment.amount.toFixed(2)}
                  </p>
                  <p className="text-slate-300 text-xs mb-1">
                    Method: {payment.method}
                  </p>
                  <p className="text-slate-300 text-xs mb-1">
                    Customer: {payment.customerId}
                  </p>
                  <p className="text-slate-300 text-xs">
                    Order: {payment.orderId}
                  </p>
                </div>
              ))}
          </div>
          {failureCount > 6 && (
            <p className="text-slate-400 text-xs mt-4">
              ... and {failureCount - 6} more failed payments
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentHealthDashboard;
