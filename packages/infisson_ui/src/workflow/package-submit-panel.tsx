import * as React from "react";
import { Button } from "../button";
import { Badge } from "../badge";
import type { ReactNode } from "react";
import type { PackageDocument, PackageSection, SubmissionConnection } from "./types";

export interface PackageReadyBannerProps {
  complete: number;
  total: number;
  estimatedDecision?: string;
  compliance?: number;
  status?: "ready" | "review" | "blocked";
}

export function PackageReadyBanner({ complete, total, estimatedDecision, compliance, status }: PackageReadyBannerProps) {
  const remaining = Math.max(0, total - complete);
  const resolvedStatus = status ?? (remaining > 0 ? "review" : "ready");
  const statusLabel = resolvedStatus === "ready" ? "Ready" : resolvedStatus === "review" ? "Needs review" : "Blocked";
  const readinessCopy = total > 0 && remaining > 0
    ? `${remaining} requirement${remaining === 1 ? "" : "s"} still need review before submission.`
    : "infission AI found no critical compliance issues across the package.";
  return <section className={`inf-workflow-ready inf-workflow-ready--${resolvedStatus}`} aria-label={`Package readiness: ${statusLabel}`} aria-live="polite"><span className="inf-workflow-ready__check" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">{resolvedStatus === "ready" ? <path d="m5 12 4.2 4.2L19 6.5" /> : resolvedStatus === "review" ? <path d="M12 7v5m0 4h.01" /> : <path d="m7 7 10 10M17 7 7 17" />}</svg></span><div><strong>{complete} of {total} requirements complete</strong><p>{resolvedStatus === "blocked" ? "Resolve the blocking findings before submission." : readinessCopy}</p></div><dl><div><dt>Estimated decision</dt><dd>{estimatedDecision ?? "—"}</dd></div>{typeof compliance === "number" ? <div><dt>Compliance</dt><dd>{compliance}%</dd></div> : null}</dl></section>;
}

export type PackageDocumentPreviewHandler = (document: PackageDocument) => void;
export type PackageDocumentVisibilityHandler = (document: PackageDocument, hidden: boolean) => void;

interface DocumentRowProps {
  document: PackageDocument;
  selected: boolean;
  selectable: boolean;
  onSelectionChange?: (document: PackageDocument, selected: boolean) => void;
  onPreviewDocument?: PackageDocumentPreviewHandler;
  hidden: boolean;
  visibilityMode: "preview" | "hide";
  onVisibilityChange?: PackageDocumentVisibilityHandler;
}

