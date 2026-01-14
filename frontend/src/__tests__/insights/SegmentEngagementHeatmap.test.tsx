import { render, screen } from "@testing-library/react";
import SegmentEngagementHeatmap from '../../components/insights/SegmentEngagementHeatmap';

describe("SegmentEngagementHeatmap", () => {
  it("renders the component title and description", () => {
    const segments = [{ id: "seg1", name: "Premium Users" }];
    const campaigns = [{ id: "camp1", name: "Email Campaign" }];
    const engagementData = { seg1: { camp1: 0.8 } };

    render(
      <SegmentEngagementHeatmap
        segments={segments}
        campaigns={campaigns}
        engagementData={engagementData}
      />
    );

    expect(screen.getByText("Segment Engagement Heatmap")).toBeInTheDocument();
    expect(
      screen.getByText("Customer engagement levels across segments and campaigns")
    ).toBeInTheDocument();
  });

  it("renders all segment names and campaign names in the heatmap", () => {
    const segments = [
      { id: "seg1", name: "Enterprise" },
      { id: "seg2", name: "Startup" },
    ];
    const campaigns = [
      { id: "camp1", name: "Q1 Launch" },
      { id: "camp2", name: "Summer Sale" },
    ];
    const engagementData = {
      seg1: { camp1: 0.9, camp2: 0.7 },
      seg2: { camp1: 0.5, camp2: 0.3 },
    };

    render(
      <SegmentEngagementHeatmap
        segments={segments}
        campaigns={campaigns}
        engagementData={engagementData}
      />
    );

    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("Startup")).toBeInTheDocument();
    expect(screen.getByText("Q1 Launch")).toBeInTheDocument();
    expect(screen.getByText("Summer Sale")).toBeInTheDocument();
  });

  it("displays legend with all engagement level ranges", () => {
    const segments = [{ id: "seg1", name: "Users" }];
    const campaigns = [{ id: "camp1", name: "Campaign" }];
    const engagementData = { seg1: { camp1: 0.5 } };

    render(
      <SegmentEngagementHeatmap
        segments={segments}
        campaigns={campaigns}
        engagementData={engagementData}
      />
    );

    expect(screen.getByText("High (80%+)")).toBeInTheDocument();
    expect(screen.getByText("Good (60-80%)")).toBeInTheDocument();
  });
});
