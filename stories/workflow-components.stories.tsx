import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  AIFixDialog,
  PackageSubmitPanel,
  SubmissionProgressOverlay,
  SubmissionSuccessPanel,
  SubmitConfirmationDialog,
  WorkflowBadge,
} from "infisson_ui";

const sections = [
  {
    id: "forms",
    label: "Permit forms",
    complete: true,
    documents: [
      { id: "b1", name: "Building Permit Application B-1", pages: 4, status: "generated" as const },
      { id: "e2", name: "Electrical Permit Application E-2", pages: 3, status: "generated" as const },
    ],
  },
  {
    id: "design",
    label: "Design set",
    complete: true,
    documents: [{ id: "site", name: "Site Plan v3", pages: 2, status: "verified" as const }],
  },
];

const meta = {
  title: "Infisson UI/Workflow",
  parameters: {
    docs: {
      description: {
        component: "C01–C36 workflow components mapped to the submission and feedback reference board. / 对照图 03 的 C01–C36 工作流组件。",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const PackageSubmission: Story = {
  render: () => {
    const [feedback, setFeedback] = useState("");
    return <div style={{ display: "grid", gap: 16, maxWidth: 900 }}>
      <PackageSubmitPanel
        projectId="PL-2841"
        projectName="18 Meridian Way"
        complete={23}
        total={23}
        estimatedDecision="Oct 2, 2026"
        compliance={96}
        target="Harbor County"
        connection="connected"
        filingType="Standard field package"
        fee="$418 · card on file"
        filedBy="Avery Chen"
        sections={sections}
        checklist={[{ id: "notify", label: "Notify the customer when the permit is filed", defaultChecked: true }]}
        onPreviewDocument={(document) => setFeedback(`Previewing ${document.name}`)}
        onPreviewPackage={() => setFeedback("Package preview opened")}
        onSubmitPackage={() => setFeedback("Confirmation opened")}
      />
      {feedback ? <p role="status">{feedback}</p> : null}
    </div>;
  },
};

export const DialogStates: Story = {
  render: () => {
    const [fixOpen, setFixOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    return <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <button type="button" onClick={() => setFixOpen(true)}>Open AI fix</button>
      <button type="button" onClick={() => setConfirmOpen(true)}>Open confirmation</button>
      <AIFixDialog open={fixOpen} onOpenChange={setFixOpen} changes={[{ id: "disconnect", kind: "added", label: "AC DISCONNECT · 60A NON FUSED", description: "New callout between the combiner and main panel" }]} onApplyFix={() => setFixOpen(false)} />
      <SubmitConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} project="18 Meridian Way" filingType="Standard field package" packageSummary="10 documents · 48 pages" fee="$418 · company card on file" target="Harbor County" confirmLabel="Submit and pay $418" confirmations={[{ id: "accurate", label: "I confirm the package is complete and accurate", required: true }]} onConfirm={() => setConfirmOpen(false)} />
    </div>;
  },
};

export const SubmissionStates: Story = {
  render: () => {
    const [progressOpen, setProgressOpen] = useState(false);
    return <div style={{ display: "grid", gap: 16, maxWidth: 640 }}>
      <button type="button" onClick={() => setProgressOpen(true)}>Show progress overlay</button>
      <SubmissionProgressOverlay open={progressOpen} status="loading" progress={60} onCancel={() => setProgressOpen(false)} />
      <SubmissionSuccessPanel referenceId="INF-2026-11482" filedAt="Sep 24 at 9:12 AM" amount="$418 paid" target="Harbor County" estimatedDecision="Oct 2, 2026" planReview="Starts Sep 25" onDownloadReceipt={() => undefined} onOpenTracker={() => undefined} />
    </div>;
  },
};

export const StatusBadges: Story = {
  render: () => <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{(["ready", "connected", "passed", "submitted", "complete", "on-track"] as const).map((status) => <WorkflowBadge key={status} status={status} />)}</div>,
};


