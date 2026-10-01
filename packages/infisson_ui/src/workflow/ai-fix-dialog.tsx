import { useRef, useState, type ReactNode } from "react";
import { Button } from "../button";
import { Dialog } from "../dialog";
import type { AIFixChange } from "./types";

export interface VersionIndicatorProps {
  from: string;
  to: string;
}

export function VersionIndicator({ from, to }: VersionIndicatorProps) {
  return <span className="inf-workflow-version" aria-label={`Version ${from} to ${to}`}><span>{from}</span><span aria-hidden="true">to</span><strong>{to}</strong></span>;
}

export interface ChangeListProps {
  changes: AIFixChange[];
}

export function ChangeList({ changes }: ChangeListProps) {
  return <ul className="inf-workflow-change-list" aria-label="AI proposed changes">
    {changes.map((change) => <li key={change.id} className={`inf-workflow-change inf-workflow-change--${change.kind ?? "updated"}`}>
      <span className="inf-workflow-change__mark" aria-hidden="true">{change.kind === "removed" ? <svg viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg> : change.kind === "updated" ? <svg viewBox="0 0 16 16" width="14" height="14"><circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg> : <svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" /></svg>}</span>
      <span className="inf-workflow-change__copy"><strong>{change.label}</strong>{change.description ? <small>{change.description}</small> : null}</span>
    </li>)}
  </ul>;
}

export interface ApprovalOptionsProps {
  approverName?: string;
  requestApproval?: boolean;
  rerunCompliance?: boolean;
  onRequestApprovalChange?: (checked: boolean) => void;
  onRerunComplianceChange?: (checked: boolean) => void;
}

export function ApprovalOptions({ approverName = "Mira Solis", requestApproval = true, rerunCompliance = false, onRequestApprovalChange, onRerunComplianceChange }: ApprovalOptionsProps) {
  const [internalRequestApproval, setInternalRequestApproval] = useState(requestApproval);
  const [internalRerunCompliance, setInternalRerunCompliance] = useState(rerunCompliance);
  const currentRequestApproval = onRequestApprovalChange ? requestApproval : internalRequestApproval;
  const currentRerunCompliance = onRerunComplianceChange ? rerunCompliance : internalRerunCompliance;
  return <fieldset className="inf-workflow-options"><legend>Approval options</legend>
    <label><input type="checkbox" checked={currentRequestApproval} onChange={(event) => { if (!onRequestApprovalChange) setInternalRequestApproval(event.target.checked); onRequestApprovalChange?.(event.target.checked); }} aria-label={`Ask ${approverName} to approve this revision`} /> Ask {approverName} to approve the revision</label>
    <label><input type="checkbox" checked={currentRerunCompliance} onChange={(event) => { if (!onRerunComplianceChange) setInternalRerunCompliance(event.target.checked); onRerunComplianceChange?.(event.target.checked); }} aria-label="Re-run the compliance check after applying" /> Re-run the compliance check after applying</label>
  </fieldset>;
}

export interface VersionHistoryHintProps { children?: ReactNode; }
export function VersionHistoryHint({ children = "The previous revision stays available in version history." }: VersionHistoryHintProps) {
  return <p className="inf-workflow-hint"><span aria-hidden="true">ⓘ</span>{children}</p>;
}

export interface AIFixDialogProps extends ApprovalOptionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  changes: AIFixChange[];
  fromVersion?: string;
  toVersion?: string;
  onApplyFix?: () => void | Promise<void>;
  onCancel?: () => void;
  applyLabel?: string;
  cancelLabel?: string;
  changeHeading?: string;
}

export function AIFixDialog({
  open,
  onOpenChange,
  title = "Let infission AI edit this sheet?",
  description = "The stamped drawing changes are ready for review. Approve the revision before it is applied.",
  changes,
  fromVersion = "v2",
  toVersion = "v3",
  requestApproval = true,
  rerunCompliance = false,
  onRequestApprovalChange,
  onRerunComplianceChange,
  onApplyFix,
  onCancel,
  applyLabel = "Apply fix",
  cancelLabel = "Cancel",
  changeHeading = "Changes to detail C",
}: AIFixDialogProps) {
  const [applying, setApplying] = useState(false);
  const applyingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const apply = async () => {
    // The ref closes the small gap before React commits `applying=true`, so a
    // double click cannot invoke a host mutation twice.
    if (!onApplyFix || applyingRef.current) return;
    applyingRef.current = true;
    setApplying(true);
    setError(null);
    try { await onApplyFix(); } catch (reason) { setError(reason instanceof Error ? reason.message : "The revision could not be applied. Please try again."); } finally { applyingRef.current = false; setApplying(false); }
  };
  return <Dialog open={open} onOpenChange={onOpenChange} title={title} description={description} className="inf-workflow-dialog" actions={<>
    <Button type="button" variant="outline" disabled={applying} onClick={() => { onCancel?.(); onOpenChange(false); }}>{cancelLabel}</Button>
    <Button type="button" variant="brand" onClick={apply} loading={applying}><span aria-hidden="true">✦</span>{applyLabel}</Button>
  </>}> 
    <div className="inf-workflow-dialog__section"><div className="inf-workflow-section-heading"><strong>{changeHeading}</strong><VersionIndicator from={fromVersion} to={toVersion} /></div><ChangeList changes={changes} /></div>
    <ApprovalOptions requestApproval={requestApproval} rerunCompliance={rerunCompliance} onRequestApprovalChange={onRequestApprovalChange} onRerunComplianceChange={onRerunComplianceChange} />
    <VersionHistoryHint />
    {error ? <p className="inf-workflow-error" role="alert">{error}</p> : null}
  </Dialog>;
}

export type AIFixDialogChange = AIFixChange;
export type AIFixDialogContent = ReactNode;

