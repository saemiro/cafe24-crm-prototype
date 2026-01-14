import { render, screen } from "@testing-library/react";
import StatsSummary from "../../components/crm/StatsSummary";

describe("StatsSummary", () => {
  const mockStats = [
    { label: "Total Sales", value: "$50,000", change: 12 },
    { label: "Orders", value: 156, change: -5 },
  ];

  it("renders title and period", () => {
    render(<StatsSummary title="Sales Overview" stats={mockStats} />);
    expect(screen.getByText("Sales Overview")).toBeInTheDocument();
    expect(screen.getByText("This Month")).toBeInTheDocument();
  });

  it("displays all stat values", () => {
    render(<StatsSummary title="Dashboard" stats={mockStats} />);
    expect(screen.getByText("$50,000")).toBeInTheDocument();
    expect(screen.getByText("156")).toBeInTheDocument();
  });

  it("shows custom period", () => {
    render(<StatsSummary title="Report" stats={mockStats} period="Last Quarter" />);
    expect(screen.getByText("Last Quarter")).toBeInTheDocument();
  });
});
