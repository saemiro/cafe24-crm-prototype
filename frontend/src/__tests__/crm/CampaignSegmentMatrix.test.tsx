import { render, screen } from "@testing-library/react";
import CampaignSegmentMatrix from '../../components/crm/CampaignSegmentMatrix';

describe("CampaignSegmentMatrix", () => {
  it("renders the component title", () => {
    const campaigns = [{ id: "1", name: "Campaign A" }];
    const segments = [{ id: "1", name: "Segment A" }];

    render(
      <CampaignSegmentMatrix campaigns={campaigns} segments={segments} />
    );

    expect(screen.getByText("Campaign Segment Performance Matrix")).toBeInTheDocument();
  });

  it("displays the metric label and date range in the subtitle", () => {
    const campaigns = [{ id: "1", name: "Campaign A" }];
    const segments = [{ id: "1", name: "Segment A" }];
    const dateRange = { startDate: "2024-01-01", endDate: "2024-01-31" };

    render(
      <CampaignSegmentMatrix
        campaigns={campaigns}
        segments={segments}
        metric="revenue"
        dateRange={dateRange}
      />
    );

    expect(screen.getByText(/Revenue • 2024-01-01 to 2024-01-31/)).toBeInTheDocument();
  });

  it("renders campaign names and segment names in the table", () => {
    const campaigns = [
      { id: "1", name: "Campaign A" },
      { id: "2", name: "Campaign B" },
    ];
    const segments = [
      { id: "1", name: "Segment X" },
      { id: "2", name: "Segment Y" },
    ];

    render(
      <CampaignSegmentMatrix campaigns={campaigns} segments={segments} />
    );

    expect(screen.getByText("Campaign A")).toBeInTheDocument();
    expect(screen.getByText("Campaign B")).toBeInTheDocument();
    expect(screen.getByText("Segment X")).toBeInTheDocument();
    expect(screen.getByText("Segment Y")).toBeInTheDocument();
  });
});
