import { render, screen } from "@testing-library/react";
import SegmentEngagementHeatmap from '../../components/insights/SegmentEngagementHeatmap';

describe("SegmentEngagementHeatmap", () => {
  it("renders the component title", () => {
    const segments = [];
    const metrics = {};

    render(
      <SegmentEngagementHeatmap segments={segments} metrics={metrics} />
    );

    expect(screen.getByText("Segment Engagement Heatmap")).toBeInTheDocument();
  });

  it("renders segment names and metric labels", () => {
    const segments = [
      { id: "seg1", name: "Premium Users" },
      { id: "seg2", name: "Active Followers" },
    ];
    const metrics = {
      seg1: { feedbackRate: 0.85, contentInteraction: 0.72, campaignResponse: 0.65 },
      seg2: { feedbackRate: 0.45, contentInteraction: 0.55, campaignResponse: 0.48 },
    };

    render(
      <SegmentEngagementHeatmap segments={segments} metrics={metrics} />
    );

    expect(screen.getByText("Premium Users")).toBeInTheDocument();
    expect(screen.getByText("Active Followers")).toBeInTheDocument();
    expect(screen.getByText("Feedback Rate")).toBeInTheDocument();
    expect(screen.getByText("Content Interaction")).toBeInTheDocument();
    expect(screen.getByText("Campaign Response")).toBeInTheDocument();
  });

  it("renders date range when provided", () => {
    const segments = [];
    const metrics = {};
    const dateRange = "Jan 1 - Jan 31, 2024";

    render(
      <SegmentEngagementHeatmap
        segments={segments}
        metrics={metrics}
        dateRange={dateRange}
      />
    );

    expect(screen.getByText(/Period: Jan 1 - Jan 31, 2024/)).toBeInTheDocument();
  });
});
