import { render, screen } from "@testing-library/react";
import ContentHealthMonitor from '../../components/insights/ContentHealthMonitor';

describe("ContentHealthMonitor", () => {
  it("renders the component title and header text", () => {
    render(
      <ContentHealthMonitor
        totalInsights={42}
        insightTypes={[]}
        contentCompletionRate={85}
        feedbackCollectionRate={90}
        emptyContentCount={5}
        lastUpdated="2026-01-14"
      />
    );

    expect(screen.getByText("Content Health Monitor")).toBeInTheDocument();
    expect(screen.getByText(/Last updated: 2026-01-14/)).toBeInTheDocument();
  });

  it("displays the total insights count", () => {
    render(
      <ContentHealthMonitor
        totalInsights={42}
        insightTypes={[]}
        contentCompletionRate={85}
        feedbackCollectionRate={90}
        emptyContentCount={5}
        lastUpdated="2026-01-14"
      />
    );

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Total Insights")).toBeInTheDocument();
  });

  it("displays overall health score calculated from completion and feedback rates", () => {
    render(
      <ContentHealthMonitor
        totalInsights={100}
        insightTypes={[]}
        contentCompletionRate={80}
        feedbackCollectionRate={90}
        emptyContentCount={10}
        lastUpdated="2026-01-14"
      />
    );

    expect(screen.getByText("Overall Health")).toBeInTheDocument();
    expect(screen.getByText("85.0")).toBeInTheDocument();
  });
});
