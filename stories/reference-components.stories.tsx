import type { Meta, StoryObj } from "@storybook/react";
import {
  AIRiskCard,
  AIFixDialog,
  ComplianceScoreCard,
  DocumentGroup,
  PackageSubmitPanel,
  ProjectCard,
  ProjectDetailsCard,
  ProjectStatusBadge,
  SubmissionProgressOverlay,
  SubmissionSuccessPanel,
  WorkflowBadge,
} from "infisson_ui";

const project = { id: "PL-2841", title: "18 Meridian Way", address: "Nova Ridge, NR", jurisdiction: "Harbor County", status: "under-review" as const, progress: 78, system: "42 units", battery: "24 units", owner: "Avery Chen", due: "Oct 2" };
const meta = { title: "Infisson UI/Reference components", parameters: { docs: { description: { component: "A/B/C reference components share the same package source as the unified preview. / A/B/C 参考组件与统一预览使用同一份包源码。" } } } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const GlobalProjectCard: Story = { render: () => <ProjectCard project={project} /> };
export const DetailReview: Story = { render: () => <div style={{ display: "grid", gap: 12, maxWidth: 620 }}><ProjectStatusBadge status="under-review" /><ProjectDetailsCard fields={[{ label: "Jurisdiction", value: "Harbor County" }, { label: "System", value: "42 units · 20 modules" }]} /><DocumentGroup title="Design · 2 files" files={[{ id: "1", name: "Site Plan v3.pdf", size: "2.4 MB", owner: "Mira Solis", status: "verified", confidence: 98 }]} /><ComplianceScoreCard score={87} passed={2} minor={1} critical={1} /></div> };
export const WorkflowStates: Story = { render: () => <div style={{ display: "grid", gap: 12, maxWidth: 620 }}><WorkflowBadge status="on-track" /><AIRiskCard projectsAtRisk={7} risks={["3 required documents are missing", "2 unusual review delays"]} /><PackageSubmitPanel projectId="PL-2841" projectName="18 Meridian Way" complete={23} total={23} compliance={96} target="Harbor County" sections={[]} /><SubmissionSuccessPanel referenceId="INF-2026-11482" filedAt="Sep 24 at 9:12 AM" target="Harbor County" estimatedDecision="Oct 2, 2026" /></div> };
export const MotionStates: Story = { render: () => <div style={{ display: "grid", gap: 12 }}><AIFixDialog open={false} onOpenChange={() => undefined} changes={[{ id: "change", kind: "added", label: "AC DISCONNECT", description: "Added to detail C" }]} onApplyFix={() => undefined} /><SubmissionProgressOverlay open={false} status="loading" progress={60} /></div> };


