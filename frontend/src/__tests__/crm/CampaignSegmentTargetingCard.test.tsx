import { render, screen } from "@testing-library/react";
import CampaignSegmentTargetingCard from '../../components/crm/CampaignSegmentTargetingCard';

describe("CampaignSegmentTargetingCard", () => {
  const mockMetrics = {
    totalConversions: 150,
    avgEngagement: 45.5,
    topPerformingSegment: "Premium Users",
    improvementOpportunities: 3,
  };

  const mockSegments = [
    {
      id: "seg1",
      name: "Premium Users",
      size: 500,
      conversionRate: 8.5,
      engagement: 75,
      recommended: true,
    },
    {
      id: "seg2",
      name: "Free Users",
      size: 2000,
      conversionRate: 3.2,
      engagement: 45,
      recommended: false,
    },
  ];

  it("renders campaign title and ID", () => {
    render(
      <CampaignSegmentTargetingCard
        campaignId="camp123"
        segments={mockSegments}
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText("Campaign Segment Performance")).toBeInTheDocument();
    expect(screen.getByText(/ID: camp123/)).toBeInTheDocument();
  });

  it("displays all metrics with correct values", () => {
    render(
      <CampaignSegmentTargetingCard
        campaignId="camp123"
        segments={mockSegments}
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText("Total Conversions")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("Avg Engagement")).toBeInTheDocument();
    expect(screen.getByText("45.5%")).toBeInTheDocument();
    expect(screen.getByText("Top Segment")).toBeInTheDocument();
    expect(screen.getByText("Premium Users")).toBeInTheDocument();
    expect(screen.getByText("Opportunities")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders all segment names sorted by conversion rate", () => {
    render(
      <CampaignSegmentTargetingCard
        campaignId="camp123"
        segments={mockSegments}
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText("Premium Users")).toBeInTheDocument();
    expect(screen.getByText("Free Users")).toBeInTheDocument();
  });
});
