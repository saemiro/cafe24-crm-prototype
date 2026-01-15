import React from "react";
import { render, screen } from "@testing-library/react";
import InsightCard from "../../components/insights/InsightCard";

describe("InsightCard", () => {
  it("should render with title and value props", () => {
    render(<InsightCard title="Revenue" value="$50,000" />);
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$50,000")).toBeInTheDocument();
  });

  it("should render trend indicator when trend prop is provided", () => {
    render(
      <InsightCard title="Growth" value="25%" trend="up" description="Monthly increase" />
    );
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByText("Monthly increase")).toBeInTheDocument();
  });

  it("should render all props correctly", () => {
    render(
      <InsightCard
        title="Conversion Rate"
        value="3.5%"
        trend="down"
        description="Slight decrease from last week"
      />
    );
    expect(screen.getByText("Conversion Rate")).toBeInTheDocument();
    expect(screen.getByText("3.5%")).toBeInTheDocument();
    expect(screen.getByText("Slight decrease from last week")).toBeInTheDocument();
  });
});
