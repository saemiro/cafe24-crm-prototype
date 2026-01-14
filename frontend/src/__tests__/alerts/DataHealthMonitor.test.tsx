import { render, screen } from "@testing-library/react";
import DataHealthMonitor from '../../components/alerts/DataHealthMonitor';

describe("DataHealthMonitor", () => {
  it("renders the title and default settings", () => {
    render(<DataHealthMonitor entities={[]} />);
    expect(screen.getByText("Data Health Monitor")).toBeInTheDocument();
    expect(screen.getByText("24h")).toBeInTheDocument();
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  it("renders entity names and their metrics", () => {
    const entities = [
      {
        name: "Users",
        completeness: 95,
        freshness: 92,
        quality: 88,
        lastUpdated: "2024-01-14",
        recordCount: 5000,
      },
    ];
    render(<DataHealthMonitor entities={entities} />);
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getByText("92%")).toBeInTheDocument();
    expect(screen.getByText("88%")).toBeInTheDocument();
  });

  it("renders custom time window and alert threshold", () => {
    render(
      <DataHealthMonitor entities={[]} timeWindow="7d" alertThreshold={80} />
    );
    expect(screen.getByText("7d")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });
});
