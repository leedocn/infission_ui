import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  AICheckSummary,
  AIFixDiffPanel,
  ActivityFeed,
  ComplianceFindingsList,
  ComplianceScoreCard,
  DocumentCategoryTabs,
  DocumentGroup,
  DocumentIntelligencePanel,
  DocumentRow,
  DocumentSearch,
  DocumentStatusFilter,
  FileUploadDropzone,
  FindingDetailPanel,
  InspectionScheduleCard,
  PermitProgressCard,
  ProjectAIStatusCard,
  ProjectBreadcrumb,
  ProjectDetailsCard,
  ProjectHeaderActions,
  ProjectIdChip,
  ProjectStatusBadge,
  ProjectTabs,
  ProjectTeamCard,
  RecommendedActionCard,
  RequirementSourcesPanel,
  RequirementsSummary,
  ReviewActionBar,
  ReviewStatusPills,
} from "./index";

describe("detail components", () => {
  it("renders project header and controlled tabs", () => {
    const onChange = vi.fn();
    render(<><ProjectBreadcrumb items={[{ label: "Projects" }, { label: "18 Meridian Way" }]} onBack={vi.fn()} /><ProjectIdChip id="PL-2841" /><ProjectTabs items={[{ key: "overview", label: "Overview" }, { key: "docs", label: "Documents", count: 10 }]} value="overview" onValueChange={onChange} /><ProjectHeaderActions status={<ProjectStatusBadge status="on-track" />} actions={<button type="button">Actions</button>} /></>);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Documents 10/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: /Documents 10/ }));
    expect(onChange).toHaveBeenCalledWith("docs");
    expect(screen.getByRole("status")).toHaveTextContent("On track");
  });

  it("switches an uncontrolled project tab when clicked", () => {
    render(<ProjectTabs items={[{ key: "overview", label: "Overview" }, { key: "docs", label: "Documents", count: 10 }]} defaultValue="overview" />);
    const overview = screen.getByRole("tab", { name: "Overview" });
    const documents = screen.getByRole("tab", { name: /Documents 10/ });
    expect(overview).toHaveAttribute("aria-selected", "true");
    fireEvent.click(documents);
    expect(documents).toHaveAttribute("aria-selected", "true");
    expect(overview).toHaveAttribute("aria-selected", "false");
  });

  it("renders overview modules with data and empty activity", () => {
    render(<><PermitProgressCard steps={[{ id: "design", label: "Design", status: "complete" }, { id: "review", label: "Review", status: "current" }]} /><ProjectAIStatusCard status="Project is on track" message="Next milestone is review." confidence={91} /><RequirementsSummary metrics={[{ label: "Complete", value: 23, tone: "brand" }]} /><ActivityFeed items={[]} /><ProjectDetailsCard fields={[{ label: "Jurisdiction", value: "Harbor County" }]} /><ProjectTeamCard members={[{ id: "m", name: "Avery Chen", role: "Owner" }]} /><InspectionScheduleCard date="Oct 8" inspector="Riley Stone" /></>);
    expect(screen.getByText("91%")).toBeInTheDocument();
    expect(screen.getByText("No activity yet.")).toBeInTheDocument();
    expect(screen.getByText("Harbor County")).toBeInTheDocument();
    expect(screen.getByText("Riley Stone")).toBeInTheDocument();
  });

  it("supports document filters, search, upload, groups and AI summary", () => {
    const onSearch = vi.fn();
    const onFiles = vi.fn();
    render(<><DocumentCategoryTabs categories={[{ key: "all", label: "All", count: 10 }]} /><DocumentStatusFilter options={[{ value: "verified", label: "Verified" }]} /><DocumentSearch onValueChange={onSearch} /><AICheckSummary checked={9} total={10} confidence={96} /><DocumentGroup title="Design" files={[{ id: "f1", name: "Site Plan v3.pdf", size: "2.4 MB", status: "verified", confidence: 98 }]} /><FileUploadDropzone onFiles={onFiles} /></>);
    fireEvent.change(screen.getByPlaceholderText("Find a document"), { target: { value: "site" } });
    expect(onSearch).toHaveBeenCalledWith("site");
    const file = new File(["pdf"], "plan.pdf", { type: "application/pdf" });
    fireEvent.change(screen.getByLabelText("Browse files"), { target: { files: [file] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
    expect(screen.getByText("AI checked 9 of 10")).toBeInTheDocument();
    expect(screen.getByText("Site Plan v3.pdf")).toBeInTheDocument();
  });

  it("keeps document category keyboard navigation on enabled tabs and avoids duplicate any filters", () => {
    const onCategoryChange = vi.fn();
    render(<><DocumentCategoryTabs categories={[{ key: "all", label: "All", count: 10 }, { key: "design", label: "Design", disabled: true }, { key: "utility", label: "Utility" }]} defaultValue="all" onValueChange={onCategoryChange} /><DocumentStatusFilter options={[{ value: "any", label: "Any status" }, { value: "verified", label: "Verified" }]} /></>);
    const all = screen.getByRole("tab", { name: /All 10/ });
    fireEvent.keyDown(all, { key: "ArrowRight" });
    expect(onCategoryChange).toHaveBeenCalledWith("utility");
    expect(screen.getAllByRole("option", { name: "Any status" })).toHaveLength(1);
    expect(screen.getByRole("option", { name: "Any status" })).toBeInTheDocument();
  });

  it("renders compliance review primitives and actions", () => {
    const onSelect = vi.fn();
    const onFix = vi.fn();
    const finding = { id: "critical", label: "Main disconnect information missing", severity: "critical" as const };
    render(<><DocumentIntelligencePanel fieldsExtracted={214} mismatches={3} averageCheckTime="11s" /><ComplianceScoreCard score={87} passed={2} minor={1} critical={1} /><ComplianceFindingsList findings={[finding]} onSelect={onSelect} /><FindingDetailPanel finding={finding} description="The main disconnect location is missing." /><RequirementSourcesPanel explanation="The requirement explains the source of the finding." sources={[{ id: "nec", title: "NEC 2023 Article 705.20" }]} /><RecommendedActionCard title="Add the disconnect location" onAction={onFix} /><AIFixDiffPanel lines={[{ label: "AC disconnect", before: "Missing", after: "60A non-fused" }]} /><ReviewActionBar onFixWithAI={onFix} /><ReviewStatusPills statuses={[{ label: "Critical", status: "critical" }, { label: "Fixed", status: "fixed" }]} /></>);
    fireEvent.click(screen.getByRole("button", { name: /Main disconnect/ }));
    fireEvent.click(screen.getByRole("button", { name: "Fix with AI" }));
    expect(onSelect).toHaveBeenCalledWith(finding);
    expect(onFix).toHaveBeenCalled();
    expect(screen.getByText("87%")).toBeInTheDocument();
    expect(screen.getByText("NEC 2023 Article 705.20")).toBeInTheDocument();
    expect(document.querySelectorAll(".inf-detail-score-gauge line")).toHaveLength(51);
  });

  it("renders confidence bars when a document includes an extraction confidence", () => {
    render(<DocumentRow file={{ id: "f-confidence", name: "Site Plan.pdf", confidence: 87 }} />);
    expect(screen.getByLabelText("87% confidence")).toBeInTheDocument();
    expect(document.querySelectorAll(".inf-detail-confidence__bars i.is-filled")).toHaveLength(4);
  });

  it("maps confidence values to semantic high, medium, and low bands", () => {
    render(<><DocumentRow file={{ id: "high", name: "High.pdf", confidence: 98 }} /><DocumentRow file={{ id: "medium", name: "Medium.pdf", confidence: 75 }} /><DocumentRow file={{ id: "low", name: "Low.pdf", confidence: 40 }} /></>);
    expect(screen.getByLabelText("98% confidence")).toHaveClass("inf-detail-confidence--high");
    expect(screen.getByLabelText("75% confidence")).toHaveClass("inf-detail-confidence--medium");
    expect(screen.getByLabelText("40% confidence")).toHaveClass("inf-detail-confidence--low");
  });
});

