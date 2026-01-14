import { render, screen } from "@testing-library/react";
import DataHealthMonitor from '../../components/alerts/DataHealthMonitor';

describe("DataHealthMonitor", () => {
  it("renders alert messages for entities with low completeness", () => {
    const entities = [
      {
        name: "Users",
        completeness: 70,
        dataQuality: 90,
        lastUpdated: "2024-01-14",
        missingFields: 5,
      },
    ];

    render(<DataHealthMonitor entities={entities} />);

    expect(screen.getByText(/Missing 5 fields/)).toBeInTheDocument();
    expect(screen.getByText(/30% incomplete/)).toBeInTheDocument();
  });

  it("renders alert messages for entities with low data quality", () => {
    const entities = [
      {
        name: "Orders",
        completeness: 95,
        dataQuality: 75,
        lastUpdated: "2024-01-14",
      },
    ];

    render(<DataHealthMonitor entities={entities} />);

    expect(screen.getByText(/Data quality degraded to 75%/)).toBeInTheDocument();
  });

  it("renders pipeline error alerts when errors are present", () => {
    const entities = [
      {
        name: "Transactions",
        completeness: 90,
        dataQuality: 88,
        lastUpdated: "2024-01-14",
        pipelineErrors: 3,
      },
    ];

    render(<DataHealthMonitor entities={entities} />);

    expect(screen.getByText(/3 pipeline errors detected/)).toBeInTheDocument();
  });
});
