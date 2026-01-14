import { render, screen } from "@testing-library/react";
import CustomerEngagementPulse from '../../components/insights/CustomerEngagementPulse';

describe("CustomerEngagementPulse", () => {
  it("renders the component title", () => {
    const engagementMetrics = {
      segment1: {
        participationRate: 60,
        feedbackGap: 20,
        lastActivity: "2 hours ago",
        campaignInteractions: 45,
        healthScore: 75,
      },
    };

    render(
      <CustomerEngagementPulse
        timeRange="Last 30 days"
        engagementMetrics={engagementMetrics}
      />
    );

    expect(screen.getByText("Customer Engagement Pulse")).toBeInTheDocument();
  });

  it("displays the time range in the subtitle", () => {
    const engagementMetrics = {
      segment1: {
        participationRate: 60,
        feedbackGap: 20,
        lastActivity: "2 hours ago",
        campaignInteractions: 45,
        healthScore: 75,
      },
    };

    render(
      <CustomerEngagementPulse
        timeRange="Last 7 days"
        engagementMetrics={engagementMetrics}
      />
    );

    expect(screen.getByText(/Last 7 days/)).toBeInTheDocument();
  });

  it("displays segment ID in subtitle when provided", () => {
    const engagementMetrics = {
      segment1: {
        participationRate: 60,
        feedbackGap: 20,
        lastActivity: "2 hours ago",
        campaignInteractions: 45,
        healthScore: 75,
      },
    };

    render(
      <CustomerEngagementPulse
        segmentId="Enterprise Customers"
        timeRange="Last 30 days"
        engagementMetrics={engagementMetrics}
      />
    );

    expect(screen.getByText(/for Enterprise Customers/)).toBeInTheDocument();
  });
});
