import { render, screen } from "@testing-library/react";
import FeedbackCollectionHeatmap from '../../components/insights/FeedbackCollectionHeatmap';

describe("FeedbackCollectionHeatmap", () => {
  const dateRange = {
    startDate: "2025-01-01",
    endDate: "2025-01-02",
  };

  it("renders campaign names as visible content", () => {
    render(<FeedbackCollectionHeatmap dateRange={dateRange} />);
    expect(screen.getByText("Spring Launch")).toBeInTheDocument();
    expect(screen.getByText("Holiday Promo")).toBeInTheDocument();
  });

  it("renders segment names as visible content", () => {
    render(<FeedbackCollectionHeatmap dateRange={dateRange} />);
    expect(screen.getByText("Premium")).toBeInTheDocument();
    expect(screen.getByText("Standard")).toBeInTheDocument();
  });

  it("renders feedback volume numbers as text content", () => {
    render(<FeedbackCollectionHeatmap dateRange={dateRange} />);
    expect(screen.getByText("145")).toBeInTheDocument();
    expect(screen.getByText("78")).toBeInTheDocument();
    expect(screen.getByText("156")).toBeInTheDocument();
  });
});
