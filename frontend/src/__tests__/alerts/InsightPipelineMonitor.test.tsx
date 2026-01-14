import { render, screen } from "@testing-library/react";
import InsightPipelineMonitor from '../../components/alerts/InsightPipelineMonitor';

describe("InsightPipelineMonitor", () => {
  it("renders insight type names", () => {
    const insightTypes = [
      {
        id: "1",
        name: "User Engagement",
        contentQuality: 85,
        processingStatus: "completed" as const,
        lastUpdated: new Date(),
        itemCount: 42,
      },
    ];

    render(<InsightPipelineMonitor insightTypes={insightTypes} />);

    expect(screen.getByText("User Engagement")).toBeInTheDocument();
  });

  it("renders item count for each insight", () => {
    const insightTypes = [
      {
        id: "1",
        name: "Test Insight",
        contentQuality: 75,
        processingStatus: "idle" as const,
        lastUpdated: new Date(),
        itemCount: 15,
      },
    ];

    render(<InsightPipelineMonitor insightTypes={insightTypes} />);

    expect(screen.getByText(/15/)).toBeInTheDocument();
  });

  it("renders multiple insight types", () => {
    const insightTypes = [
      {
        id: "1",
        name: "Engagement",
        contentQuality: 80,
        processingStatus: "completed" as const,
        lastUpdated: new Date(),
        itemCount: 10,
      },
      {
        id: "2",
        name: "Retention",
        contentQuality: 65,
        processingStatus: "processing" as const,
        lastUpdated: new Date(),
        itemCount: 20,
      },
    ];

    render(<InsightPipelineMonitor insightTypes={insightTypes} />);

    expect(screen.getByText("Engagement")).toBeInTheDocument();
    expect(screen.getByText("Retention")).toBeInTheDocument();
  });
});
