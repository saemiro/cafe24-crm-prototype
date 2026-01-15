import { render, screen } from "@testing-library/react";
import CustomerJourneyTimeline from '../../components/crm/CustomerJourneyTimeline';

describe("CustomerJourneyTimeline", () => {
  it("renders customer journey timeline with order events", () => {
    render(<CustomerJourneyTimeline customerId="cust_123" />);
    
    expect(screen.getByText("Order placed - Product Bundle")).toBeInTheDocument();
    expect(screen.getByText("Order placed - Electronics")).toBeInTheDocument();
    expect(screen.getByText("Order placed - Holiday Gift")).toBeInTheDocument();
  });

  it("displays payment and shipping events", () => {
    render(<CustomerJourneyTimeline customerId="cust_123" />);
    
    expect(screen.getByText("Payment processed")).toBeInTheDocument();
    expect(screen.getByText("Package shipped")).toBeInTheDocument();
  });

  it("filters events by type when eventTypes prop is provided", () => {
    render(
      <CustomerJourneyTimeline
        customerId="cust_123"
        eventTypes={["order"]}
      />
    );
    
    expect(screen.getByText("Order placed - Product Bundle")).toBeInTheDocument();
    expect(screen.queryByText("Payment processed")).not.toBeInTheDocument();
  });
});
