import { render, screen } from "@testing-library/react";
import RecommendationConversionTrend from '../../components/insights/RecommendationConversionTrend';

describe("RecommendationConversionTrend", () => {
  const mockMetrics = [
    {
      date: "2024-01-01",
      ctr: 2.5,
      conversionRate: 3.2,
      revenue: 1000,
      recommendations: 500,
      orders: 16,
    },
    {
      date: "2024-01-02",
      ctr: 2.8,
      conversionRate: 3.5,
      revenue: 1200,
      recommendations: 520,
      orders: 18,
    },
    {
      date: "2024-01-03",
      ctr: 3.1,
      conversionRate: 3.8,
      revenue: 1400,
      recommendations: 540,
      orders: 21,
    },
  ];

  it("renders component title and time range", () => {
    render(
      <RecommendationConversionTrend
        timeRange="Last 30 Days"
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText("Recommendation Conversion Trend")).toBeInTheDocument();
    expect(screen.getByText(/Last 30 Days/)).toBeInTheDocument();
  });

  it("displays segment and campaign information when provided", () => {
    render(
      <RecommendationConversionTrend
        timeRange="Last 7 Days"
        segmentId="SEG-123"
        campaignId="CAMP-456"
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText(/Segment: SEG-123/)).toBeInTheDocument();
    expect(screen.getByText(/Campaign: CAMP-456/)).toBeInTheDocument();
  });

  it("renders metric values calculated from data", () => {
    render(
      <RecommendationConversionTrend
        timeRange="Last 14 Days"
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText(/2.80/)).toBeInTheDocument();
    expect(screen.getByText(/3.50/)).toBeInTheDocument();
    expect(screen.getByText(/3600/)).toBeInTheDocument();
    expect(screen.getByText(/1560/)).toBeInTheDocument();
    expect(screen.getByText(/55/)).toBeInTheDocument();
  });
});
