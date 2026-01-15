import { render, screen } from "@testing-library/react";
import CampaignSegmentHeatmap from '../../components/insights/CampaignSegmentHeatmap';

describe("CampaignSegmentHeatmap", () => {
  const mockCampaigns = [
    { id: "camp1", name: "Campaign A" },
    { id: "camp2", name: "Campaign B" },
  ];

  const mockSegments = [
    { id: "seg1", name: "Segment X" },
    { id: "seg2", name: "Segment Y" },
  ];

  it("renders the heatmap title and metric display", () => {
    render(
      <CampaignSegmentHeatmap
        campaigns={mockCampaigns}
        segments={mockSegments}
        metric="conversion_rate"
      />
    );

    expect(screen.getByText("Campaign Performance Heatmap")).toBeInTheDocument();
    expect(screen.getByText("Conversion Rate")).toBeInTheDocument();
  });

  it("displays all campaign and segment names in the table", () => {
    render(
      <CampaignSegmentHeatmap
        campaigns={mockCampaigns}
        segments={mockSegments}
        metric="engagement"
      />
    );

    expect(screen.getByText("Campaign A")).toBeInTheDocument();
    expect(screen.getByText("Campaign B")).toBeInTheDocument();
    expect(screen.getByText("Segment X")).toBeInTheDocument();
    expect(screen.getByText("Segment Y")).toBeInTheDocument();
  });

  it("renders date range when provided", () => {
    render(
      <CampaignSegmentHeatmap
        campaigns={mockCampaigns}
        segments={mockSegments}
        metric="revenue"
        dateRange={{ start: "2024-01-01", end: "2024-12-31" }}
      />
    );

    expect(screen.getByText(/2024-01-01 to 2024-12-31/)).toBeInTheDocument();
  });
});
