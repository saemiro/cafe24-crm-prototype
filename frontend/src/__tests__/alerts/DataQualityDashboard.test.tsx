import { render, screen } from "@testing-library/react";
import DataQualityDashboard from '../../components/alerts/DataQualityDashboard';

describe("DataQualityDashboard", () => {
  it("renders all entity types passed as props", () => {
    render(
      <DataQualityDashboard
        entityTypes={["Customer", "Order", "Product"]}
      />
    );
    expect(screen.getByText("Customer")).toBeInTheDocument();
    expect(screen.getByText("Order")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
  });

  it("displays health status based on quality threshold", () => {
    render(
      <DataQualityDashboard
        entityTypes={["Customer", "Order"]}
        qualityThreshold={85}
      />
    );
    expect(screen.getByText("✓ Healthy")).toBeInTheDocument();
    expect(screen.getByText("⚠ At Risk")).toBeInTheDocument();
  });

  it("calls onEntityClick callback when entity is clicked", () => {
    const handleClick = jest.fn();
    render(
      <DataQualityDashboard
        entityTypes={["Customer"]}
        onEntityClick={handleClick}
      />
    );
    screen.getByText("Customer").click();
    expect(handleClick).toHaveBeenCalledWith("Customer");
  });
});
