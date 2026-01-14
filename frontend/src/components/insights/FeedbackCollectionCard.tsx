import React from "react";

interface DateRange {
  startDate: string;
  endDate: string;
}

interface FeedbackItem {
  date: string;
  count: number;
  sentiment?: string;
}

interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

interface FeedbackCollectionCardProps {
  customerId?: string;
  dateRange: DateRange;
  feedbackData: FeedbackItem[];
  sentimentBreakdown: SentimentBreakdown;
  collectionRate: number;
  onRequestFeedback?: () => void;
}

const FeedbackCollectionCard: React.FC<FeedbackCollectionCardProps> = ({
  customerId,
  dateRange,
  feedbackData,
  sentimentBreakdown,
  collectionRate,
  onRequestFeedback,
}) => {
  const totalFeedback = feedbackData.reduce((sum, item) => sum + item.count, 0);
  const totalSentiment = sentimentBreakdown.positive + sentimentBreakdown.neutral + sentimentBreakdown.negative;
  
  const getMaxFeedbackCount = () => {
    return Math.max(...feedbackData.map((item) => item.count), 1);
  };

  const maxCount = getMaxFeedbackCount();
  const positivePercent = totalSentiment > 0 ? ((sentimentBreakdown.positive / totalSentiment) * 100).toFixed(1) : 0;
  const neutralPercent = totalSentiment > 0 ? ((sentimentBreakdown.neutral / totalSentiment) * 100).toFixed(1) : 0;
  const negativePercent = totalSentiment > 0 ? ((sentimentBreakdown.negative / totalSentiment) * 100).toFixed(1) : 0;

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Feedback Collection</h2>
          {customerId && <p className="text-sm text-gray-500 mt-1">Customer ID: {customerId}</p>}
          <p className="text-sm text-gray-500">
            {dateRange.startDate} to {dateRange.endDate}
          </p>
        </div>
        <button
          onClick={onRequestFeedback}
          disabled={!onRequestFeedback}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Request Feedback
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm font-medium">Total Feedback</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{totalFeedback}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm font-medium">Collection Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{(collectionRate * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm font-medium">Avg per Day</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {feedbackData.length > 0 ? (totalFeedback / feedbackData.length).toFixed(1) : 0}
          </p>
        </div>
      </div>

      {/* Feedback Volume Timeline */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Volume Over Time</h3>
        <div className="space-y-2">
          {feedbackData.length > 0 ? (
            feedbackData.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-600 w-24">{item.date}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  >
                    {item.count > 0 && <span className="text-xs font-semibold text-white">{item.count}</span>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No feedback data available</p>
          )}
        </div>
      </div>

      {/* Sentiment Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
        <div className="space-y-3">
          {/* Positive */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">😊 Positive</span>
              <span className="text-sm font-semibold text-gray-900">
                {sentimentBreakdown.positive} ({positivePercent}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${positivePercent}%` }}></div>
            </div>
          </div>

          {/* Neutral */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">😐 Neutral</span>
              <span className="text-sm font-semibold text-gray-900">
                {sentimentBreakdown.neutral} ({neutralPercent}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${neutralPercent}%` }}></div>
            </div>
          </div>

          {/* Negative */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">😞 Negative</span>
              <span className="text-sm font-semibold text-gray-900">
                {sentimentBreakdown.negative} ({negativePercent}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${negativePercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="border-t pt-4">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <span className="text-sm text-gray-600">
              <span className="font-semibold">{sentimentBreakdown.positive}</span> positive responses
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">!</span>
            <span className="text-sm text-gray-600">
              <span className="font-semibold">{sentimentBreakdown.negative}</span> negative responses
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg">⋯</span>
            <span className="text-sm text-gray-600">
              <span className="font-semibold">{sentimentBreakdown.neutral}</span> neutral responses
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCollectionCard;
