import { render, screen } from "@testing-library/react";
import RecommendationPerformanceCard from '../../components/insights/RecommendationPerformanceCard';

describe("RecommendationPerformanceCard", () => {
  it("renders the component title and period", () => {
    render(
      <RecommendationPerformanceCard
        clickThroughRate={0.25}
        conversionRate={0.15}
        accuracyScore={0.85}
        totalRecommendations={1000}
      />
    );

    expect(screen.getByText("Recommendation Performance")).toBeInTheDocument();
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it("renders performance metrics with correctly formatted values", () => {
    render(
      <RecommendationPerformanceCard
        clickThroughRate={0.25}
        conversionRate={0.15}
        accuracyScore={0.85}
        totalRecommendations={5000}
        period="Last 7 days"
      />
    );

    expect(screen.getByText("Click-Through Rate")).toBeInTheDocument();
    expect(screen.getByText("25.0%")).toBeInTheDocument();
    expect(screen.getByText("Conversion Rate")).toBeInTheDocument();
    expect(screen.getByText("15.0%")).toBeInTheDocument();
    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
  });

  it("renders accuracy score and total recommendations", () => {
    render(
      <RecommendationPerformanceCard
        clickThroughRate={0.1}
        conversionRate={0.05}
        accuracyScore={0.92}
        totalRecommendations={10000}
      />
    );

    expect(screen.getByText("92.0%")).toBeInTheDocument();
    expect(screen.getByText("10,000")).toBeInTheDocument();
  });
});
