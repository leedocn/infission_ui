import type { Meta, StoryObj } from "@storybook/react";
import {
  AIRiskCard,
  AttentionTable,
  PackageComplianceCard,
  PortfolioStats,
  ProjectHeroCard,
  ProjectPipeline,
  ProjectStatusFilters,
  TimeRangeControl,
} from "infisson_ui";

const meta = {
  title: "Infisson UI/Global dashboard components",
  parameters: {
    docs: { description: { component: "A15–A22 dashboard primitives. Interactive controls expose callbacks and visible state; PortfolioStats is intentionally display-only. / A15–A22 仪表盘组件。可操作控件提供回调与可见状态；PortfolioStats 按规范保持展示型。" } },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const project = { id: "PL-2841", title: "18 Meridian Way", address: "Nova Ridge, NR", jurisdiction: "Harbor County", status: "under-review" as const, progress: 78, meta: [{ label: "System", value: "42 units" }, { label: "Stage", value: "AHJ review" }, { label: "Decision", value: "Oct 2" }] };

export const TimeRange: Story = { render: () => <TimeRangeControl onChange={(value) => console.info("time range", value)} /> };
export const ProjectHero: Story = { render: () => <ProjectHeroCard project={project} onOpen={() => console.info("open project", project.id)} /> };
export const Portfolio: Story = { render: () => <PortfolioStats stats={[{ label: "Active projects", value: 128, detail: "7 this week", tone: "dark" }, { label: "In permitting", value: 47, detail: "6 this week" }, { label: "Awaiting review", value: 18, detail: "4.2 days in queue" }, { label: "At risk", value: 7, detail: "needs action today" }]} /> };
export const Pipeline: Story = { render: () => <ProjectPipeline stages={[{ label: "Design", count: 32, color: "#c5f33e" }, { label: "Permit", count: 47, color: "#d8f56b" }, { label: "Review", count: 18, color: "#e8ebf1" }, { label: "Inspection", count: 19, color: "#dfe3eb" }, { label: "PTO", count: 12, color: "#111214" }]} onAction={() => console.info("open pipeline")} /> };
export const Attention: Story = { render: () => <AttentionTable rows={[{ id: "PL-2796", project: "42 Willow Loop", address: "Pine Hollow, PH", stage: "AHJ review", blocker: "AHJ review 11 days", risk: "high", due: "Oct 1" }, { id: "PL-2848", project: "18 Meridian Way", address: "Nova Ridge, NR", stage: "Design", blocker: "Missing documents", risk: "medium", due: "Sep 30" }]} onRowClick={(row) => console.info("open attention row", row.id)} /> };
export const AIRisk: Story = { render: () => <AIRiskCard projectsAtRisk={7} risks={["3 are missing required documents", "2 have unusual review delays", "2 may miss their install dates", "Utility response is overdue"]} onAction={() => console.info("risk review toggled")} /> };
export const Compliance: Story = { render: () => <PackageComplianceCard score={94} project="18 Meridian Way" checked={1184} flagged={31} rejected={0.8} onAction={() => console.info("compliance details toggled")} /> };
export const StatusFilters: Story = { render: () => <ProjectStatusFilters options={[{ value: "all", label: "All", count: 128 }, { value: "permitting", label: "In permitting", count: 47 }, { value: "review", label: "Under review", count: 18 }, { value: "risk", label: "At risk", count: 7 }, { value: "approved", label: "Approved", count: 44 }]} onChange={(value) => console.info("status", value)} /> };

