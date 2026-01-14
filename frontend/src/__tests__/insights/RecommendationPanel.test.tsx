import { render, screen } from "@testing-library/react";
import RecommendationPanel from '../../components/insights/RecommendationPanel';

describe("RecommendationPanel", () => {
  const mockMetrics = {
    ctr: 0.15,
    conversionRate: 0.08,
    impressions: 1000,
    clicks: 150,
    conversions: 80,
  };

  const mockRecommendations = [
    {
      id: "1",
      productName: "Laptop",
      category: "Electronics",
      price: 999.99,
      imageUrl: "https://example.com/laptop.jpg",
      confidenceScore: 0.95,
    },
    {
      id: "2",
      productName: "Mouse",
      category: "Accessories",
      price: 29.99,
      imageUrl: "https://example.com/mouse.jpg",
      confidenceScore: 0.72,
    },
  ];

  it("renders the Product Recommendations heading", () => {
    render(
      <RecommendationPanel
        recommendations={mockRecommendations}
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText("Product Recommendations")).toBeInTheDocument();
  });

  it("displays customer ID when provided", () => {
    const customerId = "CUST-12345";
    render(
      <RecommendationPanel
        recommendations={mockRecommendations}
        metrics={mockMetrics}
        customerId={customerId}
      />
    );

    expect(screen.getByText(`Customer ID: ${customerId}`)).toBeInTheDocument();
  });

  it("renders metrics with formatted percentages and impression count", () => {
    render(
      <RecommendationPanel
        recommendations={mockRecommendations}
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText("15.00%")).toBeInTheDocument();
    expect(screen.getByText("8.00%")).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument();
  });
});
