import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
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
} from "infisson_ui";

const meta = {
  title: "Infisson UI/Detail",
  parameters: { docs: { description: { component: "B01–B28 project detail, documents and compliance components. / B01–B28 项目详情、文档中心和合规审查组件。" } } },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const files = [
  { id: "site", name: "Site Plan v3.pdf", size: "2.4 MB", owner: "Mira Solis", status: "verified" as const, confidence: 98, date: "2026-09-18" },
  { id: "electrical", name: "Electrical Plan v2.pdf", size: "3.1 MB", owner: "Mira Solis", status: "needs-review" as const, confidence: 87, date: "2026-09-18" },
];
const finding = { id: "disconnect", label: "Main disconnect information missing", severity: "critical" as const, detail: "Blocks submission" };

export const Catalog: Story = {
  render: () => <div style={{ display: "grid", gap: 16, maxWidth: 960 }}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}><ProjectBreadcrumb items={[{ label: "Projects", href: "#projects" }, { label: "18 Meridian Way" }]} onBack={() => undefined} /><ProjectIdChip id="PL-2841" /><ProjectStatusBadge status="on-track" /></div>
    <ProjectTabs items={[{ key: "overview", label: "Overview" }, { key: "documents", label: "Documents", count: 10 }, { key: "compliance", label: "Compliance" }]} defaultValue="overview" />
    <ProjectHeaderActions actions={<><button type="button">Permit package</button><button type="button">Actions</button></>} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}><PermitProgressCard completion={78} steps={[{ id: "design", label: "Design", date: "Sep 8", status: "complete" }, { id: "review", label: "Submitted in review", date: "Day 4", status: "current" }, { id: "inspection", label: "Inspection", date: "Oct 8", status: "upcoming" }]} /><ProjectAIStatusCard status="Project is on track" message="Next milestone is the AHJ decision." confidence={91} updatedAt="2 min ago" /><RequirementsSummary metrics={[{ label: "Complete", value: 23, tone: "brand" }, { label: "Harbor County", value: "14 of 14" }, { label: "Harbor Utilities", value: "9 of 9" }]} /></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}><ActivityFeed items={[{ id: "review", title: "AHJ review started", description: "Plan reviewer picked up the package.", timestamp: "Sep 25", tone: "success" }]} /><ProjectDetailsCard fields={[{ label: "Jurisdiction", value: "Harbor County" }, { label: "System", value: "42 units · 20 modules" }]} /><ProjectTeamCard members={[{ id: "marcus", name: "Avery Chen", role: "Permit coordinator · owner", initials: "AC" }, { id: "elena", name: "Mira Solis", role: "Design lead", initials: "MS" }]} /></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}><InspectionScheduleCard date="Thu Oct 8" time="10:30 AM" inspector="Riley Stone" location="18 Meridian Way" onAction={() => undefined} /><div style={{ display: "grid", gap: 8 }}><DocumentCategoryTabs categories={[{ key: "all", label: "All", count: 10 }, { key: "design", label: "Design", count: 3 }, { key: "utility", label: "Utility", count: 4, disabled: true }]} /><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><DocumentStatusFilter options={[{ value: "any", label: "Any status" }, { value: "verified", label: "Verified" }]} /><DocumentSearch defaultValue="plan" /></div></div></div>
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, .8fr)", gap: 12 }}><DocumentGroup title="Design" files={files} onOpenFile={() => undefined} onFileMenu={() => undefined} /><div style={{ display: "grid", gap: 12 }}><AICheckSummary checked={9} total={10} confidence={98} onAction={() => undefined} /><DocumentRow file={files[0]} onOpen={() => undefined} onMenu={() => undefined} /><FileUploadDropzone onFiles={() => undefined} /></div></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}><DocumentIntelligencePanel fieldsExtracted={214} mismatches={3} averageCheckTime="11s" /><ComplianceScoreCard score={87} passed={2} minor={1} critical={1} /></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}><ComplianceFindingsList findings={[{ ...finding }, { id: "panel", label: "Panel count matches design", severity: "pass" }]} selectedId="disconnect" onSelect={() => undefined} /><FindingDetailPanel finding={finding} description="The submitted plan does not identify the main disconnect location." reference="NEC 2023 Article 705.20" /></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}><RequirementSourcesPanel explanation="The disconnect location is not clear on the plan." sources={[{ id: "nec", title: "NEC 2023 Article 705.20", description: "Disconnecting means" }]} /><RecommendedActionCard title="Add the disconnect location and rating to detail C" description="Recommended action" onAction={() => undefined} /></div>
    <AIFixDiffPanel lines={[{ label: "AC disconnect", before: "Missing", after: "60A non-fused" }]} /><ReviewActionBar onOpenViewer={() => undefined} onSendToDesigner={() => undefined} onFixWithAI={() => undefined} /><ReviewStatusPills statuses={[{ label: "Verified", status: "verified" }, { label: "Needs review", status: "needs-review" }, { label: "Critical", status: "critical" }, { label: "Fixed", status: "fixed" }]} />
  </div>,
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [category, setCategory] = React.useState("all");
    const [open, setOpen] = React.useState(true);
    return <div style={{ display: "grid", gap: 12, maxWidth: 640 }}><strong>Selected category: {category}</strong><DocumentCategoryTabs categories={[{ key: "all", label: "All", count: 10 }, { key: "design", label: "Design", count: 3 }, { key: "utility", label: "Utility", disabled: true }]} value={category} onValueChange={setCategory} /><DocumentGroup title="Design" files={files} open={open} onOpenChange={setOpen} onOpenFile={() => undefined} /><button type="button" onClick={() => setOpen((value) => !value)}>{open ? "Collapse" : "Expand"} documents</button></div>;
  },
};


