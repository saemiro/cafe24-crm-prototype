import { render, screen } from "@testing-library/react";
import CampaignSegmentPerformanceMatrix from '../../components/crm/CampaignSegmentPerformanceMatrix';

describe("CampaignSegmentPerformanceMatrix", () => {
  it("renders campaign names and segment names in the matrix", () => {
    const campaigns = [
      { id: "1", name: "Summer Campaign" },
      { id: "2", name: "Winter Campaign" },
    ];
    const segments = [
      { id: "a", name: "Premium Users" },
      { id: "b", name: "Free Users" },
    ];
    const performanceMetrics = {
      "1": {
        a: { conversionRate: 5 },
        b: { conversionRate: 3 },
      },
      "2": {
        a: { conversionRate: 4 },
        b: { conversionRate: 2 },
      },
    };

    render(
      <CampaignSegmentPerformanceMatrix
        campaigns={campaigns}
        segments={segments}
        performanceMetrics={performanceMetrics}
      />
    );

    expect(screen.getByText("Summer Campaign")).toBeInTheDocument();
    expect(screen.getByText("Winter Campaign")).toBeInTheDocument();
    expect(screen.getByText("Premium Users")).toBeInTheDocument();
    expect(screen.getByText("Free Users")).toBeInTheDocument();
  });

  it("displays the correct metric label based on metricType prop", () => {
    const campaigns = [{ id: "1", name: "Campaign A" }];
    const segments = [{ id: "a", name: "Segment A" }];
    const performanceMetrics = {
      "1": { a: { revenue: 1000 } },
    };

    render(
      <CampaignSegmentPerformanceMatrix
        campaigns={campaigns}
        segments={segments}
        performanceMetrics={performanceMetrics}
        metricType="revenue"
      />
    );

    expect(screen.getByText("Revenue ($)")).toBeInTheDocument();
  });

  it("renders performance values in cells for each campaign-segment pair", () => {
    const campaigns = [{ id: "1", name: "Campaign A" }];
    const segments = [{ id: "a", name: "Segment A" }];
    const performanceMetrics = {
      "1": { a: { conversionRate: 7.5 } },
    };

    render(
      <CampaignSegmentPerformanceMatrix
        campaigns={campaigns}
        segments={segments}
        performanceMetrics={performanceMetrics}
      />
    );

    expect(screen.getByText("7.5")).toBeInTheDocument();
  });
});
