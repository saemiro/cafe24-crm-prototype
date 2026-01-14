import { render, screen } from "@testing-library/react";
import DataQualityDashboard from '../../components/alerts/DataQualityDashboard';

describe("DataQualityDashboard", () => {
  it("renders entity name and record count", () => {
    const metrics = [
      {
        entity: "Users",
        completeness: 95,
        freshness: 92,
        recordCount: 5000,
        missingFields: [],
        staleRecords: 10,
        lastUpdated: "2024-01-10",
      },
    ];

    render(<DataQualityDashboard entityMetrics={metrics} />);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument();
    expect(screen.getByText("Records")).toBeInTheDocument();
  });

  it("renders health status based on metrics", () => {
    const metrics = [
      {
        entity: "Orders",
        completeness: 75,
        freshness: 80,
        recordCount: 2000,
        missingFields: [],
        staleRecords: 5,
        lastUpdated: "2024-01-10",
      },
    ];

    render(<DataQualityDashboard entityMetrics={metrics} />);

    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("renders multiple metric cards for multiple entities", () => {
    const metrics = [
      {
        entity: "Customers",
        completeness: 85,
        freshness: 88,
        recordCount: 3000,
        missingFields: [],
        staleRecords: 15,
        lastUpdated: "2024-01-10",
      },
      {
        entity: "Products",
        completeness: 50,
        freshness: 60,
        recordCount: 1500,
        missingFields: ["description"],
        staleRecords: 200,
        lastUpdated: "2024-01-09",
      },
    ];

    render(<DataQualityDashboard entityMetrics={metrics} />);

    expect(screen.getByText("Customers")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("3000")).toBeInTheDocument();
    expect(screen.getByText("1500")).toBeInTheDocument();
  });
});
