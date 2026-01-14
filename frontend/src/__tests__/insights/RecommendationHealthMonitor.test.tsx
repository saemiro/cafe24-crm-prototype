import { render, screen } from "@testing-library/react";
import RecommendationHealthMonitor from '../../components/insights/RecommendationHealthMonitor';

describe("RecommendationHealthMonitor", () => {
  const mockEngineStatus = {
    isHealthy: true,
    uptime: 86400,
    lastUpdate: "2024-01-14T10:00:00Z",
    activeRecommendations: 150,
    errorRate: 0.02,
  };

  const mockMetrics = {
    qualityScore: 0.95,
    conversionRate: 0.87,
    customerSatisfaction: 0.92,
    recommendationAccuracy: 0.88,
    engagementRate: 0.76,
    avgResponseTime: 245,
  };

  it("renders the header title", () => {
    render(
      <RecommendationHealthMonitor
        engineStatus={mockEngineStatus}
        metrics={mockMetrics}
        contentGenerationRate={0.85}
      />
    );

    expect(screen.getByText("Recommendation Health Monitor")).toBeInTheDocument();
  });

  it("displays the time window in subtitle", () => {
    render(
      <RecommendationHealthMonitor
        engineStatus={mockEngineStatus}
        metrics={mockMetrics}
        contentGenerationRate={0.85}
        timeWindow="48h"
      />
    );

    expect(screen.getByText(/Real-time AI Engine Health Dashboard • 48h/)).toBeInTheDocument();
  });

  it("formats and displays uptime correctly", () => {
    render(
      <RecommendationHealthMonitor
        engineStatus={mockEngineStatus}
        metrics={mockMetrics}
        contentGenerationRate={0.85}
      />
    );

    expect(screen.getByText("1d 0h")).toBeInTheDocument();
  });
});
