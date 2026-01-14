import { render, screen } from "@testing-library/react";
import InsightHealthMonitor from '../../components/alerts/InsightHealthMonitor';

describe("InsightHealthMonitor", () => {
  it("renders loading state initially", () => {
    render(<InsightHealthMonitor entityTypes={["user", "product"]} />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("renders entity types after loading completes", async () => {
    render(<InsightHealthMonitor entityTypes={["user", "product"]} />);
    const userEntity = await screen.findByText(/user/i);
    expect(userEntity).toBeInTheDocument();
  });

  it("displays insight type counts for each entity", async () => {
    render(<InsightHealthMonitor entityTypes={["customer"]} />);
    const behavioralText = await screen.findByText(/behavioral/i);
    const predictiveText = screen.getByText(/predictive/i);
    expect(behavioralText).toBeInTheDocument();
    expect(predictiveText).toBeInTheDocument();
  });
});
