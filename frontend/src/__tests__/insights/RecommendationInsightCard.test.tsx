import { render, screen } from "@testing-library/react";
import RecommendationInsightCard from '../../components/insights/RecommendationInsightCard';

describe("RecommendationInsightCard", () => {
  it("renders the title and timeframe", () => {
    render(
      <RecommendationInsightCard
        timeframe="Last 30 Days"
        metrics={{ ctr: 0.08 }}
      />
    );

    expect(screen.getByText(/Recommendation Insights/i)).toBeInTheDocument();
    expect(screen.getByText("Last 30 Days")).toBeInTheDocument();
  });

  it("displays formatted metrics values", () => {
    render(
      <RecommendationInsightCard
        timeframe="This Month"
        metrics={{
          ctr: 0.12,
          conversionRate: 0.05,
          avgOrderValue: 150.5,
          totalRecommendations: 1000,
        }}
      />
    );

    expect(screen.getByText("12.00%")).toBeInTheDocument();
    expect(screen.getByText("5.00%")).toBeInTheDocument();
    expect(screen.getByText("$150.50")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });

  it("displays customer segment when provided", () => {
    render(
      <RecommendationInsightCard
        timeframe="Weekly"
        metrics={{ ctr: 0.06 }}
        customerSegment="VIP Customers"
      />
    );

    expect(screen.getByText("Segment:")).toBeInTheDocument();
    expect(screen.getByText("VIP Customers")).toBeInTheDocument();
  });
});
