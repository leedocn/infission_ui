import { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import { Dialog } from "../dialog";
import type { SubmissionConfirmation, SubmissionConnection } from "./types";
import { SubmissionTargetCard } from "./package-submit-panel";

export interface SubmissionSummaryProps { project: string; filingType: string; packageSummary: string; fee: string; filedBy?: string; }
export function SubmissionSummary({ project, filingType, packageSummary, fee, filedBy }: SubmissionSummaryProps) { return <dl className="inf-workflow-summary"><div><dt>Project</dt><dd>{project}</dd></div><div><dt>Filing type</dt><dd>{filingType}</dd></div><div><dt>Package</dt><dd>{packageSummary}</dd></div><div><dt>Fee</dt><dd>{fee}</dd></div>{filedBy ? <div><dt>Filed by</dt><dd>{filedBy}</dd></div> : null}</dl>; }

export interface ConnectionStatusBadgeProps { status?: SubmissionConnection; }
export function ConnectionStatusBadge({ status = "connected" }: ConnectionStatusBadgeProps) { const label = status === "connected" ? "Connected" : status === "ready" ? "Ready" : "Disconnected"; return <Badge tone={status === "disconnected" ? "danger" : status === "ready" ? "brand" : "success"} dot>{label}</Badge>; }

export interface SubmissionConfirmationsProps { items: SubmissionConfirmation[]; values?: Record<string, boolean>; onChange?: (id: string, checked: boolean) => void; }
export function SubmissionConfirmations({ items, values, onChange }: SubmissionConfirmationsProps) { return <fieldset className="inf-workflow-confirmations"><legend>Confirm before submitting</legend>{items.map((item) => <label key={item.id}><input type="checkbox" checked={values ? Boolean(values[item.id]) : undefined} defaultChecked={values ? undefined : item.defaultChecked} aria-required={item.required || undefined} onChange={(event) => onChange?.(item.id, event.target.checked)} />{item.label}{item.required ? <span aria-label="required">*</span> : null}</label>)}</fieldset>; }

export interface SubmissionDialogActionsProps { onCancel?: () => void; onConfirm?: () => void; canSubmit?: boolean; confirming?: boolean; confirmLabel?: string; }
export function SubmissionDialogActions({ onCancel, onConfirm, canSubmit = true, confirming, confirmLabel = "Submit and pay" }: SubmissionDialogActionsProps) { return <div className="inf-workflow-dialog-actions"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="button" variant="dark" onClick={onConfirm} disabled={!canSubmit} loading={confirming}>{confirmLabel}</Button></div>; }

export interface SubmitConfirmationDialogProps extends SubmissionSummaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: string;
  connection?: SubmissionConnection;
  confirmations?: SubmissionConfirmation[];
  confirmLabel?: string;
  onConfirm?: () => void | Promise<void>;
}

export function SubmitConfirmationDialog({ open, onOpenChange, project, filingType, packageSummary, fee, filedBy, target, connection = "connected", confirmations = [], confirmLabel = "Submit and pay", onConfirm }: SubmitConfirmationDialogProps) {
  const initial = useMemo(() => Object.fromEntries(confirmations.map((item) => [item.id, Boolean(item.defaultChecked)])), [confirmations]);
  const [checked, setChecked] = useState<Record<string, boolean>>(initial);
  const [confirming, setConfirming] = useState(false);
  const confirmingRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = connection !== "disconnected" && confirmations.every((item) => !item.required || checked[item.id]);
  const confirmationKey = confirmations.map((item) => `${item.id}:${Boolean(item.defaultChecked)}`).join("|");
  useEffect(() => { if (open) { setChecked(Object.fromEntries(confirmations.map((item) => [item.id, Boolean(item.defaultChecked)]))); setError(null); } }, [open, confirmationKey]);
  const confirm = async () => { if (!onConfirm || !canSubmit || confirmingRef.current) return; confirmingRef.current = true; setConfirming(true); setError(null); try { await onConfirm(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Submission could not be confirmed. Please review and try again."); } finally { confirmingRef.current = false; setConfirming(false); } };
  const handleChange = (id: string, value: boolean) => { setChecked((current) => ({ ...current, [id]: value })); };
  return <Dialog open={open} onOpenChange={onOpenChange} title={`Submit to ${target}?`} description="This files the package on the development services portal and pays the fee. It cannot be pulled back from infission." className="inf-workflow-dialog" actions={<SubmissionDialogActions onCancel={() => onOpenChange(false)} onConfirm={confirm} canSubmit={canSubmit} confirming={confirming} confirmLabel={confirmLabel} />}> 
    <div className="inf-workflow-dialog__section"><SubmissionTargetCard target={target} connection={connection} /><SubmissionSummary project={project} filingType={filingType} packageSummary={packageSummary} fee={fee} filedBy={filedBy} /><SubmissionConfirmations items={confirmations} values={checked} onChange={handleChange} /></div>
    {error ? <p className="inf-workflow-error" role="alert">{error}</p> : null}
  </Dialog>;
}
