import { render, screen } from "@testing-library/react";
import CampaignSegmentPerformanceMatrix from '../../components/crm/CampaignSegmentPerformanceMatrix';

describe("CampaignSegmentPerformanceMatrix", () => {
  it("renders campaign title and campaign ID", () => {
    const props = {
      campaignId: "CAMP-12345",
      segments: ["Segment A"],
      metrics: {
        "Segment A": {
          impressions: 1000,
          clicks: 50,
          conversions: 5,
          orders: 2,
          revenue: 200,
        },
      },
    };

    render(<CampaignSegmentPerformanceMatrix {...props} />);

    expect(screen.getByText("Campaign Performance Matrix")).toBeInTheDocument();
    expect(screen.getByText("CAMP-12345")).toBeInTheDocument();
  });

  it("renders date range when provided", () => {
    const props = {
      campaignId: "CAMP-456",
      segments: ["Segment B"],
      metrics: {
        "Segment B": {
          impressions: 2000,
          clicks: 100,
          conversions: 10,
          orders: 5,
          revenue: 500,
        },
      },
      dateRange: {
        start: "2024-01-01",
        end: "2024-01-31",
      },
    };

    render(<CampaignSegmentPerformanceMatrix {...props} />);

    expect(screen.getByText("2024-01-01 to 2024-01-31")).toBeInTheDocument();
  });

  it("renders comparison mode indicator when enabled", () => {
    const props = {
      campaignId: "CAMP-789",
      segments: ["Segment C"],
      metrics: {
        "Segment C": {
          impressions: 500,
          clicks: 25,
          conversions: 3,
          orders: 1,
          revenue: 150,
        },
      },
      comparisonMode: true,
    };

    render(<CampaignSegmentPerformanceMatrix {...props} />);

    expect(screen.getByText(/Comparison/i)).toBeInTheDocument();
  });
});
