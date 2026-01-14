import { render, screen } from "@testing-library/react";
import SegmentEngagementHealthCard from '../../components/crm/SegmentEngagementHealthCard';

describe("SegmentEngagementHealthCard", () => {
  it("renders segment name and ID", () => {
    render(
      <SegmentEngagementHealthCard
        segmentId="seg-123"
        segmentName="Premium Users"
        feedbackCount={45}
        engagementScore={85}
        trendDirection="up"
        customerCount={150}
      />
    );

    expect(screen.getByText("Premium Users")).toBeInTheDocument();
    expect(screen.getByText("ID: seg-123")).toBeInTheDocument();
  });

  it("renders engagement score and metrics", () => {
    render(
      <SegmentEngagementHealthCard
        segmentId="seg-456"
        segmentName="Active Segment"
        feedbackCount={32}
        engagementScore={72}
        trendDirection="down"
        customerCount={89}
      />
    );

    expect(screen.getByText("72")).toBeInTheDocument();
    expect(screen.getByText("32")).toBeInTheDocument();
    expect(screen.getByText("89")).toBeInTheDocument();
  });

  it("renders feedback and customer labels", () => {
    render(
      <SegmentEngagementHealthCard
        segmentId="seg-789"
        segmentName="Test Segment"
        feedbackCount={10}
        engagementScore={55}
        trendDirection="up"
        customerCount={200}
      />
    );

    expect(screen.getByText("Feedback Volume")).toBeInTheDocument();
    expect(screen.getByText("Active Customers")).toBeInTheDocument();
  });
});
