import { render, screen } from "@testing-library/react";
import DataPipelineHealthCard from '../../components/alerts/DataPipelineHealthCard';

describe("DataPipelineHealthCard", () => {
  it("renders pipeline health title and time range", () => {
    const metrics = [
      { name: "API Response Time", value: 250, status: "healthy" as const },
    ];

    render(
      <DataPipelineHealthCard
        pipelineMetrics={metrics}
        contentCompletionRate={85}
        feedbackCollectionRate={90}
        timeRange="Last 24 hours"
      />
    );

    expect(screen.getByText("Data Pipeline Health")).toBeInTheDocument();
    expect(screen.getByText("Last 24 hours")).toBeInTheDocument();
  });

  it("displays all systems nominal when no alerts exist", () => {
    const metrics = [
      { name: "API Response Time", value: 250, status: "healthy" as const },
      { name: "Data Sync", value: 95, status: "healthy" as const },
    ];

    render(
      <DataPipelineHealthCard
        pipelineMetrics={metrics}
        contentCompletionRate={85}
        feedbackCollectionRate={90}
      />
    );

    expect(screen.getByText("✓ All Systems Nominal")).toBeInTheDocument();
  });

  it("displays alert count when metrics have non-healthy status", () => {
    const metrics = [
      { name: "API Response Time", value: 250, status: "healthy" as const },
      { name: "Data Sync", value: 45, status: "warning" as const },
      { name: "Memory Usage", value: 98, status: "critical" as const },
    ];

    render(
      <DataPipelineHealthCard
        pipelineMetrics={metrics}
        contentCompletionRate={85}
        feedbackCollectionRate={90}
      />
    );

    expect(screen.getByText("⚠ 2 Alerts")).toBeInTheDocument();
  });
});
