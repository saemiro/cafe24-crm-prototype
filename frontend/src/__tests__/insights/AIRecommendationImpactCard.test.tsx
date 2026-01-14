import { render, screen } from "@testing-library/react";
import AIRecommendationImpactCard from '../../components/insights/AIRecommendationImpactCard';

describe("AIRecommendationImpactCard", () => {
  const mockMetrics = {
    totalConversions: 1250,
    conversionRate: 0.045,
    revenueLift: 0.23,
    averageOrderValue: 85.5,
  };

  it("renders the title and header information", () => {
    render(
      <AIRecommendationImpactCard timeRange="Last 30 Days" metrics={mockMetrics} />
    );

    expect(screen.getByText("AI Recommendation Impact")).toBeInTheDocument();
    expect(screen.getByText(/Period: Last 30 Days/)).toBeInTheDocument();
  });

  it("displays metric values with correct formatting", () => {
    render(
      <AIRecommendationImpactCard timeRange="Last 7 Days" metrics={mockMetrics} />
    );

    expect(screen.getByText("1,250")).toBeInTheDocument();
    expect(screen.getByText("4.5%")).toBeInTheDocument();
    expect(screen.getByText("23.0%")).toBeInTheDocument();
    expect(screen.getByText("$85.50")).toBeInTheDocument();
  });

  it("includes segment and campaign information when provided", () => {
    render(
      <AIRecommendationImpactCard
        segmentId="premium-users"
        campaignId="holiday-2024"
        timeRange="Last 30 Days"
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText(/Segment: premium-users/)).toBeInTheDocument();
    expect(screen.getByText(/Campaign: holiday-2024/)).toBeInTheDocument();
  });
});
