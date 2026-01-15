import { render, screen } from "@testing-library/react";
import SegmentHealthMonitor from '../../components/crm/SegmentHealthMonitor';

describe("SegmentHealthMonitor", () => {
  it("renders segment id and title", () => {
    const metrics = [
      { name: "engagement", value: 85, trend: "up" as const },
    ];
    render(
      <SegmentHealthMonitor
        segmentId="seg-123"
        metrics={metrics}
      />
    );

    expect(screen.getByText("Segment Health")).toBeInTheDocument();
    expect(screen.getByText("ID: seg-123")).toBeInTheDocument();
  });

  it("displays healthy status when average metric value is 75 or above", () => {
    const metrics = [
      { name: "engagement", value: 80, trend: "up" as const },
      { name: "retention", value: 85, trend: "stable" as const },
    ];
    render(
      <SegmentHealthMonitor
        segmentId="seg-456"
        metrics={metrics}
      />
    );

    expect(screen.getByText(/✓ Healthy/)).toBeInTheDocument();
  });

  it("displays warning status when average metric value is between 50 and 75", () => {
    const metrics = [
      { name: "engagement", value: 60, trend: "down" as const },
      { name: "retention", value: 65, trend: "stable" as const },
    ];
    render(
      <SegmentHealthMonitor
        segmentId="seg-789"
        metrics={metrics}
      />
    );

    expect(screen.getByText(/⚠ Warning/)).toBeInTheDocument();
  });
});
