import { render, screen } from "@testing-library/react";
import CustomerEngagementTimeline from '../../components/insights/CustomerEngagementTimeline';

describe("CustomerEngagementTimeline", () => {
  it("renders with provided metrics", () => {
    const props = {
      dateRange: { startDate: "2024-01-01", endDate: "2024-01-31" },
      metrics: ["engagement", "retention"],
    };
    render(<CustomerEngagementTimeline {...props} />);
    expect(screen.getByText("engagement")).toBeInTheDocument();
    expect(screen.getByText("retention")).toBeInTheDocument();
  });

  it("displays default segments when none provided", () => {
    const props = {
      dateRange: { startDate: "2024-01-01", endDate: "2024-01-31" },
      metrics: ["order-frequency"],
    };
    render(<CustomerEngagementTimeline {...props} />);
    expect(screen.getByText("VIP")).toBeInTheDocument();
    expect(screen.getByText("Standard")).toBeInTheDocument();
    expect(screen.getByText("At-Risk")).toBeInTheDocument();
  });

  it("renders custom segments when provided", () => {
    const props = {
      dateRange: { startDate: "2024-01-01", endDate: "2024-01-31" },
      metrics: ["campaign-response"],
      segmentIds: ["Premium", "Basic"],
    };
    render(<CustomerEngagementTimeline {...props} />);
    expect(screen.getByText("Premium")).toBeInTheDocument();
    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.queryByText("VIP")).not.toBeInTheDocument();
  });
});
