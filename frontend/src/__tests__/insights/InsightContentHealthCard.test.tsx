import { render, screen } from "@testing-library/react";
import InsightContentHealthCard from '../../components/insights/InsightContentHealthCard';

describe("InsightContentHealthCard", () => {
  it("renders the card title and time range", () => {
    render(
      <InsightContentHealthCard
        totalInsights={100}
        emptyContentCount={10}
        feedbackCount={50}
        insightTypeDistribution={{ type1: 50, type2: 50 }}
        timeRange="Last 30 days"
      />
    );

    expect(screen.getByText("Insight Content Health")).toBeInTheDocument();
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
  });

  it("renders completion rate status based on content completion", () => {
    render(
      <InsightContentHealthCard
        totalInsights={100}
        emptyContentCount={10}
        feedbackCount={50}
        insightTypeDistribution={{ type1: 50, type2: 50 }}
      />
    );

    expect(screen.getByText("Excellent")).toBeInTheDocument();
  });

  it("renders feedback collection rate status", () => {
    render(
      <InsightContentHealthCard
        totalInsights={100}
        emptyContentCount={20}
        feedbackCount={30}
        insightTypeDistribution={{ type1: 40, type2: 60 }}
      />
    );

    expect(screen.getByText("Good")).toBeInTheDocument();
  });
});
