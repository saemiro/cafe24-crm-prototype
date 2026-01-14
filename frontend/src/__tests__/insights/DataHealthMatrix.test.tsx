import { render, screen } from "@testing-library/react";
import DataHealthMatrix from '../../components/insights/DataHealthMatrix';

describe("DataHealthMatrix", () => {
  it("renders the title and time range", () => {
    const entities = [];
    const healthMetrics = {};
    
    render(
      <DataHealthMatrix
        entities={entities}
        healthMetrics={healthMetrics}
        timeRange="Last 7 days"
      />
    );
    
    expect(screen.getByText("Data Health Matrix")).toBeInTheDocument();
    expect(screen.getByText("Last 7 days")).toBeInTheDocument();
  });

  it("renders entity names with overall health scores", () => {
    const entities = [
      { name: "Users", type: "table", recordCount: 1000 },
      { name: "Orders", type: "table", recordCount: 5000 },
    ];
    const healthMetrics = {
      Users: {
        completeness: 95,
        quality: 92,
        staleness: 10,
        freshness: 88,
        missingFields: [],
        staleRecords: 50,
        totalRecords: 1000,
      },
      Orders: {
        completeness: 75,
        quality: 70,
        staleness: 30,
        freshness: 65,
        missingFields: ["shipping_date"],
        staleRecords: 500,
        totalRecords: 5000,
      },
    };
    
    render(
      <DataHealthMatrix
        entities={entities}
        healthMetrics={healthMetrics}
      />
    );
    
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
  });

  it("renders no data message when metric is missing", () => {
    const entities = [
      { name: "Products", type: "table", recordCount: 200 },
    ];
    const healthMetrics = {};
    
    render(
      <DataHealthMatrix
        entities={entities}
        healthMetrics={healthMetrics}
      />
    );
    
    expect(screen.getByText("No data for Products")).toBeInTheDocument();
  });
});
