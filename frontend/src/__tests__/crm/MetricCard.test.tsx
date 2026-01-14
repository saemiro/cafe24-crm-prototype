import { render, screen } from "@testing-library/react";
import MetricCard from "../../components/crm/MetricCard";

describe("MetricCard", () => {
  it("renders label and formatted currency value", () => {
    render(
      <MetricCard label="Revenue" value={15000} previousValue={12000} format="currency" />
    );
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$15,000")).toBeInTheDocument();
  });

  it("shows percentage change correctly", () => {
    render(
      <MetricCard label="Growth" value={25} previousValue={20} format="percent" />
    );
    expect(screen.getByText("25.0%")).toBeInTheDocument();
  });

  it("handles number format", () => {
    render(
      <MetricCard label="Users" value={5000} previousValue={4500} format="number" />
    );
    expect(screen.getByText("5,000")).toBeInTheDocument();
  });
});
