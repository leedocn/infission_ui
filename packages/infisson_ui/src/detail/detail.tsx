import * as React from "react";
import type {
  ChangeEvent,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from "react";

const cx = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(" ");

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ProjectBreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  onBack?: () => void;
  backLabel?: string;
}

export function ProjectBreadcrumb({ items, onBack, backLabel = "Back", className, ...props }: ProjectBreadcrumbProps) {
  return (
    <nav className={cx("inf-detail-breadcrumb", className)} aria-label="Breadcrumb" {...props}>
      {onBack ? <button className="inf-detail-icon-button" type="button" onClick={onBack} aria-label={backLabel}>‹</button> : null}
      <ol>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current={index === items.length - 1 ? "page" : undefined}>{item.label}</span>}
            {index < items.length - 1 ? <span className="inf-detail-breadcrumb__separator" aria-hidden="true">›</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export interface ProjectIdChipProps extends HTMLAttributes<HTMLSpanElement> {
  id: string;
  label?: string;
}

export function ProjectIdChip({ id, label = "Project", className, ...props }: ProjectIdChipProps) {
  return <span className={cx("inf-detail-id-chip", className)} {...props}><span className="inf-detail-id-chip__mark" aria-hidden="true">●</span><span>{label}</span><strong>{id}</strong></span>;
}

export interface ProjectTabItem {
  key: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface ProjectTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: ProjectTabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function ProjectTabs({ items, value, defaultValue, onValueChange, className, ...props }: ProjectTabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? items[0]?.key ?? "");
  const active = value ?? internalValue;
  const select = (key: string) => { if (value === undefined) setInternalValue(key); onValueChange?.(key); };
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const navigate = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabled = items.map((item, itemIndex) => ({ ...item, itemIndex })).filter((item) => !item.disabled);
    const current = enabled.findIndex((item) => item.itemIndex === index);
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % enabled.length;
    else if (event.key === "ArrowLeft") next = (current - 1 + enabled.length) % enabled.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = enabled.length - 1;
    else return;
    event.preventDefault();
    const target = enabled[next];
    if (target) { select(target.key); refs.current[target.itemIndex]?.focus(); }
  };
  return <div className={cx("inf-detail-project-tabs", className)} role="tablist" aria-label="Project sections" aria-orientation="horizontal" {...props}>
    {items.map((item, index) => <button key={item.key} ref={(element) => { refs.current[index] = element; }} type="button" role="tab" aria-selected={active === item.key} tabIndex={active === item.key ? 0 : -1} disabled={item.disabled} onKeyDown={(event) => navigate(event, index)} onClick={() => select(item.key)}>{item.label}{item.count !== undefined ? <span className="inf-detail-tab-count">{item.count}</span> : null}</button>)}
  </div>;
}

export interface ProjectHeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
  actions?: ReactNode;
  status?: ReactNode;
}

export function ProjectHeaderActions({ actions, status, children, className, ...props }: ProjectHeaderActionsProps) {
  return <div className={cx("inf-detail-header-actions", className)} {...props}>{status ? <span className="inf-detail-header-actions__status">{status}</span> : null}{actions ?? children}</div>;
}

export type ProjectStatus = "on-track" | "under-review" | "delayed" | "missing-docs" | "approved" | "at-risk";

export interface ProjectStatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: ProjectStatus;
  label?: string;
}

const projectStatusLabels: Record<ProjectStatus, string> = {
  "on-track": "On track",
  "under-review": "Under review",
  delayed: "Delayed",
  "missing-docs": "Missing docs",
  approved: "Approved",
  "at-risk": "At risk",
};

export function ProjectStatusBadge({ status, label, className, ...props }: ProjectStatusBadgeProps) {
  return <span className={cx("inf-detail-status", `inf-detail-status--${status}`, className)} role="status" {...props}><span aria-hidden="true" className="inf-detail-status__dot" />{label ?? projectStatusLabels[status]}</span>;
}

