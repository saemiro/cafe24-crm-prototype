import { render, screen } from "@testing-library/react";
import InsightHealthMonitor from '../../components/alerts/InsightHealthMonitor';

describe("InsightHealthMonitor", () => {
  it("renders the component title and description", () => {
    render(
      <InsightHealthMonitor
        insightTypes={[]}
        contentEmptyRate={5}
        feedbackCount={0}
        totalInsights={0}
        healthStatus="healthy"
      />
    );

    expect(screen.getByText("Insight Health Monitor")).toBeInTheDocument();
    expect(screen.getByText("Real-time pipeline health and content quality metrics")).toBeInTheDocument();
  });

  it("displays the health status badge with correct status text", () => {
    render(
      <InsightHealthMonitor
        insightTypes={[]}
        contentEmptyRate={5}
        feedbackCount={0}
        totalInsights={0}
        healthStatus="warning"
      />
    );

    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("renders with critical health status", () => {
    render(
      <InsightHealthMonitor
        insightTypes={[]}
        contentEmptyRate={15}
        feedbackCount={10}
        totalInsights={100}
        healthStatus="critical"
      />
    );

    expect(screen.getByText("Critical")).toBeInTheDocument();
  });
});
