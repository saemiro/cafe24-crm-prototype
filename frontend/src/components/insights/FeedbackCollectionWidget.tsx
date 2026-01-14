import React from "react";

interface FeedbackCategory {
  id: string;
  label: string;
  emoji: string;
}

interface FeedbackCollectionWidgetProps {
  customerId: string;
  contextType: string;
  contextId: string;
  feedbackCategories?: FeedbackCategory[];
  onSubmit: (feedback: {
    customerId: string;
    contextType: string;
    contextId: string;
    rating: number;
    category: string;
    comment: string;
    timestamp: string;
  }) => void;
}

const FeedbackCollectionWidget: React.FC<FeedbackCollectionWidgetProps> = ({
  customerId,
  contextType,
  contextId,
  feedbackCategories = [
    { id: "excellent", label: "Excellent", emoji: "😍" },
    { id: "good", label: "Good", emoji: "😊" },
    { id: "neutral", label: "Neutral", emoji: "😐" },
    { id: "poor", label: "Poor", emoji: "😞" },
    { id: "terrible", label: "Terrible", emoji: "😠" },
  ],
  onSubmit,
}) => {
  const [selectedRating, setSelectedRating] = React.useState<number | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = React.useState<string>("");
  const [comment, setComment] = React.useState<string>("");
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedRating === null || !selectedCategory) {
      alert("Please select a rating and category");
      return;
    }

    setIsLoading(true);

    try {
      onSubmit({
        customerId,
        contextType,
        contextId,
        rating: selectedRating,
        category: selectedCategory,
        comment,
        timestamp: new Date().toISOString(),
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setSelectedRating(null);
        setSelectedCategory("");
        setComment("");
        setIsSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-2">✓</div>
          <h3 className="text-lg font-semibold text-green-800">
            Thank you for your feedback!
          </h3>
          <p className="text-sm text-green-700 mt-1">
            Your feedback helps us improve your experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Share Your Feedback
        </h2>
        <p className="text-sm text-gray-600">
          Help us improve by sharing your experience with this{" "}
          {contextType === "product" ? "product" : "order"}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            How would you rate this {contextType}?
          </label>
          <div className="flex justify-between gap-2">
            {feedbackCategories.map((category, index) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedRating(index + 1)}
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  selectedRating === index + 1
                    ? "bg-blue-100 border-2 border-blue-500 scale-110"
                    : "bg-gray-100 border-2 border-gray-300 hover:bg-gray-200"
                }`}
              >
                <span className="text-2xl">{category.emoji}</span>
                <span className="text-xs mt-1 text-gray-700">
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What was your experience about?
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          >
            <option value="">Select a category</option>
            <option value="quality">Quality</option>
            <option value="delivery">Delivery</option>
            <option value="value_for_money">Value for Money</option>
            <option value="customer_service">Customer Service</option>
            <option value="packaging">Packaging</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional comments (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || selectedRating === null || !selectedCategory}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
            isLoading || selectedRating === null || !selectedCategory
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }`}
        >
          {isLoading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Your feedback is valuable and helps us improve your experience.
      </div>
    </div>
  );
};

export default FeedbackCollectionWidget;
