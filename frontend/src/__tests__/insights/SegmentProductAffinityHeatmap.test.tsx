import { render, screen } from "@testing-library/react";
import SegmentProductAffinityHeatmap from '../../components/insights/SegmentProductAffinityHeatmap';

describe("SegmentProductAffinityHeatmap", () => {
  it("renders the component title and metric information", () => {
    const segments = [{ id: "s1", name: "Segment A" }];
    const products = [{ id: "p1", name: "Product A" }];
    const affinityData = {
      s1: { p1: { intensity: 0.8, effectiveness: 0.7 } },
    };

    render(
      <SegmentProductAffinityHeatmap
        segments={segments}
        products={products}
        affinityData={affinityData}
      />
    );

    expect(screen.getByText("Segment-Product Affinity Matrix")).toBeInTheDocument();
    expect(screen.getByText("intensity")).toBeInTheDocument();
  });

  it("renders all segment and product names", () => {
    const segments = [
      { id: "s1", name: "Premium Users" },
      { id: "s2", name: "Budget Users" },
    ];
    const products = [
      { id: "p1", name: "Product X" },
      { id: "p2", name: "Product Y" },
    ];
    const affinityData = {
      s1: { p1: { intensity: 0.8, effectiveness: 0.7 }, p2: { intensity: 0.5, effectiveness: 0.6 } },
      s2: { p1: { intensity: 0.3, effectiveness: 0.4 }, p2: { intensity: 0.9, effectiveness: 0.8 } },
    };

    render(
      <SegmentProductAffinityHeatmap
        segments={segments}
        products={products}
        affinityData={affinityData}
      />
    );

    expect(screen.getByText("Premium Users")).toBeInTheDocument();
    expect(screen.getByText("Budget Users")).toBeInTheDocument();
    expect(screen.getByText("Product X")).toBeInTheDocument();
    expect(screen.getByText("Product Y")).toBeInTheDocument();
  });

  it("displays the correct metric when specified", () => {
    const segments = [{ id: "s1", name: "Segment A" }];
    const products = [{ id: "p1", name: "Product A" }];
    const affinityData = {
      s1: { p1: { intensity: 0.8, effectiveness: 0.7 } },
    };

    render(
      <SegmentProductAffinityHeatmap
        segments={segments}
        products={products}
        affinityData={affinityData}
        metric="effectiveness"
      />
    );

    expect(screen.getByText("effectiveness")).toBeInTheDocument();
  });
});
