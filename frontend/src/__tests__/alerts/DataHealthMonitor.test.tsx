import { render, screen } from "@testing-library/react";
import DataHealthMonitor from '../../components/alerts/DataHealthMonitor';

describe("DataHealthMonitor", () => {
  it("renders the title and time range", () => {
    const entities = [];
    render(<DataHealthMonitor entities={entities} timeRange="24h" />);

    expect(screen.getByText("Data Health Monitor")).toBeInTheDocument();
    expect(screen.getByText(/Time Range: 24h/)).toBeInTheDocument();
  });

  it("displays entity names and completeness percentages", () => {
    const entities = [
      {
        name: "Users",
        completeness: 95,
        missingFields: {},
        totalRecords: 1000,
        lastUpdated: "2024-01-14",
      },
      {
        name: "Products",
        completeness: 75,
        missingFields: {},
        totalRecords: 500,
        lastUpdated: "2024-01-14",
      },
    ];
    render(<DataHealthMonitor entities={entities} />);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("displays status indicators for health status", () => {
    const entities = [
      {
        name: "Critical",
        completeness: 50,
        missingFields: { email: 100 },
        totalRecords: 1000,
        lastUpdated: "2024-01-14",
      },
      {
        name: "Healthy",
        completeness: 95,
        missingFields: {},
        totalRecords: 1000,
        lastUpdated: "2024-01-14",
      },
    ];
    render(<DataHealthMonitor entities={entities} threshold={90} />);

    expect(screen.getByText("✕")).toBeInTheDocument();
    expect(screen.getByText("✓")).toBeInTheDocument();
  });
});
