import { render, screen } from "@testing-library/react";
import DigestHealthMonitor from '../../components/alerts/DigestHealthMonitor';

describe("DigestHealthMonitor", () => {
  it("renders the main title and description", () => {
    render(
      <DigestHealthMonitor
        totalDigests={100}
        emptyDigests={10}
        contentRate={0.85}
        pipelineStatus="healthy"
      />
    );

    expect(screen.getByText("Digest Health Monitor")).toBeInTheDocument();
    expect(
      screen.getByText("Pipeline performance and content generation tracking")
    ).toBeInTheDocument();
  });

  it("displays the pipeline status badge with correct text", () => {
    render(
      <DigestHealthMonitor
        totalDigests={100}
        emptyDigests={10}
        contentRate={0.75}
        pipelineStatus="warning"
      />
    );

    expect(screen.getByText("warning")).toBeInTheDocument();
  });

  it("renders content rate status based on rate value", () => {
    render(
      <DigestHealthMonitor
        totalDigests={50}
        emptyDigests={5}
        contentRate={0.88}
        lastSuccessfulDigest="2024-01-14T10:30:00Z"
        pipelineStatus="healthy"
      />
    );

    expect(screen.getByText("Excellent")).toBeInTheDocument();
  });
});
