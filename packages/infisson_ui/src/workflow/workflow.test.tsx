import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AIFixDialog } from "./ai-fix-dialog";
import { PackageContentList, PackageReadyBanner, PackageSubmitPanel, SubmissionTargetCard } from "./package-submit-panel";
import { SubmitConfirmationDialog } from "./submit-confirmation-dialog";
import { SubmissionProgressOverlay } from "./submission-progress-overlay";
import { SubmissionSuccessPanel } from "./submission-success-panel";
import { WorkflowBadge } from "./workflow-badge";
import { useSubmissionWorkflow, type SubmissionResult } from "./use-submission-workflow";

describe("workflow components", () => {
  it("renders the readiness banner and package groups", () => {
    render(<><PackageReadyBanner complete={23} total={23} estimatedDecision="Oct 2, 2026" compliance={96} /><PackageContentList sections={[{ id: "forms", label: "Permit forms", complete: true, documents: [{ id: "a", name: "Building application", pages: 4, status: "generated" }] }]} /></>);
    expect(screen.getByText("23 of 23 requirements complete")).toBeInTheDocument();
    expect(screen.getByText("Building application")).toBeInTheDocument();
    expect(screen.getByText("1 document · 4 pages")).toBeInTheDocument();
  });

  it("exposes document preview actions and a useful empty state", () => {
    const onPreviewDocument = vi.fn();
    render(<PackageContentList sections={[{ id: "forms", label: "Permit forms", documents: [{ id: "a", name: "Zero-page application", pages: 0, status: "pending" }] }]} onPreviewDocument={onPreviewDocument} />);
    expect(screen.getByText("0 pages · pending")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Preview Zero-page application" }));
    expect(onPreviewDocument).toHaveBeenCalledWith(expect.objectContaining({ id: "a" }));
    const { unmount } = render(<PackageContentList sections={[]} />);
    expect(screen.getByRole("status")).toHaveTextContent("No documents have been added");
    unmount();
  });

  it("lets package reviewers toggle document inclusion and preview explicitly", () => {
    const onSelectionChange = vi.fn();
    const onPreviewDocument = vi.fn();
    render(<PackageContentList sections={[{ id: "forms", label: "Permit forms", documents: [{ id: "a", name: "Building application", pages: 4, status: "generated" }] }]} onDocumentSelectionChange={onSelectionChange} onPreviewDocument={onPreviewDocument} />);
    const checkbox = screen.getByRole("checkbox", { name: "Include Building application" });
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(onSelectionChange).toHaveBeenCalledWith(expect.objectContaining({ id: "a" }), false);
    fireEvent.click(screen.getByRole("button", { name: "Preview Building application" }));
    expect(onPreviewDocument).toHaveBeenCalledWith(expect.objectContaining({ id: "a" }));
  });

  it("uses an explicit blocked readiness state and a real hide/show eye toggle", () => {
    const onVisibilityChange = vi.fn();
    render(<><PackageReadyBanner complete={9} total={10} status="blocked" /><PackageContentList sections={[{ id: "forms", label: "Permit forms", documents: [{ id: "a", name: "Building application", pages: 4, status: "generated" }] }]} visibilityMode="hide" onDocumentVisibilityChange={onVisibilityChange} /></>);
    expect(screen.getByLabelText("Package readiness: Blocked")).toBeInTheDocument();
    expect(screen.getByLabelText("Hide Building application")).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("button", { name: "Hide Building application" }));
    expect(screen.getByRole("button", { name: "Show Building application" })).toHaveAttribute("aria-pressed", "true");
    expect(onVisibilityChange).toHaveBeenCalledWith(expect.objectContaining({ id: "a" }), true);
  });

  it("applies an AI fix through an explicit callback", async () => {
    const onApplyFix = vi.fn().mockResolvedValue(undefined);
    render(<AIFixDialog open onOpenChange={vi.fn()} onApplyFix={onApplyFix} changes={[{ id: "c", label: "AC disconnect · 60A non-fused", kind: "added" }]} />);
    expect(screen.getByLabelText("Ask Mira Solis to approve this revision")).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "Apply fix" }));
    await waitFor(() => expect(onApplyFix).toHaveBeenCalledOnce());
  });

  it("does not submit twice when confirm is clicked before the first promise settles", async () => {
    let resolveSubmit!: () => void;
    const onConfirm = vi.fn(() => new Promise<void>((resolve) => { resolveSubmit = resolve; }));
    render(<SubmitConfirmationDialog open onOpenChange={vi.fn()} project="18 Meridian Way" filingType="Standard field package" packageSummary="10 documents" fee="$418" target="Harbor County" filedBy="Avery Chen" confirmLabel="Submit and pay $418" onConfirm={onConfirm} />);
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Submit to Harbor County?");
    expect(screen.getByText("Avery Chen")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Submit and pay $418" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit and pay $418" }));
    expect(onConfirm).toHaveBeenCalledOnce();
    resolveSubmit();
    await waitFor(() => expect(screen.getByRole("button", { name: "Submit and pay $418" })).not.toBeDisabled());
  });

  it("keeps the confirmation dialog open and announces a failed confirmation", async () => {
    const onConfirm = vi.fn().mockRejectedValueOnce(new Error("Portal unavailable"));
    render(<SubmitConfirmationDialog open onOpenChange={vi.fn()} project="18 Meridian Way" filingType="Standard field package" packageSummary="10 documents" fee="$418" target="Harbor County" onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: "Submit and pay" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Portal unavailable"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("requires mandatory confirmation before submit", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    render(<SubmitConfirmationDialog open onOpenChange={vi.fn()} project="18 Meridian Way" filingType="Standard field package" packageSummary="10 documents" fee="$418" target="Harbor County" confirmations={[{ id: "accurate", label: "I confirm the package is complete and accurate", required: true }]} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole("button", { name: "Submit and pay" }));
    expect(onConfirm).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Submit and pay" }));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce());
  });

  it("shows progress and success status variants", () => {
    const { rerender } = render(<SubmissionProgressOverlay open status="loading" progress={40} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40");
    rerender(<SubmissionProgressOverlay open status="unknown" message="We could not confirm the portal response." onDismiss={vi.fn()} />);
    expect(screen.getByText("Submission result unknown")).toBeInTheDocument();
    render(<SubmissionSuccessPanel referenceId="INF-123" filedAt="Sep 24 at 9:12 AM" amount="$418 paid" target="Harbor County" estimatedDecision="Oct 2, 2026" notificationStatus="failed" />);
    expect(screen.getByText("Filed with Harbor County")).toBeInTheDocument();
    expect(screen.getByText(/Reference INF-123/)).toHaveTextContent("$418 paid");
    expect(screen.getByText("Notification failed")).toBeInTheDocument();
    expect(screen.getByLabelText("Submission target")).toBeInTheDocument();
  });

  it("maps workflow statuses to accessible badges", () => {
    render(<WorkflowBadge status="submitted" />);
    expect(screen.getByText("Submitted")).toBeInTheDocument();
    expect(screen.getByText("Submitted")).toHaveClass("inf-workflow-badge--submitted");
    render(<WorkflowBadge status="on-track" />);
    expect(screen.getByText("On track")).toHaveClass("inf-badge--success", "inf-workflow-badge--on-track");
  });

  it("uses a danger tone for a disconnected submission target", () => {
    render(<SubmissionTargetCard target="Harbor County" connection="disconnected" />);
    expect(screen.getByText("Disconnected")).toHaveClass("inf-badge--danger");
  });

  it("uses the target in the submit action and blocks disconnected targets", () => {
    render(<PackageSubmitPanel projectId="INF-1" projectName="Meridian Way" complete={1} total={1} sections={[]} target="Harbor County" connection="disconnected" onSubmitPackage={vi.fn()} />);
    const button = screen.getByRole("button", { name: "Submit to Harbor County" });
    expect(button).toBeDisabled();
  });

  it("exposes a pending submit state and prevents duplicate package actions", () => {
    const onSubmit = vi.fn();
    render(<PackageSubmitPanel projectId="INF-1" projectName="Meridian Way" complete={1} total={1} sections={[]} target="Harbor County" onSubmitPackage={onSubmit} submitPending />);
    const button = screen.getByRole("button", { name: /Submitting to Harbor County/ });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});

function WorkflowHarness({ submit }: { submit: (signal: AbortSignal) => Promise<SubmissionResult> }) {
  const workflow = useSubmissionWorkflow({ submit });
  return <><button onClick={workflow.requestConfirmation}>confirm</button><button onClick={workflow.confirm}>submit</button><button onClick={workflow.cancel}>cancel</button><output>{workflow.phase}</output></>;
}

describe("useSubmissionWorkflow", () => {
  it("moves from confirmation to succeeded with a receipt", async () => {
    const submit = vi.fn().mockResolvedValue({ status: "succeeded", receipt: { referenceId: "INF-1", filedAt: "now", target: "City" } });
    render(<WorkflowHarness submit={submit} />);
    fireEvent.click(screen.getByText("confirm"));
    fireEvent.click(screen.getByText("submit"));
    await waitFor(() => expect(screen.getByText("succeeded")).toBeInTheDocument());
    expect(submit).toHaveBeenCalledOnce();
  });

  it("aborts a pending submission and ignores its late result", async () => {
    let resolveSubmit!: (result: { status: "succeeded"; receipt: { referenceId: string; filedAt: string; target: string } }) => void;
    let signal!: AbortSignal;
    const submit = vi.fn((requestSignal: AbortSignal) => {
      signal = requestSignal;
      return new Promise<{ status: "succeeded"; receipt: { referenceId: string; filedAt: string; target: string } }>((resolve) => { resolveSubmit = resolve; });
    });
    render(<WorkflowHarness submit={submit} />);
    fireEvent.click(screen.getByText("confirm"));
    fireEvent.click(screen.getByText("submit"));
    fireEvent.click(screen.getByText("cancel"));
    // The first request is still in flight, but cancellation resets the phase
    // and aborts the signal before a new attempt can be made.
    expect(signal.aborted).toBe(true);
    // Resolve the old request; the aborted result must be ignored.
    resolveSubmit({ status: "succeeded", receipt: { referenceId: "INF-late", filedAt: "now", target: "City" } });
    await waitFor(() => expect(screen.getByText("ready")).toBeInTheDocument());
  });

  it("keeps unknown portal responses separate from failures", async () => {
    const submit = vi.fn().mockResolvedValue({ status: "unknown" as const, message: "No receipt was returned" });
    render(<WorkflowHarness submit={submit} />);
    fireEvent.click(screen.getByText("confirm"));
    fireEvent.click(screen.getByText("submit"));
    await waitFor(() => expect(screen.getByText("unknown")).toBeInTheDocument());
  });

  it("clears a previous receipt when reset is used", async () => {
    const submit = vi.fn().mockResolvedValue({ status: "succeeded" as const, receipt: { referenceId: "INF-2", filedAt: "now", target: "City" } });
    render(<WorkflowHarness submit={submit} />);
    fireEvent.click(screen.getByText("confirm"));
    fireEvent.click(screen.getByText("submit"));
    await waitFor(() => expect(screen.getByText("succeeded")).toBeInTheDocument());
    fireEvent.click(screen.getByText("cancel"));
    expect(screen.getByText("ready")).toBeInTheDocument();
  });
});

