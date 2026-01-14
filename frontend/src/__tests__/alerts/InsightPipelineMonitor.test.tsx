import { render, screen } from "@testing-library/react";
import InsightPipelineMonitor from '../../components/alerts/InsightPipelineMonitor';

describe("InsightPipelineMonitor", () => {
  it("displays the component title and subtitle", () => {
    render(
      <InsightPipelineMonitor
        totalInsights={100}
        emptyContentCount={20}
        typeDistribution={[]}
        pipelineStatus="healthy"
      />
    );

    expect(screen.getByText("Insight Pipeline Monitor")).toBeInTheDocument();
    expect(
      screen.getByText("Real-time data pipeline health metrics")
    ).toBeInTheDocument();
  });

  it("displays the completeness rate based on total and empty content", () => {
    render(
      <InsightPipelineMonitor
        totalInsights={100}
        emptyContentCount={25}
        typeDistribution={[]}
        pipelineStatus="healthy"
      />
    );

    expect(screen.getByText("75.0%")).toBeInTheDocument();
  });

  it("displays type distribution data with names and counts", () => {
    render(
      <InsightPipelineMonitor
        totalInsights={50}
        emptyContentCount={10}
        typeDistribution={[
          { type: "Article", count: 30 },
          { type: "Video", count: 20 },
        ]}
        pipelineStatus="warning"
      />
    );

    expect(screen.getByText("Article")).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });
});
