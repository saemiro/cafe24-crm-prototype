import { render, screen } from "@testing-library/react";
import StatusBadge from "../../components/crm/StatusBadge";

describe("StatusBadge", () => {
  it("renders the label text", () => {
    render(<StatusBadge status="success" label="Active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders with different status types", () => {
    render(<StatusBadge status="error" label="Failed" />);
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    render(<StatusBadge status="warning" label="Pending Review" size="lg" />);
    expect(screen.getByText("Pending Review")).toBeInTheDocument();
  });
});