export type ProgressStepStatus = "complete" | "current" | "upcoming";
export interface PermitProgressStep { id: string; label: string; date?: string; status?: ProgressStepStatus; }
export interface PermitProgressCardProps extends HTMLAttributes<HTMLElement> { steps: PermitProgressStep[]; title?: string; completion?: number; }

export function PermitProgressCard({ steps, title = "Permit progress", completion, className, ...props }: PermitProgressCardProps) {
  const computed = Math.min(100, Math.max(0, completion ?? Math.round((steps.filter((step) => step.status === "complete").length / Math.max(steps.length, 1)) * 100)));
  return <section className={cx("inf-detail-card", "inf-detail-progress-card", className)} {...props}>
    <header><h3>{title}</h3><strong aria-label={`${computed}% complete`}>{computed}%</strong></header>
    <ol className="inf-detail-progress-card__steps">
      {steps.map((step) => <li key={step.id} className={`inf-detail-progress-card__step inf-detail-progress-card__step--${step.status ?? "upcoming"}`}><span className="inf-detail-progress-card__marker" aria-hidden="true">{step.status === "complete" ? "✓" : ""}</span><span><strong>{step.label}</strong>{step.date ? <small>{step.date}</small> : null}</span></li>)}
    </ol>
  </section>;
}

export interface ProjectAIStatusCardProps extends HTMLAttributes<HTMLElement> { status: string; message: string; confidence?: number; updatedAt?: string; }

export function ProjectAIStatusCard({ status, message, confidence, updatedAt, className, ...props }: ProjectAIStatusCardProps) {
  const safeConfidence = confidence !== undefined && Number.isFinite(confidence) ? Math.min(100, Math.max(0, confidence)) : undefined;
  return <section className={cx("inf-detail-card", "inf-detail-ai-status", className)} {...props}><header><span className="inf-detail-ai-status__icon" aria-hidden="true">✦</span><span>infission AI</span>{updatedAt ? <small>{updatedAt}</small> : null}</header><h3>{status}</h3><p>{message}</p>{safeConfidence !== undefined ? <div className="inf-detail-ai-status__confidence"><span>AI confidence</span><strong>{safeConfidence}%</strong><div className="inf-detail-meter" role="progressbar" aria-label="AI confidence" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safeConfidence}><span style={{ "--inf-progress-ratio": safeConfidence / 100 } as React.CSSProperties} /></div></div> : null}</section>;
}

export interface RequirementMetric { label: string; value: number | string; detail?: string; tone?: "brand" | "neutral" | "success" | "warning"; }
export interface RequirementsSummaryProps extends HTMLAttributes<HTMLElement> { metrics: RequirementMetric[]; title?: string; action?: ReactNode; }

export function RequirementsSummary({ metrics, title = "Requirements summary", action, className, ...props }: RequirementsSummaryProps) {
  return <section className={cx("inf-detail-card", "inf-detail-requirements", className)} {...props}><header><h3>{title}</h3>{action}</header><div className="inf-detail-requirements__grid">{metrics.map((metric) => <article key={metric.label} className={`inf-detail-metric inf-detail-metric--${metric.tone ?? "neutral"}`}><strong>{metric.value}</strong><span>{metric.label}</span>{metric.detail ? <small>{metric.detail}</small> : null}</article>)}</div></section>;
}

export interface ActivityItem { id: string; title: string; description?: string; timestamp?: string; tone?: "neutral" | "success" | "warning" | "danger"; }
export interface ActivityFeedProps extends HTMLAttributes<HTMLElement> { items: ActivityItem[]; title?: string; emptyMessage?: string; }

