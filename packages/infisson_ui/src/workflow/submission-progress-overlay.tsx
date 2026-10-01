import { Button } from "../button";
import { useEffect, useId, useRef, useState } from "react";

export type SubmissionProgressStatus = "loading" | "submitted" | "failed" | "unknown";

export interface SubmissionProgressOverlayProps {
  open: boolean;
  status?: SubmissionProgressStatus;
  title?: string;
  message?: string;
  progress?: number;
  onDismiss?: () => void;
  onCancel?: () => void;
}

export function SubmissionProgressOverlay({ open, status = "loading", title = "Submitting permit package...", message = "Please keep this window open while infission contacts the simulated portal.", progress, onDismiss, onCancel }: SubmissionProgressOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [mounted, setMounted] = useState(open);
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    setMounted(false);
  }, [open]);
  useEffect(() => { const dialog = dialogRef.current; if (!dialog || !open || !mounted) return; if (!dialog.open) dialog.showModal(); }, [open, mounted]);
  useEffect(() => { const dialog = dialogRef.current; if (!dialog) return; const onEscape = (event: Event) => { event.preventDefault(); if (status === "loading") onCancel?.(); else onDismiss?.(); }; dialog.addEventListener("cancel", onEscape); return () => dialog.removeEventListener("cancel", onEscape); }, [onCancel, onDismiss, status]);
  if (!mounted) return null;
  const bounded = typeof progress === "number" ? Math.min(100, Math.max(0, progress)) : undefined;
  return <dialog ref={dialogRef} className={`inf-workflow-progress-overlay inf-workflow-progress-overlay--${status}`} aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId} aria-busy={status === "loading" || undefined}><div className="inf-workflow-progress-card"><div className="inf-workflow-progress-icon" aria-hidden="true">{status === "loading" ? <span className="inf-workflow-progress-spinner" /> : status === "submitted" ? "✓" : "!"}</div><h2 id={titleId}>{status === "submitted" ? "Package submitted" : status === "failed" ? "Submission paused" : status === "unknown" ? "Submission result unknown" : title}</h2><p id={descriptionId} aria-live="polite">{message}</p>{typeof bounded === "number" ? <div className="inf-workflow-progress-track" role="progressbar" aria-label="Submission progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={bounded}><span style={{ transform: `scaleX(${bounded / 100})` }} /></div> : null}{status !== "loading" ? <Button type="button" variant={status === "failed" || status === "unknown" ? "outline" : "brand"} onClick={onDismiss}>{status === "failed" || status === "unknown" ? "Close" : "Continue"}</Button> : onCancel ? <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button> : null}</div></dialog>;
}