function DocumentRow({ document, selected, selectable, onSelectionChange, onPreviewDocument, hidden, visibilityMode, onVisibilityChange }: DocumentRowProps) {
  const pending = document.status === "pending";
  const metadata = typeof document.pages === "number" ? `${document.pages} page${document.pages === 1 ? "" : "s"}` : document.meta ?? "Document";
  const handleVisibility = () => onVisibilityChange?.(document, !hidden);
  const icon = hidden ? <><path d="m3 3 14 14" /><path d="M8.3 5.2A8.8 8.8 0 0 1 10 5c4.8 0 7.5 5 7.5 5a12 12 0 0 1-2.2 2.9M5.2 7.2C3.6 8.3 2.5 10 2.5 10s2.7 5 7.5 5c.8 0 1.5-.1 2.2-.4" /></> : <><path d="M2.5 10s2.7-4 7.5-4 7.5 4 7.5 4-2.7 4-7.5 4-7.5-4-7.5-4Z" /><circle cx="10" cy="10" r="1.8" /></>;
  return <li className={`inf-workflow-document${hidden ? " is-hidden" : ""}`}>{selectable ? <input className="inf-workflow-document__checkbox" type="checkbox" checked={selected} aria-label={`Include ${document.name}`} onChange={(event) => onSelectionChange?.(document, event.target.checked)} /> : <span className={`inf-workflow-document__check${pending ? " inf-workflow-document__check--pending" : ""}`} aria-hidden="true">{pending ? "…" : "✓"}</span>}<span className="inf-workflow-document__copy"><strong>{document.name}</strong><small>{metadata} · {document.status ?? "accepted"}</small></span>{visibilityMode === "hide" ? <button className="inf-workflow-document__view" type="button" aria-label={`${hidden ? "Show" : "Hide"} ${document.name}`} title={`${hidden ? "Show" : "Hide"} ${document.name}`} aria-pressed={hidden} onClick={handleVisibility}><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">{icon}</svg></button> : onPreviewDocument ? <button className="inf-workflow-document__view" type="button" aria-label={`Preview ${document.name}`} title={`Preview ${document.name}`} onClick={() => onPreviewDocument(document)}><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 10s2.7-4 7.5-4 7.5 4 7.5 4-2.7 4-7.5 4-7.5-4-7.5-4Z"/><circle cx="10" cy="10" r="1.8"/></svg></button> : <span className="inf-workflow-document__view" aria-hidden="true"><svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 10s2.7-4 7.5-4 7.5 4 7.5 4-2.7 4-7.5 4-7.5-4-7.5-4Z"/><circle cx="10" cy="10" r="1.8"/></svg></span>}</li>;
}

export interface PackageContentListProps {
  sections: PackageSection[];
  onPreviewDocument?: PackageDocumentPreviewHandler;
  emptyMessage?: ReactNode;
  /** Shows real selection checkboxes for each document. Defaults to true for package review. */
  selectable?: boolean;
  selectedDocumentIds?: string[];
  defaultSelectedDocumentIds?: string[];
  onDocumentSelectionChange?: (document: PackageDocument, selected: boolean) => void;
  visibilityMode?: "preview" | "hide";
  hiddenDocumentIds?: string[];
  defaultHiddenDocumentIds?: string[];
  onDocumentVisibilityChange?: PackageDocumentVisibilityHandler;
}
export function PackageContentList({ sections, onPreviewDocument, emptyMessage = "No documents have been added to this package yet.", selectable = true, selectedDocumentIds, defaultSelectedDocumentIds, onDocumentSelectionChange, visibilityMode = "preview", hiddenDocumentIds, defaultHiddenDocumentIds, onDocumentVisibilityChange }: PackageContentListProps) {
  const documents = React.useMemo(() => sections.flatMap((section) => section.documents), [sections]);
  const pageCount = documents.reduce((count, document) => count + (document.pages ?? 0), 0);
  const initialSelected = defaultSelectedDocumentIds ?? documents.map((document) => document.id);
  const [internalSelected, setInternalSelected] = React.useState<string[]>(initialSelected);
  const selected = selectedDocumentIds ?? internalSelected;
  const initialHidden = defaultHiddenDocumentIds ?? [];
  const [internalHidden, setInternalHidden] = React.useState<string[]>(initialHidden);
  const hidden = hiddenDocumentIds ?? internalHidden;
  React.useEffect(() => {
    if (selectedDocumentIds === undefined) setInternalSelected((current) => {
      const next = current.filter((id) => documents.some((document) => document.id === id));
      return next.length === current.length ? current : next;
    });
  }, [documents, selectedDocumentIds]);
  const handleSelectionChange = (document: PackageDocument, next: boolean) => {
    if (selectedDocumentIds === undefined) setInternalSelected((current) => next ? Array.from(new Set([...current, document.id])) : current.filter((id) => id !== document.id));
    onDocumentSelectionChange?.(document, next);
  };
  const handleVisibilityChange = (document: PackageDocument, next: boolean) => {
    if (hiddenDocumentIds === undefined) setInternalHidden((current) => next ? Array.from(new Set([...current, document.id])) : current.filter((id) => id !== document.id));
    onDocumentVisibilityChange?.(document, next);
  };
  return <section className="inf-workflow-package-content" aria-label="Package contents"><div className="inf-workflow-subheading"><strong>What is in the package</strong><span>{documents.length} document{documents.length === 1 ? "" : "s"}{pageCount > 0 ? ` · ${pageCount} pages` : ""}</span></div>{documents.length === 0 ? <p className="inf-workflow-empty" role="status">{emptyMessage}</p> : null}{sections.map((section) => <div className="inf-workflow-package-group" key={section.id}><div className="inf-workflow-package-group__heading"><span className="inf-workflow-package-group__icon" aria-hidden="true"><svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="3" y="3" width="14" height="14" rx="2"/><path d="M6 7h8M6 10h8M6 13h5"/></svg></span><strong>{section.label}</strong><Badge tone={section.complete === false ? "warning" : "success"} size="sm">{section.complete === false ? "Needs review" : "Complete"}</Badge></div><ul>{section.documents.length === 0 ? <li className="inf-workflow-empty">No documents in this group.</li> : section.documents.map((document) => <DocumentRow key={document.id} document={document} selectable={selectable} selected={selected.includes(document.id)} onSelectionChange={handleSelectionChange} onPreviewDocument={onPreviewDocument} hidden={hidden.includes(document.id)} visibilityMode={visibilityMode} onVisibilityChange={handleVisibilityChange} />)}</ul></div>)}</section>;
}

export interface AIFinalCheckCardProps { status?: "passed" | "warning" | "failed"; message?: string; checks?: string[]; }
export function AIFinalCheckCard({ status = "passed", message = "No critical compliance issues detected.", checks = ["All requirements have an accepted document", "System values agree across the package", "Main disconnect information is present", "Structural stamp re-dated Sep 23, within 12 months"] }: AIFinalCheckCardProps) {
  const label = status === "passed" ? "Passed" : status === "warning" ? "Needs review" : "Blocked";
  return <section className={`inf-workflow-final-check inf-workflow-final-check--${status}`} aria-label="AI final check"><div className="inf-workflow-final-check__heading"><span aria-hidden="true">✦</span><strong>AI final check</strong><Badge tone={status === "passed" ? "brand" : status === "warning" ? "warning" : "danger"} size="sm">{label}</Badge></div><p>{message}</p><ul>{checks.map((check) => <li key={check}><span aria-hidden="true">✓</span>{check}</li>)}</ul></section>;
}

export interface SubmissionTargetCardProps { target: string; connection?: SubmissionConnection | string; filingType?: string; fee?: string; filedBy?: string; compact?: boolean; }
export function SubmissionTargetCard({ target, connection = "Connected", filingType, fee, filedBy, compact = false }: SubmissionTargetCardProps) {
  const normalized = connection.toLowerCase();
  const tone = normalized === "disconnected" ? "danger" : normalized === "ready" ? "brand" : normalized === "connected" ? "success" : "neutral";
  const label = normalized === "connected" ? "Connected" : normalized === "disconnected" ? "Disconnected" : normalized === "ready" ? "Ready" : connection;
  return <section className={`inf-workflow-target ${compact ? "inf-workflow-target--compact" : ""}`} aria-label="Submission target"><div className="inf-workflow-target__heading"><span className="inf-workflow-target__icon" aria-hidden="true">⌂</span><div><strong>{target}</strong><small>Development services portal</small></div><Badge tone={tone} size="sm" dot={normalized === "connected" || normalized === "disconnected"}>{label}</Badge></div>{filingType || fee || filedBy ? <dl>{filingType ? <div><dt>Filing type</dt><dd>{filingType}</dd></div> : null}{fee ? <div><dt>Fee</dt><dd>{fee}</dd></div> : null}{filedBy ? <div><dt>Filed by</dt><dd>{filedBy}</dd></div> : null}</dl> : null}</section>;
}

export interface BeforeSubmitChecklistItem { id: string; label: string; checked?: boolean; defaultChecked?: boolean; disabled?: boolean; }
export interface BeforeSubmitChecklistProps { items: BeforeSubmitChecklistItem[]; onChange?: (id: string, checked: boolean) => void; }
function ChecklistItem({ item, onChange }: { item: BeforeSubmitChecklistItem; onChange?: (id: string, checked: boolean) => void }) {
  const [internalChecked, setInternalChecked] = React.useState(item.checked ?? item.defaultChecked ?? false);
  const controlled = item.checked !== undefined && Boolean(onChange);
  const checked = controlled ? Boolean(item.checked) : internalChecked;
  return <label><input type="checkbox" checked={checked} disabled={item.disabled} onChange={(event) => { if (!controlled) setInternalChecked(event.target.checked); onChange?.(item.id, event.target.checked); }} /> {item.label}</label>;
}
export function BeforeSubmitChecklist({ items, onChange }: BeforeSubmitChecklistProps) { return <fieldset className="inf-workflow-checklist"><legend>Before you submit</legend>{items.map((item) => <ChecklistItem key={item.id} item={item} onChange={onChange} />)}</fieldset>; }

export interface PackageSubmitPanelProps extends SubmissionTargetCardProps {
  projectId: string;
  projectName: string;
  complete: number;
  total: number;
  estimatedDecision?: string;
  compliance?: number;
  sections: PackageSection[];
  checklist?: BeforeSubmitChecklistProps["items"];
  onChecklistChange?: BeforeSubmitChecklistProps["onChange"];
  onPreviewPackage?: () => void;
  onPreviewDocument?: PackageDocumentPreviewHandler;
  selectableDocuments?: boolean;
  selectedDocumentIds?: string[];
  defaultSelectedDocumentIds?: string[];
  onDocumentSelectionChange?: PackageContentListProps["onDocumentSelectionChange"];
  visibilityMode?: PackageContentListProps["visibilityMode"];
  hiddenDocumentIds?: PackageContentListProps["hiddenDocumentIds"];
  defaultHiddenDocumentIds?: PackageContentListProps["defaultHiddenDocumentIds"];
  onDocumentVisibilityChange?: PackageContentListProps["onDocumentVisibilityChange"];
  onSubmitPackage?: () => void;
  finalCheck?: AIFinalCheckCardProps;
  emptyMessage?: ReactNode;
  submitLabel?: string;
  submitDisabled?: boolean;
  submitPending?: boolean;
}

export function PackageSubmitPanel({ projectId, projectName, complete, total, estimatedDecision, compliance, sections, checklist = [], onChecklistChange, onPreviewPackage, onPreviewDocument, selectableDocuments = true, selectedDocumentIds, defaultSelectedDocumentIds, onDocumentSelectionChange, visibilityMode, hiddenDocumentIds, defaultHiddenDocumentIds, onDocumentVisibilityChange, onSubmitPackage, finalCheck, emptyMessage, submitLabel, submitDisabled, submitPending = false, target, connection, filingType, fee, filedBy }: PackageSubmitPanelProps) {
  const cannotConnect = typeof connection === "string" && connection.toLowerCase() === "disconnected";
  const isSubmitDisabled = submitDisabled || submitPending || cannotConnect;
  return <div className="inf-workflow-package-panel"><header className="inf-workflow-package-header"><div><small>{projectId}</small><h2>{projectName}</h2></div><Badge tone="success">On track</Badge></header><PackageReadyBanner complete={complete} total={total} estimatedDecision={estimatedDecision} compliance={compliance} /><div className="inf-workflow-package-layout"><PackageContentList sections={sections} onPreviewDocument={onPreviewDocument} emptyMessage={emptyMessage} selectable={selectableDocuments} selectedDocumentIds={selectedDocumentIds} defaultSelectedDocumentIds={defaultSelectedDocumentIds} onDocumentSelectionChange={onDocumentSelectionChange} visibilityMode={visibilityMode} hiddenDocumentIds={hiddenDocumentIds} defaultHiddenDocumentIds={defaultHiddenDocumentIds} onDocumentVisibilityChange={onDocumentVisibilityChange} /><aside><AIFinalCheckCard {...finalCheck} /><SubmissionTargetCard target={target} connection={connection} filingType={filingType} fee={fee} filedBy={filedBy} /><BeforeSubmitChecklist items={checklist} onChange={onChecklistChange} /></aside></div><footer className="inf-workflow-package-actions"><Button type="button" variant="outline" onClick={onPreviewPackage}><span aria-hidden="true">◉</span>Preview package</Button><Button type="button" variant="dark" onClick={onSubmitPackage} disabled={isSubmitDisabled} loading={submitPending}><span aria-hidden="true">➤</span>{submitPending ? `Submitting to ${target}…` : submitLabel ?? `Submit to ${target}`}</Button></footer></div>;
}
