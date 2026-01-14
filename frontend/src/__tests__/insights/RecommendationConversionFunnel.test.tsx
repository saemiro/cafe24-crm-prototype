import { render, screen } from "@testing-library/react";
import RecommendationConversionFunnel from '../../components/insights/RecommendationConversionFunnel';

describe("RecommendationConversionFunnel", () => {
  it("renders the component title and campaign info", () => {
    render(
      <RecommendationConversionFunnel
        campaignId="camp-123"
        dateRange={{ startDate: "2024-01-01", endDate: "2024-01-31" }}
      />
    );

    expect(screen.getByText("Recommendation Conversion Funnel")).toBeInTheDocument();
    expect(screen.getByText(/Campaign: camp-123/)).toBeInTheDocument();
    expect(screen.getByText(/2024-01-01 to 2024-01-31/)).toBeInTheDocument();
  });

  it("renders all funnel stages with their counts", () => {
    render(
      <RecommendationConversionFunnel
        campaignId="camp-456"
        dateRange={{ startDate: "2024-02-01", endDate: "2024-02-28" }}
      />
    );

    expect(screen.getByText(/Impression/)).toBeInTheDocument();
    expect(screen.getByText(/Click/)).toBeInTheDocument();
    expect(screen.getByText(/Add-to-Cart/)).toBeInTheDocument();
    expect(screen.getByText(/Purchase/)).toBeInTheDocument();
    expect(screen.getByText(/10000/)).toBeInTheDocument();
    expect(screen.getByText(/6500/)).toBeInTheDocument();
  });

  it("includes segment filter in info when provided", () => {
    render(
      <RecommendationConversionFunnel
        campaignId="camp-789"
        dateRange={{ startDate: "2024-03-01", endDate: "2024-03-31" }}
        segmentFilter="Mobile Users"
      />
    );

    expect(screen.getByText(/Segment: Mobile Users/)).toBeInTheDocument();
  });
});
