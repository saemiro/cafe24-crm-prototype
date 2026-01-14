import { render, screen } from "@testing-library/react";
import DailyDigestHealthCard from '../../components/insights/DailyDigestHealthCard';

describe("DailyDigestHealthCard", () => {
  const defaultProps = {
    date: "January 14, 2026",
    totalInsights: 42,
    entityHealthScores: {
      customerEngagement: { score: 85, status: "healthy" as const },
      orderVolume: { score: 65, status: "warning" as const },
      campaignPerformance: { score: 30, status: "critical" as const },
    },
    contentGapCount: 5,
    feedbackCount: 12,
  };

  it("renders the header with title and date", () => {
    render(<DailyDigestHealthCard {...defaultProps} />);

    expect(screen.getByText("Daily Digest Health Report")).toBeInTheDocument();
    expect(screen.getByText("January 14, 2026")).toBeInTheDocument();
  });

  it("displays metric values for insights, content gaps, and feedback", () => {
    render(<DailyDigestHealthCard {...defaultProps} />);

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("renders metric labels", () => {
    render(<DailyDigestHealthCard {...defaultProps} />);

    expect(screen.getByText("Total Insights")).toBeInTheDocument();
    expect(screen.getByText("Content Gaps")).toBeInTheDocument();
    expect(screen.getByText("Feedback Items")).toBeInTheDocument();
  });
});
