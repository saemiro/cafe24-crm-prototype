import { render, screen } from "@testing-library/react";
import RecommendationAnalyticsCard from '../../components/insights/RecommendationAnalyticsCard';

describe("RecommendationAnalyticsCard", () => {
  it("renders the card title and description with timeRange", () => {
    const props = {
      timeRange: "Last 30 Days",
      metrics: {},
    };
    render(<RecommendationAnalyticsCard {...props} />);
    expect(screen.getByText("Recommendation Analytics")).toBeInTheDocument();
    expect(screen.getByText("Performance metrics for Last 30 Days")).toBeInTheDocument();
  });

  it("renders metric values with labels when metrics are provided", () => {
    const props = {
      timeRange: "Last 7 Days",
      metrics: {
        productAccuracy: { value: 92, unit: "%" },
        ctr: { value: 4.5, unit: "%" },
        conversionRate: { value: 3.2, unit: "%" },
      },
    };
    render(<RecommendationAnalyticsCard {...props} />);
    expect(screen.getByText("92%")).toBeInTheDocument();
    expect(screen.getByText("4.5%")).toBeInTheDocument();
    expect(screen.getByText("3.2%")).toBeInTheDocument();
  });

  it("renders comparison enabled badge when comparisonEnabled is true", () => {
    const props = {
      timeRange: "Last 30 Days",
      metrics: {},
      comparisonEnabled: true,
    };
    render(<RecommendationAnalyticsCard {...props} />);
    expect(screen.getByText("Comparison Enabled")).toBeInTheDocument();
  });

  it("displays trend indicators when trend values are provided", () => {
    const props = {
      timeRange: "Last 30 Days",
      metrics: {
        productAccuracy: { value: 92, trend: 5 },
        customerAccuracy: { value: 88, trend: -2 },
      },
    };
    render(<RecommendationAnalyticsCard {...props} />);
    expect(screen.getByText("↑ 5%")).toBeInTheDocument();
    expect(screen.getByText("↓ 2%")).toBeInTheDocument();
  });

  it("renders segment breakdown names and values when provided", () => {
    const props = {
      timeRange: "Last 30 Days",
      metrics: {},
      segmentBreakdown: [
        { name: "Premium Users", accuracy: 95, ctr: 5.2, conversion: 4.1 },
        { name: "Standard Users", accuracy: 88, ctr: 3.8, conversion: 2.9 },
      ],
    };
    render(<RecommendationAnalyticsCard {...props} />);
    expect(screen.getByText("Premium Users")).toBeInTheDocument();
    expect(screen.getByText("Standard Users")).toBeInTheDocument();
  });
});
