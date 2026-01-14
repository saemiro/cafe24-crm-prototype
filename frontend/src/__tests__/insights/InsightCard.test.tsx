import { render, screen } from "@testing-library/react";
import InsightCard from "../../components/insights/InsightCard";

describe("InsightCard", () => {
  it("renders title and value correctly", () => {
    render(
      <InsightCard
        title="Revenue"
        value="$10,000"
        trend="up"
        description="Monthly revenue"
      />
    );

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$10,000")).toBeInTheDocument();
  });

  it("renders description text", () => {
    render(
      <InsightCard
        title="Growth Rate"
        value={25}
        trend="down"
        description="Year over year decline"
      />
    );

    expect(screen.getByText("Year over year decline")).toBeInTheDocument();
  });

  it("renders all props with neutral trend", () => {
    render(
      <InsightCard
        title="Status"
        value="Active"
        trend="neutral"
        description="Current system status"
      />
    );

    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Current system status")).toBeInTheDocument();
  });
});
