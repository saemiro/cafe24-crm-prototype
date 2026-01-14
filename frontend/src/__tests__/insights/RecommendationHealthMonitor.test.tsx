import { render, screen } from "@testing-library/react";
import RecommendationHealthMonitor from '../../components/insights/RecommendationHealthMonitor';

describe("RecommendationHealthMonitor", () => {
  it("renders segment metrics with segment names", () => {
    render(<RecommendationHealthMonitor timeRange="7days" />);
    expect(screen.getByText("Premium")).toBeInTheDocument();
    expect(screen.getByText("Standard")).toBeInTheDocument();
    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("renders algorithm performance types", () => {
    render(<RecommendationHealthMonitor timeRange="30days" />);
    expect(screen.getByText("Collaborative Filtering")).toBeInTheDocument();
    expect(screen.getByText("Content-Based Filtering")).toBeInTheDocument();
    expect(screen.getByText("Hybrid Approach")).toBeInTheDocument();
  });

  it("renders system health information with latency value", () => {
    render(<RecommendationHealthMonitor timeRange="24hours" />);
    expect(screen.getByText(/latency/i)).toBeInTheDocument();
    expect(screen.getByText(/error rate/i)).toBeInTheDocument();
  });
});
