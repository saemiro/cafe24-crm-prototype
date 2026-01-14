import { render, screen } from "@testing-library/react";
import SegmentHealthMonitor from '../../components/insights/SegmentHealthMonitor';

describe("SegmentHealthMonitor", () => {
  const mockSegments = [
    {
      id: "1",
      name: "Premium Users",
      engagementScore: 85,
      orderVelocity: 8,
      churnRisk: 10,
      campaignResponsiveness: 90,
      size: 5000,
      lastUpdated: "2024-01-14",
    },
    {
      id: "2",
      name: "At-Risk Segment",
      engagementScore: 35,
      orderVelocity: 1,
      churnRisk: 80,
      campaignResponsiveness: 20,
      size: 2000,
      lastUpdated: "2024-01-14",
    },
  ];

  it("renders the component title and time range information", () => {
    render(<SegmentHealthMonitor segments={mockSegments} timeRange="30d" healthThreshold={60} />);

    expect(screen.getByText("Segment Health Monitor")).toBeInTheDocument();
    expect(screen.getByText(/Time Range: 30d/)).toBeInTheDocument();
    expect(screen.getByText(/Health Threshold: 60%/)).toBeInTheDocument();
  });

  it("displays segment names and health status", () => {
    render(<SegmentHealthMonitor segments={mockSegments} />);

    expect(screen.getByText("Premium Users")).toBeInTheDocument();
    expect(screen.getByText("At-Risk Segment")).toBeInTheDocument();
    expect(screen.getByText("Excellent")).toBeInTheDocument();
    expect(screen.getByText("Poor")).toBeInTheDocument();
  });

  it("displays alert messages for segments with issues", () => {
    render(<SegmentHealthMonitor segments={mockSegments} />);

    expect(screen.getByText("High churn risk")).toBeInTheDocument();
    expect(screen.getByText("Low engagement")).toBeInTheDocument();
    expect(screen.getByText("Declining order velocity")).toBeInTheDocument();
    expect(screen.getByText("Poor campaign response")).toBeInTheDocument();
  });
});
