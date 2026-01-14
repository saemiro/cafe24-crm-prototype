import { render, screen } from "@testing-library/react";
import InsightCard from "../../components/insights/InsightCard";

describe("InsightCard", () => {
  it("renders with all props correctly", () => {
    render(
      <InsightCard
        title="Revenue"
        value="$50,000"
        trend="up"
        description="Monthly revenue increase"
      />
    );

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$50,000")).toBeInTheDocument();
    expect(screen.getByText("Monthly revenue increase")).toBeInTheDocument();
  });

  it("displays down trend indicator", () => {
    render(
      <InsightCard
        title="Churn Rate"
        value="2.5"
        trend="down"
        description="Customer churn decreased"
      />
    );

    expect(screen.getByText("Churn Rate")).toBeInTheDocument();
    expect(screen.getByText("2.5")).toBeInTheDocument();
    expect(screen.getByText("Customer churn decreased")).toBeInTheDocument();
  });

  it("displays neutral trend indicator", () => {
    render(
      <InsightCard
        title="Engagement"
        value="45%"
        trend="neutral"
        description="Engagement remained stable"
      />
    );

    expect(screen.getByText("Engagement")).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
    expect(screen.getByText("Engagement remained stable")).toBeInTheDocument();
  });
});
