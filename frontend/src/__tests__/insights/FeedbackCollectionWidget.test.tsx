import { render, screen } from "@testing-library/react";
import FeedbackCollectionWidget from '../../components/insights/FeedbackCollectionWidget';

describe("FeedbackCollectionWidget", () => {
  it("renders the submit tab with feedback form", () => {
    const mockOnSubmit = jest.fn();
    render(
      <FeedbackCollectionWidget
        entityType="product"
        entityId="123"
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  it("renders tabs for submit, history, and analytics", () => {
    const mockOnSubmit = jest.fn();
    render(
      <FeedbackCollectionWidget
        entityType="product"
        entityId="123"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("displays feedback templates when provided", () => {
    const mockOnSubmit = jest.fn();
    const templates = [
      { id: "1", title: "Product Review", questions: ["Quality?", "Value?"] },
      { id: "2", title: "Service Feedback", questions: ["Response time?"] },
    ];

    render(
      <FeedbackCollectionWidget
        entityType="product"
        entityId="123"
        feedbackTemplates={templates}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText("Product Review")).toBeInTheDocument();
    expect(screen.getByText("Service Feedback")).toBeInTheDocument();
  });
});