export function ActivityFeed({ items, title = "Activity", emptyMessage = "No activity yet.", className, ...props }: ActivityFeedProps) {
  return <section className={cx("inf-detail-card", "inf-detail-activity", className)} {...props}><h3>{title}</h3>{items.length ? <ul>{items.map((item) => <li key={item.id}><span className={`inf-detail-activity__dot inf-detail-activity__dot--${item.tone ?? "neutral"}`} aria-hidden="true" /><div><strong>{item.title}</strong>{item.description ? <p>{item.description}</p> : null}</div>{item.timestamp ? <time>{item.timestamp}</time> : null}</li>)}</ul> : <p className="inf-detail-muted">{emptyMessage}</p>}</section>;
}

export interface ProjectDetailField { label: string; value: ReactNode; }
export interface ProjectDetailsCardProps extends HTMLAttributes<HTMLElement> { fields: ProjectDetailField[]; title?: string; action?: ReactNode; }

export function ProjectDetailsCard({ fields, title = "Project details", action, className, ...props }: ProjectDetailsCardProps) {
  return <section className={cx("inf-detail-card", "inf-detail-details", className)} {...props}><header><h3>{title}</h3>{action}</header><dl>{fields.map((field) => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl></section>;
}

export interface ProjectTeamMember { id: string; name: string; role: string; initials?: string; avatarUrl?: string; }
export interface ProjectTeamCardProps extends HTMLAttributes<HTMLElement> { members: ProjectTeamMember[]; title?: string; onMemberMenu?: (member: ProjectTeamMember) => void; }

export function ProjectTeamCard({ members, title = "Team", onMemberMenu, className, ...props }: ProjectTeamCardProps) {
  return <section className={cx("inf-detail-card", "inf-detail-team", className)} {...props}><header><h3>{title}</h3><span>{members.length}</span></header><ul>{members.map((member) => <li key={member.id}><span className="inf-detail-avatar">{member.avatarUrl ? <img src={member.avatarUrl} alt="" /> : member.initials ?? member.name.slice(0, 2).toUpperCase()}</span><span><strong>{member.name}</strong><small>{member.role}</small></span>{onMemberMenu ? <button className="inf-detail-more" type="button" aria-label={`More actions for ${member.name}`} onClick={() => onMemberMenu(member)}>⋮</button> : null}</li>)}</ul></section>;
}

export interface InspectionScheduleCardProps extends HTMLAttributes<HTMLElement> { date: string; time?: string; inspector: string; location?: string; actionLabel?: string; onAction?: () => void; }

export function InspectionScheduleCard({ date, time, inspector, location, actionLabel = "View schedule", onAction, className, ...props }: InspectionScheduleCardProps) {
  return <section className={cx("inf-detail-card", "inf-detail-inspection", className)} {...props}><div className="inf-detail-inspection__icon" aria-hidden="true">▣</div><div><span className="inf-detail-eyebrow">Next inspection</span><h3>{date}{time ? <small>{time}</small> : null}</h3><p>{inspector}{location ? ` · ${location}` : ""}</p></div>{onAction ? <button className="inf-detail-link-button" type="button" onClick={onAction}>{actionLabel} ›</button> : null}</section>;
}

export interface DocumentCategory { key: string; label: string; count?: number; disabled?: boolean; }
export interface DocumentCategoryTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> { categories: DocumentCategory[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; }

export function DocumentCategoryTabs({ categories, value, defaultValue, onValueChange, className, ...props }: DocumentCategoryTabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? categories[0]?.key ?? "");
  const active = value ?? internalValue;
  const select = (key: string) => { if (value === undefined) setInternalValue(key); onValueChange?.(key); };
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const navigate = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const enabled = categories.map((category, itemIndex) => ({ category, itemIndex })).filter(({ category }) => !category.disabled);
    const current = enabled.findIndex(({ itemIndex }) => itemIndex === index);
    if (current < 0) return;
    let next = current;
    if (event.key === "ArrowRight") next = (current + 1) % enabled.length;
    else if (event.key === "ArrowLeft") next = (current - 1 + enabled.length) % enabled.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = enabled.length - 1;
    else return;
    event.preventDefault();
    const target = enabled[next];
    if (target) { select(target.category.key); refs.current[target.itemIndex]?.focus(); }
  };
  return <div className={cx("inf-detail-category-tabs", className)} role="tablist" aria-label="Document categories" aria-orientation="horizontal" {...props}>{categories.map((category, index) => <button key={category.key} ref={(element) => { refs.current[index] = element; }} type="button" role="tab" aria-selected={active === category.key} aria-disabled={category.disabled || undefined} tabIndex={active === category.key ? 0 : -1} disabled={category.disabled} onKeyDown={(event) => navigate(event, index)} onClick={() => select(category.key)}>{category.label}{category.count !== undefined ? <span>{category.count}</span> : null}</button>)}</div>;
}

export type DocumentStatus = "verified" | "needs-review" | "critical" | "pending";
export interface DocumentStatusFilterProps extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "onChange"> { options: Array<{ value: string; label: string }>; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; label?: string; }

export function DocumentStatusFilter({ options, value, defaultValue, onValueChange, label = "Status", className, ...props }: DocumentStatusFilterProps) {
  const anyOption = options.find((option) => option.value === "" || option.value === "any");
  const fallbackValue = anyOption?.value ?? "";
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? fallbackValue);
  const selected = value ?? internalValue;
  const change = (event: ChangeEvent<HTMLSelectElement>) => { if (value === undefined) setInternalValue(event.target.value); onValueChange?.(event.target.value); };
  return <label className={cx("inf-detail-filter", className)} {...props}><span>{label}</span><select value={selected} onChange={change}>{anyOption ? null : <option value="">Any status</option>}{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

export interface DocumentSearchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; label?: string; }

export function DocumentSearch({ value, defaultValue = "", onValueChange, label = "Search documents", className, id, ...props }: DocumentSearchProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const selected = value ?? internalValue;
  const change = (event: ChangeEvent<HTMLInputElement>) => { if (value === undefined) setInternalValue(event.target.value); onValueChange?.(event.target.value); };
  return <label className={cx("inf-detail-search", className)} htmlFor={inputId}><span className="inf-detail-visually-hidden">{label}</span><svg className="inf-detail-search__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg><input id={inputId} value={selected} onChange={change} placeholder="Find a document" {...props} /></label>;
}

export interface AICheckSummaryProps extends HTMLAttributes<HTMLElement> { checked: number; total: number; confidence?: number; status?: "complete" | "running" | "attention"; onAction?: () => void; actionLabel?: string; }

export function AICheckSummary({ checked, total, confidence, status = "complete", onAction, actionLabel = "View details", className, ...props }: AICheckSummaryProps) {
  const safeTotal = Math.max(0, Number.isFinite(total) ? total : 0);
  const safeChecked = Math.min(safeTotal, Math.max(0, Number.isFinite(checked) ? checked : 0));
  const percent = safeTotal ? Math.round((safeChecked / safeTotal) * 100) : 0;
  const safeConfidence = confidence !== undefined && Number.isFinite(confidence) ? Math.min(100, Math.max(0, confidence)) : undefined;
  return <section className={cx("inf-detail-card", "inf-detail-ai-check", `inf-detail-ai-check--${status}`, className)} {...props}><div><span className="inf-detail-ai-status__icon" aria-hidden="true">✦</span><div><h3>AI checked {safeChecked} of {safeTotal}</h3><p>{safeConfidence !== undefined ? `${safeConfidence}% confidence` : status === "running" ? "Checking documents…" : "Review the extracted fields and findings."}</p></div></div><div className="inf-detail-ai-check__progress" role="progressbar" aria-label="Documents checked" aria-valuemin={0} aria-valuemax={safeTotal} aria-valuenow={safeChecked}><span style={{ "--inf-progress-ratio": safeTotal ? safeChecked / safeTotal : 0 } as React.CSSProperties} /></div>{onAction ? <button type="button" className="inf-detail-link-button" onClick={onAction}>{actionLabel} ›</button> : null}</section>;
}

export interface DocumentFile { id: string; name: string; size?: string; owner?: string; status?: DocumentStatus; confidence?: number; date?: string; type?: string; }
export interface DocumentGroupProps extends HTMLAttributes<HTMLElement> { title: string; files: DocumentFile[]; action?: ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; onOpenFile?: (file: DocumentFile) => void; onFileMenu?: (file: DocumentFile) => void; }

export function DocumentGroup({ title, files, action, open, defaultOpen = true, onOpenChange, onOpenFile, onFileMenu, className, ...props }: DocumentGroupProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const expanded = open ?? internalOpen;
  const contentId = React.useId();
  const toggle = () => { if (open === undefined) setInternalOpen(!expanded); onOpenChange?.(!expanded); };
  return <section className={cx("inf-detail-card", "inf-detail-document-group", className)} {...props}><header><button type="button" className="inf-detail-document-group__toggle" onClick={toggle} aria-expanded={expanded} aria-controls={contentId}><span>{title}</span><small>{files.length} files</small><span aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d={expanded ? "m4 6 4 4 4-4" : "m4 10 4-4 4 4"} /></svg></span></button>{action}</header>{expanded ? <div id={contentId}>{files.map((file) => <DocumentRow key={file.id} file={file} onOpen={onOpenFile} onMenu={onFileMenu} />)}</div> : null}</section>;
}

export interface DocumentRowProps extends HTMLAttributes<HTMLDivElement> { file: DocumentFile; onOpen?: (file: DocumentFile) => void; onMenu?: (file: DocumentFile) => void; }

export function DocumentRow({ file, onOpen, onMenu, className, ...props }: DocumentRowProps) {
  const confidence = file.confidence !== undefined && Number.isFinite(file.confidence) ? Math.min(100, Math.max(0, file.confidence)) : undefined;
  const confidenceBand = confidence === undefined ? undefined : confidence >= 80 ? "high" : confidence >= 50 ? "medium" : "low";
  const statusLabel = file.status ? file.status.replace("-", " ") : "";
  return <div className={cx("inf-detail-document-row", className)} {...props}><span className="inf-detail-file-icon" aria-hidden="true">{file.type ?? "PDF"}</span><div className="inf-detail-document-row__name"><strong>{onOpen ? <button type="button" onClick={() => onOpen(file)}>{file.name}</button> : file.name}</strong><small>{[file.size, file.owner].filter(Boolean).join(" · ")}</small></div>{file.status ? <span role="status" className={`inf-detail-doc-status inf-detail-doc-status--${file.status}`}>{statusLabel}</span> : null}{confidence !== undefined ? <span className={`inf-detail-confidence inf-detail-confidence--${confidenceBand}`} aria-label={`${confidence}% confidence`} title={`Extraction confidence: ${confidence}% (${confidenceBand})`}><span className="inf-detail-confidence__bars" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <i key={index} className={index < (confidence > 0 ? Math.max(1, Math.round(confidence / 20)) : 0) ? "is-filled" : undefined} />)}</span><span>{confidence}%</span></span> : null}{file.date ? <time dateTime={file.date}>{file.date}</time> : null}{onMenu ? <button className="inf-detail-more" type="button" aria-label={`More actions for ${file.name}`} title={`More actions for ${file.name}`} onClick={() => onMenu(file)}><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor"><circle cx="8" cy="3" r="1.2"/><circle cx="8" cy="8" r="1.2"/><circle cx="8" cy="13" r="1.2"/></svg></button> : null}</div>;
}

