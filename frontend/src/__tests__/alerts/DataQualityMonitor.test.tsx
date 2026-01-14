import { render, screen } from "@testing-library/react";
import DataQualityMonitor from '../../components/alerts/DataQualityMonitor';

describe("DataQualityMonitor", () => {
  it("renders entity type and metric labels", () => {
    const metrics = {
      completeness: 95,
      freshness: 88,
      validity: 92,
    };

    render(
      <DataQualityMonitor entityType="User" qualityMetrics={metrics} />
    );

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Completeness")).toBeInTheDocument();
    expect(screen.getByText("Freshness")).toBeInTheDocument();
    expect(screen.getByText("Validity")).toBeInTheDocument();
  });

  it("displays metric values as percentages", () => {
    const metrics = {
      completeness: 85.5,
      freshness: 92.3,
      validity: 78.9,
    };

    render(
      <DataQualityMonitor entityType="Product" qualityMetrics={metrics} />
    );

    expect(screen.getByText("85.5%")).toBeInTheDocument();
    expect(screen.getByText("92.3%")).toBeInTheDocument();
    expect(screen.getByText("78.9%")).toBeInTheDocument();
  });

  it("shows alert message when metrics fall below threshold", () => {
    const metrics = {
      completeness: 75,
      freshness: 65,
      validity: 90,
    };

    render(
      <DataQualityMonitor
        entityType="Order"
        qualityMetrics={metrics}
        threshold={80}
      />
    );

    expect(screen.getByText("Data Quality Alert")).toBeInTheDocument();
    expect(screen.getByText(/2 metrics below threshold/)).toBeInTheDocument();
  });
});
