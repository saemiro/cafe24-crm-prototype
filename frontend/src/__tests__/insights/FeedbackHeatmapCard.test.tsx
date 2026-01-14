import { render, screen } from "@testing-library/react";
import FeedbackHeatmapCard from '../../components/insights/FeedbackHeatmapCard';

describe("FeedbackHeatmapCard", () => {
  it("renders the heatmap title and description", () => {
    const props = {
      segments: ["Segment A"],
      campaigns: ["Campaign 1"],
      feedbackMatrix: { "Segment A": { "Campaign 1": 5 } },
    };

    render(<FeedbackHeatmapCard {...props} />);

    expect(screen.getByText("Feedback Heatmap")).toBeInTheDocument();
    expect(
      screen.getByText("Customer feedback density across segments and campaigns")
    ).toBeInTheDocument();
  });

  it("renders all campaigns and segments in the table", () => {
    const props = {
      segments: ["Segment A", "Segment B"],
      campaigns: ["Campaign 1", "Campaign 2"],
      feedbackMatrix: {
        "Segment A": { "Campaign 1": 5, "Campaign 2": 3 },
        "Segment B": { "Campaign 1": 2, "Campaign 2": 8 },
      },
    };

    render(<FeedbackHeatmapCard {...props} />);

    expect(screen.getByText("Segment A")).toBeInTheDocument();
    expect(screen.getByText("Segment B")).toBeInTheDocument();
    expect(screen.getByText("Campaign 1")).toBeInTheDocument();
    expect(screen.getByText("Campaign 2")).toBeInTheDocument();
  });

  it("filters segments below the threshold", () => {
    const props = {
      segments: ["High Feedback", "Low Feedback"],
      campaigns: ["Campaign 1"],
      feedbackMatrix: {
        "High Feedback": { "Campaign 1": 10 },
        "Low Feedback": { "Campaign 1": 2 },
      },
      threshold: 5,
    };

    render(<FeedbackHeatmapCard {...props} />);

    expect(screen.getByText("High Feedback")).toBeInTheDocument();
    expect(screen.queryByText("Low Feedback")).not.toBeInTheDocument();
  });
});
