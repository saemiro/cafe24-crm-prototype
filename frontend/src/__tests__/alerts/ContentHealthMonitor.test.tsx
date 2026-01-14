import { render, screen } from "@testing-library/react";
import ContentHealthMonitor from '../../components/alerts/ContentHealthMonitor';

describe("ContentHealthMonitor", () => {
  it("renders the component title and description", () => {
    render(<ContentHealthMonitor entities={[]} />);
    expect(screen.getByText("Content Health Monitor")).toBeInTheDocument();
    expect(screen.getByText(/Real-time CRM data pipeline health/)).toBeInTheDocument();
  });

  it("displays entity names and data freshness values", () => {
    const entities = [
      {
        name: "Customer Data",
        dataFreshness: 95,
        successRate: 98,
        lastUpdated: new Date().toISOString(),
        missingInsights: 0,
        staleInsights: 1,
      },
      {
        name: "Account Sync",
        dataFreshness: 72,
        successRate: 75,
        lastUpdated: new Date().toISOString(),
        missingInsights: 2,
        staleInsights: 3,
      },
    ];

    render(<ContentHealthMonitor entities={entities} />);
    expect(screen.getByText("Customer Data")).toBeInTheDocument();
    expect(screen.getByText("Account Sync")).toBeInTheDocument();
    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getByText("72%")).toBeInTheDocument();
  });

  it("shows average health and total alerts count", () => {
    const entities = [
      {
        name: "Test Entity",
        dataFreshness: 80,
        successRate: 90,
        lastUpdated: new Date().toISOString(),
        missingInsights: 2,
        staleInsights: 3,
      },
    ];

    render(<ContentHealthMonitor entities={entities} />);
    expect(screen.getByText("90")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});
