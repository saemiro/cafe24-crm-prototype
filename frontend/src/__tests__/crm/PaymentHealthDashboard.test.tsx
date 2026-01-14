import { render, screen } from "@testing-library/react";
import PaymentHealthDashboard from '../../components/crm/PaymentHealthDashboard';

describe("PaymentHealthDashboard", () => {
  it("renders dashboard title and time range", () => {
    const paymentData = [];
    render(
      <PaymentHealthDashboard timeRange="Last 7 Days" paymentData={paymentData} />
    );
    expect(screen.getByText("Payment Health Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Time Range: Last 7 Days")).toBeInTheDocument();
  });

  it("displays success rate percentage based on payment data", () => {
    const paymentData = [
      {
        id: "1",
        amount: 100,
        status: "success" as const,
        method: "credit_card",
        customerId: "c1",
        orderId: "o1",
        timestamp: "2026-01-14T10:00:00Z",
      },
      {
        id: "2",
        amount: 50,
        status: "failed" as const,
        method: "paypal",
        customerId: "c2",
        orderId: "o2",
        timestamp: "2026-01-14T11:00:00Z",
      },
    ];
    render(
      <PaymentHealthDashboard timeRange="Last 24 Hours" paymentData={paymentData} />
    );
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("displays total revenue from successful payments", () => {
    const paymentData = [
      {
        id: "1",
        amount: 250,
        status: "success" as const,
        method: "credit_card",
        customerId: "c1",
        orderId: "o1",
        timestamp: "2026-01-14T10:00:00Z",
      },
      {
        id: "2",
        amount: 150,
        status: "success" as const,
        method: "paypal",
        customerId: "c2",
        orderId: "o2",
        timestamp: "2026-01-14T11:00:00Z",
      },
    ];
    render(
      <PaymentHealthDashboard timeRange="Last 30 Days" paymentData={paymentData} />
    );
    expect(screen.getByText("$400.00")).toBeInTheDocument();
  });
});
