import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

import { Badge, type BadgeTone } from "../badge";
import { Button, type ButtonProps } from "../button";

export type Icon = ReactNode;

export interface BrandLogoProps {
  name?: string;
  compact?: boolean;
  href?: string;
  icon?: ReactNode;
  className?: string;
}

export function BrandLogo({ name = "infission", compact = false, href, icon, className = "" }: BrandLogoProps) {
  const content = (
    <span className={`inf-global-logo ${compact ? "inf-global-logo--compact" : ""} ${className}`.trim()}>
      <span className="inf-global-logo__mark" aria-hidden="true">{icon ?? "••"}</span>
      {!compact && <span className="inf-global-logo__name">{name}</span>}
    </span>
  );
  return href ? <a className="inf-global-logo-link" href={href} aria-label={name}>{content}</a> : content;
}

export interface WorkspaceOption { id: string; name: string; location?: string; icon?: ReactNode }
export interface WorkspaceSwitcherProps {
  workspace: WorkspaceOption;
  options?: WorkspaceOption[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onChange?: (workspace: WorkspaceOption) => void;
  disabled?: boolean;
  menuLabel?: string;
  className?: string;
}

export function WorkspaceSwitcher({ workspace, options = [], open, defaultOpen = false, onOpenChange, onChange, disabled = false, menuLabel = "Choose workspace", className = "" }: WorkspaceSwitcherProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const triggerId = useId();
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const expanded = open ?? internalOpen;
  const setExpanded = (next: boolean) => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };
  useEffect(() => {
    if (!expanded) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !triggerRef.current?.parentElement?.contains(target)) setExpanded(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setExpanded(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [expanded]);
  const choose = (option: WorkspaceOption) => { setExpanded(false); onChange?.(option); };
  return (
    <div className={`inf-global-workspace ${expanded ? "is-open" : ""} ${className}`.trim()}>
      <button ref={triggerRef} id={triggerId} type="button" className="inf-global-workspace__trigger" disabled={disabled} aria-expanded={expanded} aria-haspopup="menu" aria-controls={menuId} onClick={() => setExpanded(!expanded)}>
        <span className="inf-global-workspace__icon" aria-hidden="true">{workspace.icon ?? "◉"}</span>
        <span><strong>{workspace.name}</strong>{workspace.location && <small>{workspace.location}</small>}</span>
        <span className="inf-global-workspace__chevron" aria-hidden="true">⌄</span>
      </button>
      {expanded && options.length > 0 && (
        <div id={menuId} className="inf-global-workspace__menu" role="menu" aria-label={menuLabel} aria-labelledby={triggerId}>
          {options.map((option) => <button type="button" role="menuitem" key={option.id} className="inf-global-workspace__option" onClick={() => choose(option)}>{option.name}{option.location && <small>{option.location}</small>}</button>)}
        </div>
      )}
    </div>
  );
}

export interface NavGroupProps { label?: string; children: ReactNode; className?: string }
export function NavGroup({ label, children, className = "" }: NavGroupProps) {
  return <section className={`inf-global-nav-group ${className}`.trim()} aria-label={label}>{label && <h2>{label}</h2>}{children}</section>;
}

export interface NavItemProps {
  label: string;
  icon?: ReactNode;
  active?: boolean;
  count?: number | string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}
export function NavItem({ label, icon, active = false, count, href, onClick, disabled = false, className = "" }: NavItemProps) {
  const props = { className: `inf-global-nav-item ${active ? "is-active" : ""} ${className}`.trim(), "aria-current": active ? "page" as const : undefined, onClick, "aria-disabled": disabled || undefined };
  const content = <><span className="inf-global-nav-item__icon" aria-hidden="true">{icon ?? "•"}</span><span>{label}</span>{count !== undefined && <span className="inf-global-nav-item__count">{count}</span>}</>;
  return href ? <a {...props} href={disabled ? undefined : href}>{content}</a> : <button {...props} type="button" disabled={disabled}>{content}</button>;
}

export interface AppShellNavItem extends NavItemProps { id: string }
export interface AppShellNavGroup { id: string; label?: string; items: AppShellNavItem[] }
export interface AppShellProps {
  brand?: BrandLogoProps;
  workspace: WorkspaceOption;
  workspaceOptions?: WorkspaceOption[];
  onWorkspaceChange?: (workspace: WorkspaceOption) => void;
  navGroups: AppShellNavGroup[];
  activeItem?: string;
  onNavigate?: (item: AppShellNavItem) => void;
  aiWidget?: SidebarAIWidgetProps;
  user?: UserProfileCardProps;
  sidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

/** Composes the reference sidebar primitives into an application shell without owning routing or business state. */
export function AppShell({ brand, workspace, workspaceOptions, onWorkspaceChange, navGroups, activeItem, onNavigate, aiWidget, user, sidebarOpen, defaultSidebarOpen = true, onSidebarOpenChange, children, className = "" }: AppShellProps) {
  const [internalOpen, setInternalOpen] = useState(defaultSidebarOpen);
  const open = sidebarOpen ?? internalOpen;
  const setOpen = (next: boolean) => {
    if (sidebarOpen === undefined) setInternalOpen(next);
    onSidebarOpenChange?.(next);
  };
  return <div className={`inf-global-app-shell ${open ? "is-open" : "is-collapsed"} ${className}`.trim()}>
    <aside className="inf-global-app-shell__sidebar" aria-label="Application sidebar">
      <header className="inf-global-app-shell__brand"><BrandLogo {...brand} compact={!open || brand?.compact} /><button type="button" className="inf-global-app-shell__collapse" aria-label={open ? "Collapse sidebar" : "Expand sidebar"} aria-pressed={!open} onClick={() => setOpen(!open)}><svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" aria-hidden="true"><path d={open ? "m12.5 5-5 5 5 5" : "m7.5 5 5 5-5 5"} /></svg></button></header>
      {open && <>
        <WorkspaceSwitcher workspace={workspace} options={workspaceOptions} onChange={onWorkspaceChange} />
        <nav className="inf-global-app-shell__nav" aria-label="Application navigation">
          {navGroups.map((group) => <NavGroup key={group.id} label={group.label}>{group.items.map((item) => <NavItem key={item.id} {...item} active={activeItem === item.id || item.active} onClick={() => { item.onClick?.(); onNavigate?.(item); }} />)}</NavGroup>)}
        </nav>
        {aiWidget && <SidebarAIWidget {...aiWidget} />}
        {user && <UserProfileCard {...user} />}
      </>}
    </aside>
    <main className="inf-global-app-shell__main">{children}</main>
  </div>;
}

export interface SidebarAIWidgetProps {
  title?: string;
  message?: string;
  count?: number;
  actionLabel?: string;
  onAction?: () => void;
  enabled?: boolean;
  defaultEnabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  disabled?: boolean;
  switchLabel?: string;
  className?: string;
}
export function SidebarAIWidget({ title = "infission AI", message = "Review project risks before they slip.", count = 0, actionLabel = "Review risks", onAction, enabled, defaultEnabled = true, onEnabledChange, disabled = false, switchLabel = "Enable infission AI", className = "" }: SidebarAIWidgetProps) {
  const [internalEnabled, setInternalEnabled] = useState(defaultEnabled);
  const current = enabled ?? internalEnabled;
  const toggle = () => {
    if (disabled) return;
    if (enabled === undefined) setInternalEnabled(!current);
    onEnabledChange?.(!current);
  };
  return <aside className={`inf-global-ai-widget ${className}`.trim()}>
    <div className="inf-global-ai-widget__heading">
      <span className="inf-global-ai-widget__spark" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" /></svg></span>
      <strong>{title}</strong>
      <button type="button" role="switch" aria-label={switchLabel} aria-checked={current} disabled={disabled} className={`inf-global-switch ${current ? "is-on" : ""}`} onClick={toggle}><span /></button>
    </div>
    <p>{message}</p>
    {count > 0 && <strong className="inf-global-ai-widget__count">{count} need attention</strong>}
    <Button variant="dark" size="sm" onClick={onAction} disabled={disabled || !current || !onAction}>{actionLabel}</Button>
  </aside>;
}

export interface UserProfileAction { id: string; label: string; onSelect?: () => void; disabled?: boolean }
export interface UserProfileCardProps { name: string; role?: string; avatarUrl?: string; initials?: string; onClick?: () => void; moreActions?: UserProfileAction[]; onMoreClick?: () => void; moreLabel?: string; className?: string }
export function UserProfileCard({ name, role, avatarUrl, initials, onClick, moreActions = [], onMoreClick, moreLabel = `More actions for ${name}`, className = "" }: UserProfileCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !menuRef.current?.contains(target)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [menuOpen]);
  const chooseAction = (action: UserProfileAction) => {
    setMenuOpen(false);
    action.onSelect?.();
  };
  return <div className={`inf-global-user-shell ${className}`.trim()}>
    <button type="button" className="inf-global-user" aria-label={name} onClick={onClick}>
      <span className="inf-global-user__avatar">{avatarUrl ? <img src={avatarUrl} alt="" /> : initials ?? name.slice(0, 2).toUpperCase()}</span>
      <span><strong>{name}</strong>{role && <small>{role}</small>}</span>
    </button>
    <div className="inf-global-user-menu" ref={menuRef}>
      <button type="button" className="inf-global-user__more" aria-label={moreLabel} aria-expanded={menuOpen} aria-haspopup="menu" aria-controls={menuId} onClick={(event) => { event.stopPropagation(); onMoreClick?.(); if (moreActions.length) setMenuOpen((value) => !value); }}>
        <span aria-hidden="true">•••</span>
      </button>
      {menuOpen && moreActions.length > 0 && <div id={menuId} className="inf-global-user-menu__list" role="menu" aria-label={moreLabel}>
        {moreActions.map((action) => <button type="button" role="menuitem" key={action.id} disabled={action.disabled} onClick={() => chooseAction(action)}>{action.label}</button>)}
      </div>}
    </div>
  </div>;
}

export interface SearchFieldProps { value?: string; defaultValue?: string; placeholder?: string; shortcut?: string; onChange?: (value: string) => void; onSubmit?: (value: string) => void; disabled?: boolean; className?: string }
export function SearchField({ value, defaultValue = "", placeholder = "Search projects", shortcut, onChange, onSubmit, disabled = false, className = "" }: SearchFieldProps) {
  const [internal, setInternal] = useState(defaultValue); const current = value ?? internal;
  const update = (event: ChangeEvent<HTMLInputElement>) => { if (value === undefined) setInternal(event.target.value); onChange?.(event.target.value); };
  const submit = (event: FormEvent) => { event.preventDefault(); if (!disabled) onSubmit?.(current); };
  const shortcutLabel = shortcut ? `Submit search, ${shortcut}` : "Submit search";
  const showShortcutText = Boolean(shortcut && shortcut !== "⌘K");
  return <form className={`inf-global-search ${className}`.trim()} onSubmit={submit}><span className="inf-global-search__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></svg></span><input value={current} onChange={update} placeholder={placeholder} disabled={disabled} aria-label={placeholder} /><button type="submit" className="inf-global-search__submit" aria-label={shortcutLabel} disabled={disabled}>{showShortcutText ? shortcut : <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></svg>}</button></form>;
}

export interface NotificationButtonProps { unreadCount?: number; label?: string; onClick?: () => void; className?: string }
export function NotificationButton({ unreadCount = 0, label = "Notifications", onClick, className = "" }: NotificationButtonProps) {
  return <button type="button" className={`inf-global-notification ${className}`.trim()} aria-label={label} onClick={onClick}><span aria-hidden="true">♧</span>{unreadCount > 0 && <span className="inf-global-notification__dot">{unreadCount > 9 ? "9+" : unreadCount}</span>}</button>;
}

export interface ActionButtonProps extends Omit<ButtonProps, "variant"> { children: ReactNode }
export function DarkActionButton(props: ActionButtonProps) { return <Button {...props} variant="dark" />; }
export function OutlineActionButton(props: ActionButtonProps) { return <Button {...props} variant="outline" />; }

export type StatusBadgeStatus = "on-track" | "under-review" | "delayed" | "missing-docs" | "interconnection" | "inspection" | "approved" | "complete";
export interface StatusBadgeProps { status: StatusBadgeStatus; label?: string; size?: "sm" | "md"; className?: string }
const statusLabels: Record<StatusBadgeStatus, string> = { "on-track": "On track", "under-review": "Under review", delayed: "Delayed", "missing-docs": "Missing docs", interconnection: "Interconnection", inspection: "Inspection", approved: "Approved", complete: "Complete" };
const statusTones: Record<StatusBadgeStatus, BadgeTone> = { "on-track": "success", "under-review": "warning", delayed: "danger", "missing-docs": "danger", interconnection: "brand", inspection: "success", approved: "success", complete: "success" };
export function StatusBadge({ status, label, size = "sm", className = "" }: StatusBadgeProps) { return <Badge tone={statusTones[status]} size={size} className={`inf-global-status-badge inf-global-status-badge--${status} ${className}`.trim()} dot>{label ?? statusLabels[status]}</Badge>; }

export interface FilterChipProps { label: string; selected?: boolean; count?: number; onClick?: () => void; removable?: boolean; onRemove?: () => void; className?: string }
export function FilterChip({ label, selected = false, count, onClick, removable = false, onRemove, className = "" }: FilterChipProps) {
  return <span className={`inf-global-filter-chip ${selected ? "is-selected" : ""} ${className}`.trim()}><button type="button" onClick={onClick} aria-label={count !== undefined ? `${label}, ${count}` : label} aria-pressed={selected}>{label}{count !== undefined && <span>{count}</span>}</button>{removable && <button type="button" className="inf-global-filter-chip__remove" aria-label={`Remove ${label}`} onClick={onRemove}><svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="m2 2 8 8M10 2l-8 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /></svg></button>}</span>;
}

export interface TimeRangeOption { value: string; label: string }
export interface TimeRangeControlProps { options?: TimeRangeOption[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; className?: string }
export function TimeRangeControl({ options = [{ value: "today", label: "Today" }, { value: "7-days", label: "7 days" }, { value: "30-days", label: "30 days" }], value, defaultValue, onChange, className = "" }: TimeRangeControlProps) {
  const [internal, setInternal] = useState(defaultValue ?? options[1]?.value ?? ""); const selected = value ?? internal;
  const select = (next: string) => { if (value === undefined) setInternal(next); onChange?.(next); };
  return <div className={`inf-global-time-range ${className}`.trim()} role="group" aria-label="Time range">{options.map((option) => <button type="button" key={option.value} className={selected === option.value ? "is-selected" : ""} aria-pressed={selected === option.value} onClick={() => select(option.value)}>{option.label}</button>)}</div>;
}

export interface ProjectHeroData { id: string; title: string; address?: string; jurisdiction?: string; imageSrc?: string; status?: StatusBadgeStatus; progress?: number; meta?: Array<{ label: string; value: string }>; }
export interface ProjectHeroCardProps { project: ProjectHeroData; onOpen?: (project: ProjectHeroData) => void; className?: string }
export function ProjectHeroCard({ project, onOpen, className = "" }: ProjectHeroCardProps) {
  return <article className={`inf-global-project-hero ${className}`.trim()}><div className="inf-global-project-hero__media">{project.imageSrc ? <img src={project.imageSrc} alt="" /> : <span aria-hidden="true">⌂</span>}<span className="inf-global-project-hero__id">{project.id}</span>{project.status && <StatusBadge status={project.status} />}</div><div className="inf-global-project-hero__body"><h3>{project.title}</h3>{project.address && <p>{project.address}{project.jurisdiction ? ` · ${project.jurisdiction}` : ""}</p>}<div className="inf-global-progress-label"><span>Permit progress</span><strong>{project.progress ?? 0}%</strong></div><LinearProgress value={project.progress ?? 0} /><div className="inf-global-project-hero__meta">{project.meta?.map((item) => <span key={item.label}><small>{item.label}</small><strong>{item.value}</strong></span>)}<button type="button" aria-label={`Open ${project.title}`} onClick={() => onOpen?.(project)}><svg className="inf-global-inline-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg></button></div></div></article>;
}

export interface PortfolioStat { label: string; value: string | number; detail?: string; tone?: "default" | "dark" | "brand" }
export interface PortfolioStatsProps { stats: PortfolioStat[]; className?: string }
export function PortfolioStats({ stats, className = "" }: PortfolioStatsProps) { return <div className={`inf-global-portfolio-stats ${className}`.trim()}>{stats.map((stat) => <article key={stat.label} className={`inf-global-stat inf-global-stat--${stat.tone ?? "default"}`}><small>{stat.label}</small><strong>{stat.value}</strong>{stat.detail && <span>{stat.detail}</span>}</article>)}</div>; }

export interface PipelineStage { label: string; count: number; color?: string }
export interface ProjectPipelineProps { stages: PipelineStage[]; averageLabel?: string; actionLabel?: string; onAction?: () => void; className?: string }
export function ProjectPipeline({ stages, averageLabel = "Average approval 8.4 days", actionLabel = "Open", onAction, className = "" }: ProjectPipelineProps) { const total = stages.reduce((sum, stage) => sum + stage.count, 0) || 1; return <section className={`inf-global-pipeline ${className}`.trim()}><header><strong>Project pipeline</strong><span>{averageLabel}</span><button type="button" onClick={onAction}>{actionLabel} <svg className="inf-global-inline-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg></button></header><div className="inf-global-pipeline__bars">{stages.map((stage) => <div key={stage.label} style={{ "--inf-stage-size": `${Math.max(4, (stage.count / total) * 100)}%`, "--inf-stage-color": stage.color ?? "var(--inf-color-brand)" } as React.CSSProperties}><span>{stage.count}</span></div>)}</div><div className="inf-global-pipeline__legend">{stages.map((stage) => <span key={stage.label}><i style={{ background: stage.color ?? "var(--inf-color-brand)" }} />{stage.label}</span>)}</div></section>; }

export interface AttentionRow { id: string; project: string; address?: string; stage: string; blocker: string; risk?: "high" | "medium" | "low"; due?: string }
export interface AttentionTableProps { rows: AttentionRow[]; onRowClick?: (row: AttentionRow) => void; className?: string }
export function AttentionTable({ rows, onRowClick, className = "" }: AttentionTableProps) {
  const headingId = useId();
  return <section className={`inf-global-attention ${className}`.trim()} aria-labelledby={headingId}>
    <h3 id={headingId}>Needs attention</h3>
    <div className="inf-global-attention__header" role="row" aria-hidden="true"><span>Project</span><span>Address</span><span>Stage</span><span>Blocker</span><span>Risk</span><span>Due</span></div>
    {rows.length === 0 ? <p className="inf-global-attention__empty" role="status">No projects need attention.</p> : rows.map((row) => <button type="button" className="inf-global-attention__row" key={row.id} onClick={() => onRowClick?.(row)} aria-label={`Open ${row.project}, ${row.blocker}`}><strong data-label="Project">{row.project}<small>{row.id}</small></strong><span data-label="Address">{row.address ?? "—"}</span><span data-label="Stage">{row.stage}</span><span data-label="Blocker">{row.blocker}</span><span data-label="Risk"><RiskBadge level={row.risk ?? "medium"} /></span><span data-label="Due">{row.due ?? "—"}</span></button>)}
  </section>;
}

export interface AIRiskCardProps { projectsAtRisk: number; risks: string[]; title?: string; actionLabel?: string; onAction?: () => void; className?: string }
export function AIRiskCard({ projectsAtRisk, risks, title = "infission AI", actionLabel = "Review risks", onAction, className = "" }: AIRiskCardProps) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const detailsId = useId();
  const handleAction = () => { setReviewOpen((open) => !open); onAction?.(); };
  return <aside className={`inf-global-risk-card ${className}`.trim()}>
    <header><span className="inf-global-ai-widget__spark" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z" /></svg></span><strong>{title}</strong><small>6 min ago</small></header>
    <h3>{projectsAtRisk} projects at risk of slipping</h3>
    {!reviewOpen && <ul>{risks.slice(0, 3).map((risk) => <li key={risk}>{risk}</li>)}</ul>}
    {reviewOpen && <div id={detailsId} className="inf-global-risk-card__details" role="region" aria-label="Risk details"><strong>Risk details</strong><ul>{risks.length ? risks.map((risk) => <li key={risk}>{risk}</li>) : <li>No current risk details.</li>}</ul></div>}
    <Button variant="brand" size="sm" onClick={handleAction} aria-expanded={reviewOpen} aria-controls={detailsId}>{reviewOpen ? "Hide risks" : actionLabel}</Button>
    <p className="inf-global-risk-card__status" role="status" aria-live="polite">{reviewOpen ? `Showing ${risks.length} risk detail${risks.length === 1 ? "" : "s"}.` : ""}</p>
  </aside>;
}

export interface PackageComplianceCardProps { score: number; project?: string; checked: number; flagged: number; rejected: number; actionLabel?: string; onAction?: () => void; className?: string }
export function PackageComplianceCard({ score, project, checked, flagged, rejected, actionLabel = "Ready to submit", onAction, className = "" }: PackageComplianceCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const detailsId = useId();
  const activate = () => { setDetailsOpen((open) => !open); onAction?.(); };
  const safeScore = Math.round(Math.max(0, Math.min(100, score)));
  return <article className={`inf-global-compliance-card ${className}`.trim()}>
    <header><strong>Package compliance</strong><button type="button" aria-label="Open package compliance" aria-expanded={detailsOpen} aria-controls={detailsId} onClick={activate}><svg className="inf-global-inline-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg></button></header>
    <div className="inf-global-compliance-card__score" aria-label={`${safeScore}% compliance`}><strong>{safeScore}<small>%</small></strong><span>ready to submit</span></div>
    {project && <p>{project}</p>}
    <div className="inf-global-compliance-card__metrics"><span><strong>{checked.toLocaleString()}</strong>Checked</span><span><strong>{flagged}</strong>Flagged</span><span><strong>{rejected}%</strong>Rejected</span></div>
    {detailsOpen && <div id={detailsId} className="inf-global-compliance-card__details" role="region" aria-label="Package compliance details"><strong>Package details</strong><p>{safeScore >= 90 ? "The package is ready for the next review step." : "Resolve flagged items before submitting the package."}</p></div>}
    <button type="button" className="inf-global-compliance-card__action" aria-expanded={detailsOpen} aria-controls={detailsId} onClick={activate}>{detailsOpen ? "Hide details" : actionLabel} <svg className="inf-global-inline-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg></button>
    <p className="inf-global-compliance-card__status" role="status" aria-live="polite">{detailsOpen ? "Package compliance details opened." : ""}</p>
  </article>;
}

export interface StatusFilterOption { value: string; label: string; count?: number }
export interface ProjectStatusFiltersProps { options: StatusFilterOption[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; className?: string }
export function ProjectStatusFilters({ options, value, defaultValue, onChange, className = "" }: ProjectStatusFiltersProps) { const [internal, setInternal] = useState(defaultValue ?? options[0]?.value ?? ""); const selected = value ?? internal; const choose = (next: string) => { if (value === undefined) setInternal(next); onChange?.(next); }; return <div className={`inf-global-status-filters ${className}`.trim()} role="tablist" aria-label="Project status">{options.map((option) => <button type="button" role="tab" aria-selected={selected === option.value} className={selected === option.value ? "is-selected" : ""} key={option.value} onClick={() => choose(option.value)}>{option.label}{option.count !== undefined && <span>{option.count}</span>}</button>)}</div>; }

export interface SelectFilterOption { value: string; label: string }
export interface SelectFilterProps {
  label?: string;
  options: SelectFilterOption[];
  icon?: ReactNode;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  clearable?: boolean;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
}
function SelectFilter({ label, options, icon, value, defaultValue, placeholder = "Select", onChange, onClear, clearable = true, disabled = false, required = false, name, id, className = "" }: SelectFilterProps) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const selected = value ?? internal;
  const selectId = id ?? useId();
  const change = (event: ChangeEvent<HTMLSelectElement>) => {
    if (disabled) return;
    const next = event.target.value;
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };
  const clear = () => {
    if (disabled) return;
    if (value === undefined) setInternal("");
    onChange?.("");
    onClear?.();
  };
  return <label className={`inf-global-select-filter ${className}`.trim()} htmlFor={selectId}>
    {label && <span>{label}</span>}
    <span className={`inf-global-select-filter__control ${icon ? "has-icon" : ""} ${clearable && selected ? "has-clear" : ""}`.trim()}>
      {icon && <span className="inf-global-select-filter__icon" aria-hidden="true">{icon}</span>}
      <select id={selectId} name={name} value={selected} onChange={change} aria-label={label ?? placeholder} disabled={disabled} required={required}>
        <option value="">{placeholder}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      {clearable && selected && <button type="button" className="inf-global-select-filter__clear" aria-label={`Clear ${label ?? placeholder}`} onClick={clear} disabled={disabled}><svg aria-hidden="true" viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m4 4 8 8M12 4l-8 8" /></svg></button>}
      <span className="inf-global-select-filter__chevron" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m3.5 6 4.5 4 4.5-4" /></svg></span>
    </span>
  </label>;
}
const BuildingIcon = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 14V3.5L8 2v12M8 5h5v9M5 5.5h1M5 8h1M5 10.5h1M10 7h1M10 9.5h1M10 12h1M1.5 14h13" /></svg>;
const ProjectTypeIcon = () => <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="m2 7 6-4 6 4v6.5H2zM5 13.5V9h6v4.5M4.5 6.5h.01M8 6.5h.01M11.5 6.5h.01" /></svg>;
export function JurisdictionFilter(props: SelectFilterProps) { return <SelectFilter {...props} icon={props.icon ?? <BuildingIcon />} label={props.label ?? "Jurisdiction"} placeholder={props.placeholder ?? "All jurisdictions"} />; }
export function ProjectTypeFilter(props: SelectFilterProps) { return <SelectFilter {...props} icon={props.icon ?? <ProjectTypeIcon />} label={props.label ?? "Project type"} placeholder={props.placeholder ?? "Standard"} />; }

export interface ViewToggleProps { value?: "grid" | "list"; defaultValue?: "grid" | "list"; onChange?: (value: "grid" | "list") => void; disabled?: boolean; className?: string }
export function ViewToggle({ value, defaultValue = "grid", onChange, disabled = false, className = "" }: ViewToggleProps) {
  const [internal, setInternal] = useState(defaultValue);
  const selected = value ?? internal;
  const choose = (next: "grid" | "list") => { if (disabled) return; if (value === undefined) setInternal(next); onChange?.(next); };
  return <div className={`inf-global-view-toggle ${className}`.trim()} role="group" aria-label="View mode">
    {(["list", "grid"] as const).map((mode) => <button type="button" key={mode} className={selected === mode ? "is-selected" : ""} aria-pressed={selected === mode} aria-label={`${mode} view`} disabled={disabled} onClick={() => choose(mode)}>
      {mode === "grid" ? <svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15" fill="currentColor"><path d="M1.5 1.5h5v5h-5zm8 0h5v5h-5zm-8 8h5v5h-5zm8 0h5v5h-5z" /></svg> : <svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3.25h12M2 8h12M2 12.75h12" /></svg>}
    </button>)}
  </div>;
}

export type ProjectCardStatus = Extract<StatusBadgeStatus, "under-review" | "delayed" | "missing-docs" | "interconnection" | "inspection">;
export interface ProjectCardData { id: string; title: string; address?: string; jurisdiction?: string; imageSrc?: string; status: ProjectCardStatus; progress: number; system?: string; battery?: string; owner?: string; due?: string; }
export interface ProjectCardProps { project: ProjectCardData; onOpen?: (project: ProjectCardData) => void; className?: string }
export function ProjectCard({ project, onOpen, className = "" }: ProjectCardProps) { return <article className={`inf-global-project-card inf-global-project-card--${project.status} ${className}`.trim()}><div className="inf-global-project-card__media">{project.imageSrc ? <img src={project.imageSrc} alt="" /> : <span aria-hidden="true">⌂</span>}<span className="inf-global-project-card__id">{project.id}</span><StatusBadge status={project.status} /></div><div className="inf-global-project-card__body"><h3>{project.title}</h3><p>{project.address ?? ""}{project.jurisdiction ? ` · ${project.jurisdiction}` : ""}</p><div className="inf-global-project-card__metrics"><span><small>System</small><strong>{project.system ?? "—"}</strong></span><span><small>Battery</small><strong>{project.battery ?? "None"}</strong></span></div><div className="inf-global-progress-label"><span>Permit progress</span><strong>{Math.round(project.progress)}%</strong></div><LinearProgress value={project.progress} /><footer><span className="inf-global-avatar">{project.owner?.slice(0, 2).toUpperCase() ?? "—"}</span><span>{project.owner ?? "Unassigned"}</span><time>{project.due ?? ""}</time><button type="button" onClick={() => onOpen?.(project)} aria-label={`Open ${project.title}`}><svg className="inf-global-inline-icon" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg></button></footer></div></article>; }

export interface StatusPill { value: string; label: string; tone?: BadgeTone; }
export interface StatusPillSetProps { items: StatusPill[]; value?: string; defaultValue?: string; onChange?: (value: string) => void; ariaLabel?: string; className?: string }
export function StatusPillSet({ items, value, defaultValue, onChange, ariaLabel = "Status", className = "" }: StatusPillSetProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const selected = value ?? internalValue;
  const choose = (next: string) => { if (value === undefined) setInternalValue(next); onChange?.(next); };
  return <div className={`inf-global-status-pill-set ${className}`.trim()} role="group" aria-label={ariaLabel}>{items.map((item) => <button type="button" key={item.value} className={selected === item.value ? "is-selected" : ""} aria-pressed={selected === item.value} onClick={() => choose(item.value)}><Badge tone={item.tone ?? "neutral"} size="sm" dot>{item.label}</Badge></button>)}</div>;
}

export interface RiskBadgeProps { level: "high" | "medium" | "low"; label?: string; className?: string }
export function RiskBadge({ level, label, className = "" }: RiskBadgeProps) { const labels = { high: "High", medium: "Medium", low: "Low" }; return <Badge className={`inf-global-risk-badge inf-global-risk-badge--${level} ${className}`.trim()} tone={level === "high" ? "danger" : level === "medium" ? "warning" : "success"} size="sm" dot>{label ?? labels[level]}</Badge>; }

export interface LinearProgressProps { value: number; max?: number; label?: string; showValue?: boolean; className?: string }
export function LinearProgress({ value, max = 100, label, showValue = false, className = "" }: LinearProgressProps) {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100;
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(safeMax, value)) : 0;
  const percent = Math.round((safeValue / safeMax) * 100);
  return <div className={`inf-global-linear-progress ${className}`.trim()} aria-label={label ?? "Progress"} role="progressbar" aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={safeValue} aria-valuetext={`${percent}%`}><span style={{ "--inf-progress-ratio": safeValue / safeMax } as React.CSSProperties} />{showValue && <strong aria-hidden="true">{percent}%</strong>}</div>;
}

export interface IconButtonMenuItem { id: string; label: string; onSelect?: () => void; disabled?: boolean }
export interface IconButtonItem { id: string; label: string; icon?: ReactNode; disabled?: boolean; onClick?: () => void; menuItems?: IconButtonMenuItem[]; menuLabel?: string }
export interface IconButtonSetProps { items: IconButtonItem[]; ariaLabel?: string; className?: string }
export function IconButtonSet({ items, ariaLabel = "Actions", className = "" }: IconButtonSetProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const groupId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  useEffect(() => {
    if (!openId) return;
    const onPointerDown = (event: PointerEvent) => { const target = event.target; if (target instanceof Node && !rootRef.current?.contains(target)) setOpenId(null); };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); const trigger = triggerRefs.current[openId]; setOpenId(null); trigger?.focus(); }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [openId]);
  const chooseMenuItem = (item: IconButtonMenuItem) => { setOpenId(null); item.onSelect?.(); };
  return <div ref={rootRef} className={`inf-global-icon-button-set ${className}`.trim()} role="group" aria-label={ariaLabel}>{items.map((item, index) => {
    const hasMenu = Boolean(item.menuItems?.length);
    const menuId = `${groupId}-menu-${index}`;
    const expanded = openId === item.id;
    return <span className="inf-global-icon-button-set__item" key={item.id}>
      <button ref={(element) => { triggerRefs.current[item.id] = element; }} type="button" aria-label={item.label} title={item.label} disabled={item.disabled} aria-haspopup={hasMenu ? "menu" : undefined} aria-expanded={hasMenu ? expanded : undefined} aria-controls={hasMenu ? menuId : undefined} onClick={() => { item.onClick?.(); if (hasMenu && !item.disabled) setOpenId(expanded ? null : item.id); }}>{item.icon ?? <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><circle cx="3" cy="8" r="1.25" /><circle cx="8" cy="8" r="1.25" /><circle cx="13" cy="8" r="1.25" /></svg>}</button>
      {hasMenu && expanded && <div id={menuId} className="inf-global-icon-button-set__menu" role="menu" aria-label={item.menuLabel ?? item.label}>{item.menuItems?.map((menuItem) => <button type="button" role="menuitem" key={menuItem.id} disabled={menuItem.disabled} onClick={() => chooseMenuItem(menuItem)}>{menuItem.label}</button>)}</div>}
    </span>;
  })}</div>;
}

export interface CountBadgeProps { value: number | string; label?: string; tone?: BadgeTone; className?: string }
export function CountBadge({ value, label, tone = "neutral", className = "" }: CountBadgeProps) { return <span className={`inf-global-count-badge ${className}`.trim()}><Badge tone={tone} size="sm">{value}</Badge>{label && <span>{label}</span>}</span>; }

export interface CompactProjectRowProps { project: Pick<ProjectCardData, "id" | "title" | "address" | "status" | "due"> & { blocker?: string; risk?: RiskBadgeProps["level"] }; onOpen?: () => void; className?: string }
export function CompactProjectRow({ project, onOpen, className = "" }: CompactProjectRowProps) { return <button type="button" className={`inf-global-compact-row ${className}`.trim()} onClick={onOpen}><span data-label="Project"><strong>{project.id}</strong><span>{project.title}<small>{project.address}</small></span></span><span data-label="Status">{project.status && <StatusBadge status={project.status} />}</span><span data-label="Blocker">{project.blocker ?? "—"}</span><span data-label="Risk"><RiskBadge level={project.risk ?? "medium"} /></span><time data-label="Due">{project.due ?? "—"}</time><svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg></button>; }

export interface CardFooterAction { id: string; label: string; icon?: ReactNode; variant?: ButtonProps["variant"]; onClick?: () => void; disabled?: boolean; loading?: boolean }
export interface CardFooterActionsProps { actions: CardFooterAction[]; ariaLabel?: string; className?: string }
export function CardFooterActions({ actions, ariaLabel = "Card actions", className = "" }: CardFooterActionsProps) { return <footer className={`inf-global-card-actions ${className}`.trim()} aria-label={ariaLabel}>{actions.map((action) => <Button key={action.id} type="button" size="sm" variant={action.variant ?? "ghost"} disabled={action.disabled} loading={action.loading} onClick={action.onClick}>{action.icon}{action.label}</Button>)}</footer>; }

export type GlobalComponentId = `A${string}`;

