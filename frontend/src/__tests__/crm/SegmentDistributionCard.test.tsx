import { render, screen } from "@testing-library/react";
import SegmentDistributionCard from '../../components/crm/SegmentDistributionCard';

describe("SegmentDistributionCard", () => {
  it("renders segment distribution title and total customers", () => {
    const segments = [
      { id: "1", name: "Premium", count: 150, growth: 5 },
      { id: "2", name: "Standard", count: 300, growth: -2 },
    ];

    render(
      <SegmentDistributionCard segments={segments} totalCustomers={450} />
    );

    expect(screen.getByText("Segment Distribution")).toBeInTheDocument();
    expect(screen.getByText("Total Customers: 450")).toBeInTheDocument();
  });

  it("renders segments with names and customer counts", () => {
    const segments = [
      { id: "1", name: "Enterprise", count: 25 },
      { id: "2", name: "Startup", count: 75 },
    ];

    render(
      <SegmentDistributionCard segments={segments} totalCustomers={100} />
    );

    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("Startup")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
  });

  it("displays growth trends when showTrends is true", () => {
    const segments = [
      { id: "1", name: "Growth Segment", count: 100, growth: 12.5 },
      { id: "2", name: "Declining Segment", count: 50, growth: -8.3 },
    ];

    render(
      <SegmentDistributionCard
        segments={segments}
        totalCustomers={150}
        showTrends={true}
      />
    );

    expect(screen.getByText("↑ 12.5%")).toBeInTheDocument();
    expect(screen.getByText("↓ 8.3%")).toBeInTheDocument();
  });
});
