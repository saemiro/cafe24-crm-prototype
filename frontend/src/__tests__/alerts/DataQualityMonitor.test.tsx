import { render, screen } from "@testing-library/react";
import DataQualityMonitor from '../../components/alerts/DataQualityMonitor';

describe("DataQualityMonitor", () => {
  it("renders the header and title", () => {
    render(
      <DataQualityMonitor
        totalInsights={100}
        emptyContentCount={10}
        feedbackCount={5}
        insightTypes={[]}
        lastUpdateTime="2024-01-14T12:00:00Z"
        healthScore={90}
      />
    );

    expect(screen.getByText("Data Quality Monitor")).toBeInTheDocument();
    expect(screen.getByText("Real-time pipeline health dashboard")).toBeInTheDocument();
  });

  it("displays health score and status", () => {
    render(
      <DataQualityMonitor
        totalInsights={100}
        emptyContentCount={10}
        feedbackCount={5}
        insightTypes={[]}
        lastUpdateTime="2024-01-14T12:00:00Z"
        healthScore={85}
      />
    );

    expect(screen.getByText("SYSTEM HEALTH")).toBeInTheDocument();
    expect(screen.getByText("85.0%")).toBeInTheDocument();
    expect(screen.getByText("Healthy")).toBeInTheDocument();
  });

  it("shows poor health status when score is low", () => {
    render(
      <DataQualityMonitor
        totalInsights={100}
        emptyContentCount={10}
        feedbackCount={5}
        insightTypes={[]}
        lastUpdateTime="2024-01-14T12:00:00Z"
        healthScore={50}
      />
    );

    expect(screen.getByText("50.0%")).toBeInTheDocument();
    expect(screen.getByText("Poor")).toBeInTheDocument();
  });
});
