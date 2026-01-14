import { render, screen } from "@testing-library/react";
import CampaignSegmentMatrix from '../../components/crm/CampaignSegmentMatrix';

describe("CampaignSegmentMatrix", () => {
  it("renders the campaign performance heatmap title", () => {
    const campaigns = [{ id: "1", name: "Campaign A" }];
    const segments = [{ id: "s1", name: "Segment A" }];

    render(
      <CampaignSegmentMatrix campaigns={campaigns} segments={segments} />
    );

    expect(screen.getByText("Campaign Performance Heatmap")).toBeInTheDocument();
  });

  it("renders default metric label as conversion rate", () => {
    const campaigns = [{ id: "1", name: "Campaign A" }];
    const segments = [{ id: "s1", name: "Segment A" }];

    render(
      <CampaignSegmentMatrix campaigns={campaigns} segments={segments} />
    );

    expect(screen.getByText("Conversion Rate (%)")).toBeInTheDocument();
  });

  it("renders custom metric label based on metric prop", () => {
    const campaigns = [{ id: "1", name: "Campaign A" }];
    const segments = [{ id: "s1", name: "Segment A" }];

    render(
      <CampaignSegmentMatrix
        campaigns={campaigns}
        segments={segments}
        metric="revenue"
      />
    );

    expect(screen.getByText("Revenue ($)")).toBeInTheDocument();
  });
});
