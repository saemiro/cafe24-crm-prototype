import { render, screen } from "@testing-library/react";
import EntityDataHealthMonitor from '../../components/insights/EntityDataHealthMonitor';

describe("EntityDataHealthMonitor", () => {
  it("renders the title and description", () => {
    render(<EntityDataHealthMonitor entities={[]} />);
    expect(screen.getByText("Data Health Monitor")).toBeInTheDocument();
    expect(screen.getByText(/Real-time visualization of data completeness and freshness/)).toBeInTheDocument();
  });

  it("displays entity name and data quality score", () => {
    const entities = [
      {
        id: "1",
        name: "Customer Records",
        recordCount: 1000,
        lastUpdate: new Date(Date.now() - 3600000),
        missingFieldPercentage: 5,
        dataQualityScore: 92,
      },
    ];
    render(<EntityDataHealthMonitor entities={entities} />);
    expect(screen.getByText("Customer Records")).toBeInTheDocument();
    expect(screen.getByText("92")).toBeInTheDocument();
    expect(screen.getByText("Excellent")).toBeInTheDocument();
  });

  it("displays health status based on data quality score", () => {
    const entities = [
      {
        id: "1",
        name: "Entity A",
        recordCount: 500,
        lastUpdate: new Date(),
        missingFieldPercentage: 10,
        dataQualityScore: 85,
      },
      {
        id: "2",
        name: "Entity B",
        recordCount: 200,
        lastUpdate: new Date(),
        missingFieldPercentage: 30,
        dataQualityScore: 65,
      },
    ];
    render(<EntityDataHealthMonitor entities={entities} />);
    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.getByText("Fair")).toBeInTheDocument();
  });

  it("displays record count change indicator when provided", () => {
    const entities = [
      {
        id: "1",
        name: "Test Entity",
        recordCount: 1000,
        lastUpdate: new Date(),
        missingFieldPercentage: 2,
        dataQualityScore: 95,
        recordCountChange: 150,
      },
    ];
    render(<EntityDataHealthMonitor entities={entities} />);
    expect(screen.getByText(/\+150/)).toBeInTheDocument();
  });

  it("displays time range from props", () => {
    render(<EntityDataHealthMonitor entities={[]} timeRange="7d" />);
    expect(screen.getByText(/Time Range: 7d/)).toBeInTheDocument();
  });
});