export interface FileUploadDropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, "onDrop"> { accept?: string; maxSizeMb?: number; disabled?: boolean; onFiles?: (files: File[]) => void; onReject?: (reason: string) => void; }

export function FileUploadDropzone({ accept = ".pdf,.dwg,.doc,.docx", maxSizeMb = 50, disabled = false, onFiles, onReject, className, ...props }: FileUploadDropzoneProps) {
  const inputId = React.useId();
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState("");
  const handleFiles = (fileList: FileList | null) => { const files = Array.from(fileList ?? []); if (!files.length || disabled) return; const allowed = accept.split(",").map((rule) => rule.trim().toLowerCase()).filter(Boolean); const rejected = files.find((file) => file.size > maxSizeMb * 1024 * 1024 || (allowed.length > 0 && !allowed.some((rule) => rule.startsWith(".") ? file.name.toLowerCase().endsWith(rule) : rule.endsWith("/*") ? file.type.startsWith(rule.slice(0, -1)) : file.type === rule))); if (rejected) { const reason = `${rejected.name} has an unsupported type or exceeds ${maxSizeMb} MB`; setError(reason); onReject?.(reason); return; } setError(""); onFiles?.(files); };
  return <div className={cx("inf-detail-dropzone", disabled && "inf-detail-dropzone--disabled", dragging && "inf-detail-dropzone--dragging", className)} onDragOver={(event) => { event.preventDefault(); if (!disabled) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); handleFiles(event.dataTransfer.files); }} {...props}><input id={inputId} type="file" aria-label="Browse files" accept={accept} multiple disabled={disabled} onChange={(event) => { handleFiles(event.target.files); event.target.value = ""; }} /><label htmlFor={inputId}><span className="inf-detail-dropzone__icon" aria-hidden="true">↥</span><strong>Drop files to check them</strong><small>{accept.replaceAll(",", ", ")} · up to {maxSizeMb} MB</small><span className="inf-detail-outline-button">Browse files</span></label>{error ? <p className="inf-detail-upload-error" role="alert">{error}</p> : null}</div>;
}

