import { render, screen } from "@testing-library/react";
import InsightHealthMonitor from '../../components/alerts/InsightHealthMonitor';

describe("InsightHealthMonitor", () => {
  it("renders the title and subtitle", () => {
    render(
      <InsightHealthMonitor
        totalInsights={100}
        emptyContentCount={10}
        feedbackCount={50}
        insightTypeBreakdown={[]}
      />
    );

    expect(screen.getByText("Insight Health Monitor")).toBeInTheDocument();
    expect(
      screen.getByText("Real-time pipeline status and data quality metrics")
    ).toBeInTheDocument();
  });

  it("renders content completeness metric with correct rate", () => {
    render(
      <InsightHealthMonitor
        totalInsights={100}
        emptyContentCount={5}
        feedbackCount={50}
        insightTypeBreakdown={[]}
      />
    );

    expect(screen.getByText("Content Completeness")).toBeInTheDocument();
    expect(screen.getByText("95%")).toBeInTheDocument();
  });

  it("renders feedback collection rate metric", () => {
    render(
      <InsightHealthMonitor
        totalInsights={100}
        emptyContentCount={10}
        feedbackCount={60}
        insightTypeBreakdown={[]}
      />
    );

    expect(screen.getByText("Feedback Collection Rate")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
  });
});
