import { fireEvent, render, screen } from "@testing-library/react";
import {
  AIRiskCard,
  AttentionTable,
  PackageComplianceCard,
  PortfolioStats,
  ProjectHeroCard,
  ProjectPipeline,
  ProjectStatusFilters,
  TimeRangeControl,
} from "./index";

describe("dashboard controls A15-A22", () => {
  it("A15 changes the selected time range and reports it", () => {
    const onChange = vi.fn();
    render(<TimeRangeControl onChange={onChange} />);
    const sevenDays = screen.getByRole("button", { name: "7 days" });
    expect(sevenDays).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "30 days" }));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith("30-days");
    expect(screen.getByRole("button", { name: "30 days" })).toHaveAttribute("aria-pressed", "true");
  });

  it("A15 supports a controlled value", () => {
    const onChange = vi.fn();
    const { rerender } = render(<TimeRangeControl value="today" onChange={onChange} />);
    expect(screen.getByRole("button", { name: "Today" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "7 days" }));
    expect(onChange).toHaveBeenCalledWith("7-days");
    rerender(<TimeRangeControl value="7-days" onChange={onChange} />);
    expect(screen.getByRole("button", { name: "7 days" })).toHaveAttribute("aria-pressed", "true");
  });

  it("A16 exposes a reachable project entry and preserves its data", () => {
    const onOpen = vi.fn();
    render(<ProjectHeroCard project={{ id: "PL-2841", title: "18 Meridian Way", address: "Nova Ridge, NR", status: "under-review", progress: 78, meta: [{ label: "Stage", value: "AHJ review" }] }} onOpen={onOpen} />);
    expect(screen.getByText("PL-2841")).toBeVisible();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "78");
    fireEvent.click(screen.getByRole("button", { name: "Open 18 Meridian Way" }));
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("A16 handles missing media without pretending an image loaded", () => {
    const { container } = render(<ProjectHeroCard project={{ id: "PL-1", title: "Empty media", progress: 0 }} />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("A17 renders stats as display-only data cards", () => {
    render(<PortfolioStats stats={[{ label: "Active projects", value: 128, detail: "7 this week", tone: "dark" }, { label: "At risk", value: 7 }]} />);
    expect(screen.getByText("Active projects")).toBeVisible();
    expect(screen.getByText("7 this week")).toBeVisible();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("A18 opens the host-provided pipeline destination", () => {
    const onAction = vi.fn();
    render(<ProjectPipeline stages={[{ label: "Design", count: 32 }, { label: "Permit", count: 47 }]} onAction={onAction} />);
    expect(screen.getByText("Design")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Open/ }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("A18 keeps zero totals renderable with a minimum visual segment", () => {
    const { container } = render(<ProjectPipeline stages={[{ label: "Design", count: 0 }]} />);
    expect(container.querySelectorAll(".inf-global-pipeline__bars > div")).toHaveLength(1);
  });

  it("A19 makes rows keyboard reachable and reports the selected row", () => {
    const onRowClick = vi.fn();
    const row = { id: "PL-2796", project: "42 Willow Loop", address: "Pine Hollow, PH", stage: "AHJ review", blocker: "Missing docs", risk: "high" as const, due: "Oct 1" };
    render(<AttentionTable rows={[row]} onRowClick={onRowClick} />);
    const entry = screen.getByRole("button", { name: /Open 42 Willow Loop, Missing docs/ });
    fireEvent.click(entry);
    expect(onRowClick).toHaveBeenCalledOnce();
    expect(onRowClick).toHaveBeenCalledWith(row);
  });

  it("A19 exposes an explicit empty state", () => {
    render(<AttentionTable rows={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("No projects need attention.");
  });

  it("A20 reveals all risk details instead of only logging an action", () => {
    const onAction = vi.fn();
    render(<AIRiskCard projectsAtRisk={7} risks={["Missing documents", "Review delay", "Install date conflict", "Utility mismatch"]} onAction={onAction} />);
    const action = screen.getByRole("button", { name: "Review risks" });
    fireEvent.click(action);
    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.getByRole("region", { name: "Risk details" })).toHaveTextContent("Utility mismatch");
    expect(action).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("button", { name: "Hide risks" }));
    expect(screen.queryByRole("region", { name: "Risk details" })).not.toBeInTheDocument();
  });

  it("A21 clamps the score and opens compliance details", () => {
    const onAction = vi.fn();
    render(<PackageComplianceCard score={120} project="18 Meridian Way" checked={1184} flagged={31} rejected={0.8} onAction={onAction} />);
    expect(screen.getByLabelText("100% compliance")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Ready to submit/ }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.getByRole("region", { name: "Package compliance details" })).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent("opened");
  });

  it("A22 selects a filter and supports a controlled value", () => {
    const onChange = vi.fn();
    const options = [{ value: "all", label: "All", count: 128 }, { value: "risk", label: "At risk", count: 7 }];
    const { rerender } = render(<ProjectStatusFilters options={options} onChange={onChange} />);
    expect(screen.getByRole("tab", { name: /All 128/ })).toHaveAttribute("aria-selected", "true");
    fireEvent.click(screen.getByRole("tab", { name: /At risk 7/ }));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith("risk");
    rerender(<ProjectStatusFilters options={options} value="risk" onChange={onChange} />);
    expect(screen.getByRole("tab", { name: /At risk 7/ })).toHaveAttribute("aria-selected", "true");
  });
});

