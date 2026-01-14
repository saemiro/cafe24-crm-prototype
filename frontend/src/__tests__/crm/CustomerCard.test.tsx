import { render, screen } from "@testing-library/react";
import CustomerCard from "../../components/crm/CustomerCard";

describe("CustomerCard", () => {
  it("renders customer name and email", () => {
    render(
      <CustomerCard
        name="John Doe"
        email="john@example.com"
        status="active"
        lastPurchase="2024-01-15"
        totalSpent={1500}
      />
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("displays status badge correctly", () => {
    render(
      <CustomerCard
        name="Jane Smith"
        email="jane@example.com"
        status="pending"
        lastPurchase="2024-01-10"
        totalSpent={750}
      />
    );
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("shows total spent formatted", () => {
    render(
      <CustomerCard
        name="Bob Wilson"
        email="bob@example.com"
        status="inactive"
        lastPurchase="2023-12-20"
        totalSpent={25000}
      />
    );
    expect(screen.getByText("$25,000")).toBeInTheDocument();
  });
});
