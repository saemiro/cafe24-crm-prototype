import { render, screen } from "@testing-library/react";
import InsightCard from "../../components/insights/InsightCard";

describe("InsightCard", () => {
  it("renders title and value correctly", () => {
    render(
      <InsightCard
        title="Revenue"
        value="$15,000"
        trend="up"
        description="Monthly revenue"
      />
    );

    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$15,000")).toBeInTheDocument();
  });

  it("renders description and displays correct trend indicator", () => {
    render(
      <InsightCard
        title="User Growth"
        value={1250}
        trend="down"
        description="Active users decreased"
      />
    );

    expect(screen.getByText("Active users decreased")).toBeInTheDocument();
    expect(screen.getByText("User Growth")).toBeInTheDocument();
  });

  it("renders with neutral trend status", () => {
    render(
      <InsightCard
        title="Conversion Rate"
        value="3.5%"
        trend="neutral"
        description="No significant change"
      />
    );

    expect(screen.getByText("Conversion Rate")).toBeInTheDocument();
    expect(screen.getByText("3.5%")).toBeInTheDocument();
    expect(screen.getByText("No significant change")).toBeInTheDocument();
  });
});
