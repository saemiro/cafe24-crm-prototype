import { render, screen } from "@testing-library/react";
import ActivityItem from "../../components/crm/ActivityItem";

describe("ActivityItem", () => {
  it("renders customer name and description", () => {
    render(
      <ActivityItem
        type="purchase"
        description="Purchased Premium Plan"
        timestamp="2 hours ago"
        customerName="John Doe"
      />
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Purchased Premium Plan")).toBeInTheDocument();
  });

  it("shows timestamp", () => {
    render(
      <ActivityItem
        type="visit"
        description="Visited pricing page"
        timestamp="5 minutes ago"
        customerName="Jane Smith"
      />
    );
    expect(screen.getByText("5 minutes ago")).toBeInTheDocument();
  });

  it("renders different activity types", () => {
    render(
      <ActivityItem
        type="support"
        description="Opened support ticket #123"
        timestamp="1 day ago"
        customerName="Bob Wilson"
      />
    );
    expect(screen.getByText("Opened support ticket #123")).toBeInTheDocument();
  });
});
