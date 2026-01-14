import { render, screen } from "@testing-library/react";
import RecommendationImpactDashboard from '../../components/insights/RecommendationImpactDashboard';

describe("RecommendationImpactDashboard", () => {
  const mockMetrics = {
    productRecommendations: {
      totalGenerated: 1250,
      clickThroughRate: 0.042,
      conversionRate: 0.018,
      accuracy: 0.876,
    },
    customerEngagement: {
      emailOpenRate: 0.34,
      pushNotificationClickRate: 0.28,
      sessionEngagement: 0.65,
      retentionRate: 0.82,
    },
    orderConversions: {
      totalOrders: 3420,
      averageOrderValue: 157.5,
      conversionLift: 0.23,
      revenueImpact: 537500,
    },
    realTimeAccuracy: {
      current: 0.891,
      trend: 0.05,
      lastUpdated: "2024-01-14T10:30:00Z",
    },
  };

  it("renders product recommendation metrics", () => {
    render(
      <RecommendationImpactDashboard recommendationMetrics={mockMetrics} />
    );

    expect(screen.getByText("1,250")).toBeInTheDocument();
    expect(screen.getByText("4.2%")).toBeInTheDocument();
    expect(screen.getByText("1.8%")).toBeInTheDocument();
    expect(screen.getByText("87.6%")).toBeInTheDocument();
  });

  it("renders customer engagement metrics", () => {
    render(
      <RecommendationImpactDashboard recommendationMetrics={mockMetrics} />
    );

    expect(screen.getByText("34.0%")).toBeInTheDocument();
    expect(screen.getByText("28.0%")).toBeInTheDocument();
    expect(screen.getByText("65.0%")).toBeInTheDocument();
    expect(screen.getByText("82.0%")).toBeInTheDocument();
  });

  it("renders order conversion metrics with trend indicators", () => {
    render(
      <RecommendationImpactDashboard recommendationMetrics={mockMetrics} />
    );

    expect(screen.getByText("3,420")).toBeInTheDocument();
    expect(screen.getByText("157.5")).toBeInTheDocument();
    expect(screen.getByText("23.0%")).toBeInTheDocument();
    expect(screen.getByText("537,500")).toBeInTheDocument();
    expect(screen.getByText(/vs last period/)).toBeInTheDocument();
  });
});