export interface DocumentIntelligencePanelProps extends HTMLAttributes<HTMLElement> { fieldsExtracted: number; mismatches: number; averageCheckTime?: string; title?: string; }

export function DocumentIntelligencePanel({ fieldsExtracted, mismatches, averageCheckTime = "—", title = "Document intelligence", className, ...props }: DocumentIntelligencePanelProps) {
  return <aside className={cx("inf-detail-card", "inf-detail-intelligence", className)} {...props}><header><span className="inf-detail-ai-status__icon" aria-hidden="true">✦</span><h3>{title}</h3></header><p>infission reads every upload, extracts the system values and compares them to the project record.</p><dl><div><dt>Fields extracted</dt><dd>{fieldsExtracted}</dd></div><div><dt>Mismatches found</dt><dd className={mismatches ? "inf-detail-number--warning" : ""}>{mismatches}</dd></div><div><dt>Average check time</dt><dd>{averageCheckTime}</dd></div></dl></aside>;
}

export interface ComplianceScoreCardProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> { score: number; passed?: number; minor?: number; critical?: number; title?: string; interactive?: boolean; onChange?: (score: number) => void; step?: number; }

export function ComplianceScoreCard({ score, passed = 0, minor = 0, critical = 0, title = "Compliance", interactive = false, onChange, step = 1, className, ...props }: ComplianceScoreCardProps) {
  const normalized = Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : null;
  const accessibleValue = normalized === null ? "No data" : `${normalized}%`;
  const gaugeRef = React.useRef<HTMLDivElement>(null);
  const updateFromPointer = (clientX: number) => {
    if (!interactive || !onChange || !gaugeRef.current) return;
    const rect = gaugeRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
    onChange(Math.max(0, Math.min(100, Number((Math.round((ratio * 100) / safeStep) * safeStep).toFixed(6)))));
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || !onChange) return;
    const current = normalized ?? 0;
    const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
    const next = event.key === "ArrowRight" || event.key === "ArrowUp" ? Math.min(100, current + safeStep) : event.key === "ArrowLeft" || event.key === "ArrowDown" ? Math.max(0, current - safeStep) : event.key === "Home" ? 0 : event.key === "End" ? 100 : null;
    if (next !== null) { event.preventDefault(); onChange(next); }
  };
  return <section className={cx("inf-detail-card", "inf-detail-compliance-score", className)} {...props}><h3>{title}</h3><div ref={gaugeRef} className={cx("inf-detail-score-gauge", interactive && "is-interactive")} role={interactive ? "slider" : "img"} aria-label={`${title}: ${accessibleValue}`} {...(interactive ? { tabIndex: 0, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": normalized ?? 0, "aria-valuetext": accessibleValue } : {})} onPointerDown={(event) => { if (interactive) { event.currentTarget.setPointerCapture(event.pointerId); updateFromPointer(event.clientX); } }} onPointerMove={(event) => { if (interactive && event.currentTarget.hasPointerCapture(event.pointerId)) updateFromPointer(event.clientX); }} onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }} onKeyDown={handleKeyDown}><svg viewBox="0 0 180 105" aria-hidden="true" focusable="false">{Array.from({ length: 51 }, (_, index) => { const angle = Math.PI + (index / 50) * Math.PI; const x1 = 90 + Math.cos(angle) * 65; const y1 = 90 + Math.sin(angle) * 65; const x2 = 90 + Math.cos(angle) * 79; const y2 = 90 + Math.sin(angle) * 79; return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} className={normalized !== null && index <= normalized / 2 ? "is-filled" : undefined} />; })}</svg><div><strong>{normalized === null ? "—" : `${normalized}%`}</strong><span>compliance</span></div></div><div className="inf-detail-score-summary"><span><strong>{passed}</strong>Passed</span><span><strong>{minor}</strong>Minor</span><span><strong>{critical}</strong>Critical</span></div></section>;
}

export type FindingSeverity = "pass" | "minor" | "critical";
export interface ComplianceFinding { id: string; label: string; severity: FindingSeverity; detail?: string; }
export interface ComplianceFindingsListProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> { findings: ComplianceFinding[]; selectedId?: string; onSelect?: (finding: ComplianceFinding) => void; title?: string; emptyMessage?: string; }

export function ComplianceFindingsList({ findings, selectedId, onSelect, title = "Findings", emptyMessage = "No findings.", className, ...props }: ComplianceFindingsListProps) {
  return <section className={cx("inf-detail-card", "inf-detail-findings", className)} {...props}><h3>{title}</h3>{findings.length ? <ul>{findings.map((finding) => <li key={finding.id} className={cx(selectedId === finding.id && "inf-detail-finding--selected")}><button type="button" onClick={() => onSelect?.(finding)}><span className={`inf-detail-finding-icon inf-detail-finding-icon--${finding.severity}`} aria-hidden="true">{finding.severity === "pass" ? "✓" : finding.severity === "minor" ? "!" : "×"}</span><span><strong>{finding.label}</strong>{finding.detail ? <small>{finding.detail}</small> : null}</span><span className={`inf-detail-finding-label inf-detail-finding-label--${finding.severity}`}>{finding.severity}</span></button></li>)}</ul> : <p className="inf-detail-muted">{emptyMessage}</p>}</section>;
}

export interface FindingDetailPanelProps extends HTMLAttributes<HTMLElement> { finding: ComplianceFinding; description: string; preview?: ReactNode; reference?: string; }

export function FindingDetailPanel({ finding, description, preview, reference, className, ...props }: FindingDetailPanelProps) {
  return <section className={cx("inf-detail-card", "inf-detail-finding-detail", className)} {...props}><header><span className={`inf-detail-finding-label inf-detail-finding-label--${finding.severity}`}>{finding.severity}</span><span>Finding</span></header><h3>{finding.label}</h3><p>{description}</p>{preview ? <div className="inf-detail-finding-detail__preview">{preview}</div> : null}{reference ? <small className="inf-detail-muted">{reference}</small> : null}</section>;
}

export interface RequirementSource { id: string; title: string; description?: string; href?: string; }
export interface RequirementSourcesPanelProps extends HTMLAttributes<HTMLElement> { explanation: string; sources: RequirementSource[]; title?: string; }

export function RequirementSourcesPanel({ explanation, sources, title = "Requirement sources", className, ...props }: RequirementSourcesPanelProps) {
  return <aside className={cx("inf-detail-card", "inf-detail-sources", className)} {...props}><h3>{title}</h3><p>{explanation}</p><ul>{sources.map((source) => <li key={source.id}>{source.href ? <a href={source.href}>{source.title} ↗</a> : <strong>{source.title}</strong>}{source.description ? <small>{source.description}</small> : null}</li>)}</ul></aside>;
}

export interface RecommendedActionCardProps extends HTMLAttributes<HTMLElement> { title: string; description?: string; actionLabel?: string; onAction?: () => void; children?: ReactNode; }

export function RecommendedActionCard({ title, description, actionLabel = "Apply recommendation", onAction, children, className, ...props }: RecommendedActionCardProps) {
  return <section className={cx("inf-detail-card", "inf-detail-recommended", className)} {...props}><span className="inf-detail-recommended__icon" aria-hidden="true">✦</span><div><span className="inf-detail-eyebrow">Recommended action</span><h3>{title}</h3>{description ? <p>{description}</p> : null}{children}</div>{onAction ? <button className="inf-detail-outline-button" type="button" onClick={onAction}>{actionLabel}</button> : null}</section>;
}

export interface AIFixDiffLine { label: string; before: string; after: string; }
export interface AIFixDiffPanelProps extends HTMLAttributes<HTMLElement> { lines: AIFixDiffLine[]; beforeLabel?: string; afterLabel?: string; title?: string; }

export function AIFixDiffPanel({ lines, beforeLabel = "Current", afterLabel = "After the fix", title = "AI fix", className, ...props }: AIFixDiffPanelProps) {
  return <section className={cx("inf-detail-card", "inf-detail-diff", className)} {...props}><header><span className="inf-detail-ai-status__icon" aria-hidden="true">✦</span><h3>{title}</h3></header><div className="inf-detail-diff__labels"><span>{beforeLabel}</span><span aria-hidden="true">→</span><span>{afterLabel}</span></div>{lines.map((line) => <div className="inf-detail-diff__row" key={line.label}><small>{line.label}</small><code>{line.before}</code><span aria-hidden="true">→</span><code className="inf-detail-diff__after">{line.after}</code></div>)}</section>;
}

export interface ReviewActionBarProps extends HTMLAttributes<HTMLElement> { onOpenViewer?: () => void; onSendToDesigner?: () => void; onFixWithAI?: () => void; }

export function ReviewActionBar({ onOpenViewer, onSendToDesigner, onFixWithAI, children, className, ...props }: ReviewActionBarProps) {
  return <footer className={cx("inf-detail-action-bar", className)} {...props}>{children ?? <><button type="button" className="inf-detail-outline-button" onClick={onOpenViewer}>Open in viewer ↗</button><button type="button" className="inf-detail-outline-button" onClick={onSendToDesigner}>Send to designer</button><button type="button" className="inf-detail-primary-button" onClick={onFixWithAI}>Fix with AI</button></>}</footer>;
}

export type ReviewStatus = "verified" | "needs-review" | "pass" | "minor" | "critical" | "fixed" | "submitted" | "complete";
export interface ReviewStatusPill { label: string; status: ReviewStatus; }
export interface ReviewStatusPillsProps extends HTMLAttributes<HTMLDivElement> { statuses: ReviewStatusPill[]; }

export function ReviewStatusPills({ statuses, className, ...props }: ReviewStatusPillsProps) {
  return <div className={cx("inf-detail-review-statuses", className)} aria-label="Review statuses" {...props}>{statuses.map((status, index) => <span key={`${status.label}-${index}`} className={`inf-detail-review-pill inf-detail-review-pill--${status.status}`}><span aria-hidden="true">●</span>{status.label}</span>)}</div>;
}
