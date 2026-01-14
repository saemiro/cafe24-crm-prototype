import { render, screen } from "@testing-library/react";
import DailyDigestHealthCard from '../../components/insights/DailyDigestHealthCard';

describe("DailyDigestHealthCard", () => {
  it("renders health card title and date", () => {
    render(
      <DailyDigestHealthCard
        totalInsights={5}
        insightTypeDistribution={{ type1: 3, type2: 2 }}
        contentCompleteness={75}
        feedbackCount={2}
        date="2024-01-15"
        healthScore={85}
      />
    );

    expect(screen.getByText("Daily Digest Health")).toBeInTheDocument();
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
  });

  it("displays health score percentage", () => {
    render(
      <DailyDigestHealthCard
        totalInsights={10}
        insightTypeDistribution={{ type1: 5, type2: 5 }}
        contentCompleteness={90}
        feedbackCount={3}
        date="2024-01-16"
        healthScore={72}
      />
    );

    expect(screen.getByText("72%")).toBeInTheDocument();
  });

  it("renders alerts when provided", () => {
    render(
      <DailyDigestHealthCard
        totalInsights={3}
        insightTypeDistribution={{ type1: 2, type2: 1 }}
        contentCompleteness={60}
        feedbackCount={0}
        date="2024-01-17"
        healthScore={55}
        alerts={[
          {
            type: "low-feedback",
            message: "No feedback received",
            severity: "high",
          },
        ]}
      />
    );

    expect(screen.getByText("No feedback received")).toBeInTheDocument();
  });
});
