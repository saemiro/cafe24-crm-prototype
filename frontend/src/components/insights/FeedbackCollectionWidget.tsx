import React from "react";

interface FeedbackTemplate {
  id: string;
  title: string;
  questions: string[];
}

interface FeedbackCollectionWidgetProps {
  segmentId?: string;
  entityType: string;
  entityId: string;
  feedbackTemplates?: FeedbackTemplate[];
  responseRate?: number;
  onSubmit: (feedback: {
    entityType: string;
    entityId: string;
    segmentId?: string;
    rating: number;
    comment: string;
    templateId?: string;
  }) => void;
}

interface FeedbackRequest {
  id: string;
  timestamp: string;
  status: "pending" | "completed";
  type: string;
}

interface CompletionRateData {
  segment: string;
  rate: number;
  responses: number;
}

const FeedbackCollectionWidget: React.FC<FeedbackCollectionWidgetProps> = ({
  segmentId,
  entityType,
  entityId,
  feedbackTemplates = [],
  responseRate = 0,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = React.useState<"submit" | "history" | "analytics">("submit");
  const [rating, setRating] = React.useState<number>(0);
  const [comment, setComment] = React.useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("");
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const mockFeedbackRequests: FeedbackRequest[] = [
    { id: "1", timestamp: "2024-01-13", status: "completed", type: "Order Review" },
    { id: "2", timestamp: "2024-01-12", status: "pending", type: "Product Feedback" },
    { id: "3", timestamp: "2024-01-11", status: "completed", type: "Campaign Response" },
    { id: "4", timestamp: "2024-01-10", status: "completed", type: "Order Review" },
    { id: "5", timestamp: "2024-01-09", status: "pending", type: "Product Feedback" },
  ];

  const mockCompletionRates: CompletionRateData[] = [
    { segment: "Premium", rate: 85, responses: 340 },
    { segment: "Standard", rate: 62, responses: 498 },
    { segment: "New Customers", rate: 45, responses: 156 },
    { segment: "Inactive", rate: 28, responses: 89 },
  ];

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit({
        entityType,
        entityId,
        segmentId,
        rating,
        comment,
        templateId: selectedTemplate || undefined,
      });
      setSubmitted(true);
      setTimeout(() => {
        setRating(0);
        setComment("");
        setSelectedTemplate("");
        setSubmitted(false);
      }, 2000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📝 Feedback Collection
        </h2>
        <p className="text-sm text-gray-600">
          Entity: {entityType} (ID: {entityId})
          {segmentId && <span className="ml-4">Segment: {segmentId}</span>}
        </p>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("submit")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "submit"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          ✍️ Submit Feedback
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "history"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📋 Recent Requests
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === "analytics"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📊 Analytics
        </button>
      </div>

      {activeTab === "submit" && (
        <div className="space-y-6">
          {feedbackTemplates.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📌 Feedback Template
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a template (optional) --</option>
                {feedbackTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ⭐ Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-4xl transition-transform hover:scale-110 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                You selected {rating} star{rating !== 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💬 Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your feedback..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>

          <button
            onClick={handleSubmitFeedback}
            disabled={rating === 0}
            className={`w-full py-3 font-semibold rounded-lg transition-all ${
              rating === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
            }`}
          >
            {submitted ? "✓ Submitted Successfully!" : "Send Feedback"}
          </button>
        </div>
      )}

      {activeTab === "history" && (
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-4">
            📬 Total Requests: {mockFeedbackRequests.length}
          </div>
          {mockFeedbackRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{request.type}</p>
                <p className="text-sm text-gray-500">{request.timestamp}</p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  request.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {request.status === "completed" ? "✓ Completed" : "⏳ Pending"}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Overall Response Rate</p>
              <p className="text-3xl font-bold text-blue-600">{responseRate}%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Feedback Count</p>
              <p className="text-3xl font-bold text-green-600">
                {mockFeedbackRequests.filter((r) => r.status === "completed").length}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">📈 Completion Rate by Segment</h3>
            <div className="space-y-3">
              {mockCompletionRates.map((data) => (
                <div key={data.segment}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-semibold text-gray-700">{data.segment}</p>
                    <p className="text-sm text-gray-600">{data.rate}% ({data.responses} responses)</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${data.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackCollectionWidget;
