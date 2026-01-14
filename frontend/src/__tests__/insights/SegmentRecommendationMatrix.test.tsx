import { render, screen } from "@testing-library/react";
import SegmentRecommendationMatrix from '../../components/insights/SegmentRecommendationMatrix';

describe("SegmentRecommendationMatrix", () => {
  it("renders segment names and category names in the matrix", () => {
    const segmentData = [
      { id: "seg1", name: "Premium Users", size: 1000, acceptanceRate: 0.85 },
      { id: "seg2", name: "Free Users", size: 5000, acceptanceRate: 0.45 },
    ];
    const categoryData = [
      { id: "cat1", name: "Electronics" },
      { id: "cat2", name: "Clothing" },
    ];

    render(
      <SegmentRecommendationMatrix
        segmentData={segmentData}
        categoryData={categoryData}
      />
    );

    expect(screen.getByText("Premium Users")).toBeInTheDocument();
    expect(screen.getByText("Free Users")).toBeInTheDocument();
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Clothing")).toBeInTheDocument();
  });

  it("displays acceptance rate values as percentages by default", () => {
    const segmentData = [
      { id: "seg1", name: "Test Segment", size: 1000, acceptanceRate: 0.75 },
    ];
    const categoryData = [{ id: "cat1", name: "Test Category" }];

    render(
      <SegmentRecommendationMatrix
        segmentData={segmentData}
        categoryData={categoryData}
      />
    );

    expect(screen.getByText(/\d+%/)).toBeInTheDocument();
  });

  it("displays revenue formatted with dollar sign when metricType is revenue", () => {
    const segmentData = [
      { id: "seg1", name: "Test Segment", size: 1000, acceptanceRate: 0.5 },
    ];
    const categoryData = [{ id: "cat1", name: "Test Category" }];

    render(
      <SegmentRecommendationMatrix
        segmentData={segmentData}
        categoryData={categoryData}
        metricType="revenue"
      />
    );

    expect(screen.getByText(/\$\d+/)).toBeInTheDocument();
  });
});
