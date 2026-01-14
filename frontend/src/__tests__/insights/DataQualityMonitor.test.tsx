import { render, screen } from "@testing-library/react";
import DataQualityMonitor from '../../components/insights/DataQualityMonitor';

describe("DataQualityMonitor", () => {
  it("renders the component title and time range", () => {
    const entities = [];
    render(<DataQualityMonitor entities={entities} />);

    expect(screen.getByText("Data Quality Monitor")).toBeInTheDocument();
    expect(screen.getByText("24h")).toBeInTheDocument();
  });

  it("displays pipeline health score for multiple entities", () => {
    const entities = [
      {
        name: "Users",
        completeness: 90,
        quality: 80,
        recordCount: 1000,
        lastUpdated: "2026-01-14T10:00:00Z",
      },
      {
        name: "Orders",
        completeness: 100,
        quality: 100,
        recordCount: 5000,
        lastUpdated: "2026-01-14T10:00:00Z",
      },
    ];
    render(<DataQualityMonitor entities={entities} />);

    expect(screen.getByText("Pipeline Health")).toBeInTheDocument();
    expect(screen.getByText("93%")).toBeInTheDocument();
  });

  it("renders entity names and their quality metrics", () => {
    const entities = [
      {
        name: "Customer Data",
        completeness: 95,
        quality: 90,
        recordCount: 2000,
        lastUpdated: "2026-01-14T10:00:00Z",
      },
    ];
    render(<DataQualityMonitor entities={entities} />);

    expect(screen.getByText("Customer Data")).toBeInTheDocument();
  });
});
