import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FeedbackCollectionWidget from '../../components/insights/FeedbackCollectionWidget';

describe("FeedbackCollectionWidget", () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    customerId: "cust123",
    contextType: "product",
    contextId: "prod456",
    onSubmit: mockOnSubmit,
  };

  it("renders thank you message after successful submission", async () => {
    const user = userEvent.setup();
    render(<FeedbackCollectionWidget {...defaultProps} />);

    const excellentButton = screen.getByRole("button", { name: /excellent/i });
    await user.click(excellentButton);

    const categorySelect = screen.getByRole("combobox");
    await user.selectOptions(categorySelect, "bug");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    expect(screen.getByText("Thank you for your feedback!")).toBeInTheDocument();
  });

  it("displays alert when rating or category is missing", async () => {
    const user = userEvent.setup();
    render(<FeedbackCollectionWidget {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);

    expect(screen.getByText("Please select a rating and category")).toBeInTheDocument();
  });

  it("renders all feedback category options", () => {
    render(<FeedbackCollectionWidget {...defaultProps} />);

    expect(screen.getByText("Excellent")).toBeInTheDocument();
    expect(screen.getByText("Good")).toBeInTheDocument();
    expect(screen.getByText("Neutral")).toBeInTheDocument();
    expect(screen.getByText("Poor")).toBeInTheDocument();
    expect(screen.getByText("Terrible")).toBeInTheDocument();
  });
});
