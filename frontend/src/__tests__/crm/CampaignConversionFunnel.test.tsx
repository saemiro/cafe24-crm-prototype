import { render, screen } from "@testing-library/react";
import CampaignConversionFunnel from '../../components/crm/CampaignConversionFunnel';

describe("CampaignConversionFunnel", () => {
  const mockDateRange = {
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  };

  it("renders campaign title and date range", () => {
    const stages = [
      { name: "Visits", count: 1000 },
      { name: "Clicks", count: 500 },
    ];

    render(
      <CampaignConversionFunnel
        campaignId="campaign-123"
        dateRange={mockDateRange}
        stages={stages}
      />
    );

    expect(screen.getByText("Campaign Conversion Funnel")).toBeInTheDocument();
    expect(screen.getByText("Campaign ID: campaign-123")).toBeInTheDocument();
    expect(
      screen.getByText("2024-01-01 to 2024-01-31")
    ).toBeInTheDocument();
  });

  it("renders all stage names and counts", () => {
    const stages = [
      { name: "Visits", count: 1000 },
      { name: "Clicks", count: 500 },
      { name: "Conversions", count: 150 },
    ];

    render(
      <CampaignConversionFunnel
        campaignId="campaign-456"
        dateRange={mockDateRange}
        stages={stages}
      />
    );

    expect(screen.getByText("Visits")).toBeInTheDocument();
    expect(screen.getByText("Clicks")).toBeInTheDocument();
    expect(screen.getByText("Conversions")).toBeInTheDocument();
  });

  it("renders total revenue when showRevenue is true and revenue exists", () => {
    const stages = [
      { name: "Visits", count: 1000, revenue: 5000 },
      { name: "Conversions", count: 150, revenue: 3000 },
    ];

    render(
      <CampaignConversionFunnel
        campaignId="campaign-789"
        dateRange={mockDateRange}
        stages={stages}
        showRevenue={true}
      />
    );

    expect(screen.getByText("Total Revenue: $8,000")).toBeInTheDocument();
  });

  it("displays no stage data message when stages array is empty", () => {
    render(
      <CampaignConversionFunnel
        campaignId="campaign-empty"
        dateRange={mockDateRange}
        stages={[]}
      />
    );

    expect(screen.getByText("No stage data available")).toBeInTheDocument();
  });
});
