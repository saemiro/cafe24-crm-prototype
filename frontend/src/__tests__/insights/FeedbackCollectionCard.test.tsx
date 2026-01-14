import { render, screen } from "@testing-library/react";
import FeedbackCollectionCard from '../../components/insights/FeedbackCollectionCard';

describe("FeedbackCollectionCard", () => {
  const mockProps = {
    dateRange: {
      startDate: "2024-01-01",
      endDate: "2024-01-31",
    },
    feedbackData: [
      { date: "2024-01-01", count: 5 },
      { date: "2024-01-02", count: 3 },
    ],
    sentimentBreakdown: {
      positive: 6,
      neutral: 2,
      negative: 0,
    },
    collectionRate: 75,
  };

  it("renders feedback collection heading", () => {
    render(<FeedbackCollectionCard {...mockProps} />);
    expect(screen.getByText("Feedback Collection")).toBeInTheDocument();
  });

  it("displays date range when provided", () => {
    render(<FeedbackCollectionCard {...mockProps} />);
    expect(screen.getByText("2024-01-01 to 2024-01-31")).toBeInTheDocument();
  });

  it("displays customer id when provided", () => {
    render(<FeedbackCollectionCard {...mockProps} customerId="CUST-123" />);
    expect(screen.getByText("Customer ID: CUST-123")).toBeInTheDocument();
  });

  it("displays total feedback count", () => {
    render(<FeedbackCollectionCard {...mockProps} />);
    expect(screen.getByText("Total Feedback")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });

  it("renders request feedback button", () => {
    const mockFeedback = jest.fn();
    render(
      <FeedbackCollectionCard {...mockProps} onRequestFeedback={mockFeedback} />
    );
    const button = screen.getByRole("button", { name: "Request Feedback" });
    expect(button).toBeInTheDocument();
  });
});
