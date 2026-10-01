import { StrictMode, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  ActivityFeed,
  AICheckSummary,
  AIFixDialog,
  AIRiskCard,
  AttentionTable,
  Badge,
  BrandLogo,
  CardFooterActions,
  Button,
  ChangeList,
  CompactProjectRow,
  ComplianceScoreCard,
  ComplianceFindingsList,
  ConnectionStatusBadge,
  CountBadge,
  DecisionSummary,
  Dialog,
  DocumentCategoryTabs,
  DocumentGroup,
  DocumentIntelligencePanel,
  DocumentRow,
  DocumentSearch,
  DocumentStatusFilter,
  FileUploadDropzone,
  FilterChip,
  FindingDetailPanel,
  IconButtonSet,
  InspectionScheduleCard,
  JurisdictionFilter,
  LinearProgress,
  NavGroup,
  NavItem,
  NextStepsPanel,
  NotificationButton,
  NotificationReceiptCard,
  PackageReadyBanner,
  PackageSubmitPanel,
  PackageContentList,
  PackageComplianceCard,
  PortfolioStats,
  ProjectBreadcrumb,
  ProjectIdChip,
  ProjectAIStatusCard,
  ProjectDetailsCard,
  ProjectHeroCard,
  ProjectCard,
  ProjectHeaderActions,
  ProjectPipeline,
  ProjectStatusFilters,
  ProjectStatusBadge,
  ProjectTabs,
  ProjectTeamCard,
  PermitProgressCard,
  ProjectTypeFilter,
  RecommendedActionCard,
  RequirementSourcesPanel,
  RequirementsSummary,
  ReviewActionBar,
  ReviewStatusPills,
  RiskBadge,
  SearchField,
  ScoreGauge,
  SidebarAIWidget,
  StatusBadge,
  StatusPillSet,
  SubmissionProgressOverlay,
  SubmissionSummary,
  SubmissionSuccessPanel,
  SubmissionTargetCard,
  SubmissionConfirmations,
  SubmissionDialogActions,
  SubmitConfirmationDialog,
  Tabs,
  TabPanel,
  TimeRangeControl,
  UserProfileCard,
  VersionHistoryHint,
  VersionIndicator,
  ViewToggle,
  WorkspaceSwitcher,
  WorkflowBadge,
  AIFixDiffPanel,
  ApprovalOptions,
  AppShell,
  BeforeSubmitChecklist,
  AIFinalCheckCard,
  FileUploadDropzone as DetailDropzone,
  useSubmissionWorkflow,
  type ProjectCardData,
  type TabItem,
} from "infisson_ui";
import "infisson_ui/styles.css";
import "./preview.css";

const projectImage = "./references/01_global_dashboard_projects.png";

type PreviewTheme = "default" | "lime" | "rose-mocha" | "mint-slate" | "vermilion" | "italian" | "rose-heart" | "champagne" | "jade";
const previewThemes: Array<{ value: PreviewTheme; label: string }> = [
  { value: "default", label: "默认 · 原始色" },
  { value: "lime", label: "主题一 · 青柠绿" },
  { value: "rose-mocha", label: "主题二 · 玫瑰摩卡" },
  { value: "mint-slate", label: "主题三 · 薄荷青岩" },
  { value: "vermilion", label: "主题四 · 雅致朱红" },
  { value: "italian", label: "主题五 · 意式经典" },
  { value: "rose-heart", label: "主题六 · 少女之心" },
  { value: "champagne", label: "主题七 · 低奢商务" },
  { value: "jade", label: "主题八 · 高级静奢" },
];

const projects: ProjectCardData[] = [
  { id: "PL-2841", title: "18 Meridian Way", address: "Nova Ridge, NR", jurisdiction: "Harbor County", status: "under-review", progress: 78, system: "42 units", battery: "24 units", owner: "Avery Chen", due: "Oct 2", imageSrc: projectImage },
  { id: "PL-2796", title: "42 Willow Loop", address: "Pine Hollow, PH", jurisdiction: "Pine Hollow County", status: "delayed", progress: 62, system: "56 units", owner: "Mira Solis", due: "Oct 1", imageSrc: projectImage },
  { id: "PL-2848", title: "Meridian Loop Retrofit", address: "Nova Ridge, NR", jurisdiction: "Harbor County", status: "missing-docs", progress: 41, system: "31 units", owner: "Mira Solis", due: "Sep 30", imageSrc: projectImage },
];

const tabs: TabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents", count: 10 },
  { id: "inspections", label: "Inspections", count: 1 },
];

function GlobalPreview({ theme, onThemeChange }: { theme: PreviewTheme; onThemeChange: (theme: PreviewTheme) => void }) {
  const [range, setRange] = useState("7-days");
  const [view, setView] = useState("grid");
  const [permitProgress, setPermitProgress] = useState(78);
  const [packageCompliance, setPackageCompliance] = useState(94);
  const [shellActive, setShellActive] = useState("projects");
  const [shellWorkspace, setShellWorkspace] = useState({ id: "northstar", name: "Northstar Works", location: "Nova Ridge, NR" });
  const [shellAiEnabled, setShellAiEnabled] = useState(true);
  const [shellFeedback, setShellFeedback] = useState("");
  const navGroups = [
    { id: "main", items: [
      { id: "overview", label: "Overview", icon: <NavGlyph kind="grid" />, onClick: () => setShellFeedback("Overview selected") },
      { id: "projects", label: "Projects", icon: <NavGlyph kind="folder" />, count: 128, onClick: () => setShellFeedback("Projects selected") },
    ]},
    { id: "permitting", label: "PERMITTING", items: [
      { id: "permits", label: "Permits", icon: <NavGlyph kind="document" />, count: 47 },
      { id: "requirements", label: "Requirements", icon: <NavGlyph kind="check" /> },
      { id: "documents", label: "Documents", icon: <NavGlyph kind="document" /> },
      { id: "inspections", label: "Inspections", icon: <NavGlyph kind="clipboard" />, count: 19 },
      { id: "utilities", label: "Utilities", icon: <NavGlyph kind="bolt" /> },
    ]},
    { id: "workspace", label: "WORKSPACE", items: [
      { id: "risk", label: "Risk Center", icon: <NavGlyph kind="alert" />, count: 7 },
      { id: "assistant", label: "AI Assistant", icon: <NavGlyph kind="spark" /> },
      { id: "reports", label: "Reports", icon: <NavGlyph kind="chart" /> },
      { id: "team", label: "Team", icon: <NavGlyph kind="team" /> },
      { id: "settings", label: "Settings", icon: <NavGlyph kind="settings" /> },
    ]},
  ];
  return <PreviewSection id="global" eyebrow="infission 组件拆解 01 / Component board 01" title="全局框架 / 仪表盘 / 项目列表 · Global shell / dashboard / projects" theme={theme} onThemeChange={onThemeChange}>
    <AppShell
      brand={{ name: "infission" }}
      workspace={shellWorkspace}
      workspaceOptions={[shellWorkspace, { id: "bluefern", name: "Bluefern Studio", location: "Bluefern, BF" }, { id: "cedarline", name: "Cedarline Group", location: "Cedarline, CL" }]}
      navGroups={navGroups}
      activeItem={shellActive}
      onNavigate={(item) => { setShellActive(item.id); setShellFeedback(`${item.label} selected`); }}
      onWorkspaceChange={(next) => { setShellWorkspace(next); setShellFeedback(`${next.name} selected`); }}
      aiWidget={{ count: 7, enabled: shellAiEnabled, onEnabledChange: setShellAiEnabled, onAction: () => setShellFeedback("AI risk review opened") }}
      user={{ name: "Avery Chen", role: "Operations Manager", initials: "AC", moreActions: [{ id: "profile", label: "View profile", onSelect: () => setShellFeedback("Profile opened") }, { id: "settings", label: "Account settings", onSelect: () => setShellFeedback("Account settings opened") }] }}
    >
      <div className="preview-shell-content">
        <ReferenceCluster number="02" title="顶部通用控件" subtitle="Global header controls" ids="A09–A15" />
        <div className="preview-toolbar">
          <div><p className="preview-kicker">Portfolio</p><h3 className="preview-page-title">Good morning, Avery</h3></div>
          <SearchField placeholder="Search projects" shortcut="⌘K" />
          <Button variant="dark" onClick={() => setShellFeedback("New project action fired")}>+ New project</Button>
        </div>
        {shellFeedback && <p className="preview-shell-feedback" role="status">{shellFeedback}</p>}
        <ReferenceCluster number="03" title="仪表盘模块" subtitle="Dashboard modules" ids="A16–A22" />
        <div className="preview-grid preview-grid--stats">
          <ScoreGauge value={permitProgress} label="Permit progress" interactive onChange={setPermitProgress} />
          <ScoreGauge value={packageCompliance} label="Package compliance" variant="ticks" interactive onChange={setPackageCompliance} />
          <ProjectStatusBadge status="under-review" />
          <WorkflowBadge status="on-track" />
        </div>
        <div className="preview-controls">
          <Tabs id="global-status" items={[{ id: "all", label: "All", count: 128 }, { id: "permitting", label: "In permitting", count: 47 }, { id: "risk", label: "At risk", count: 7 }]} defaultValue="all" aria-label="Project status filters" />
          <div className="preview-segmented" role="group" aria-label="Time range">{["today", "7-days", "30-days"].map((item) => <button type="button" key={item} className={range === item ? "is-active" : ""} onClick={() => setRange(item)}>{item}</button>)}</div>
          <div className="preview-segmented" role="group" aria-label="View mode">{["grid", "list"].map((item) => <button type="button" key={item} className={view === item ? "is-active" : ""} onClick={() => setView(item)}>{item}</button>)}</div>
        </div>
        <div className="preview-dashboard-grid">
          <div className="preview-dashboard-grid__hero"><ProjectHeroCard project={projects[0]} onOpen={() => setShellFeedback("18 Meridian Way opened")} /></div>
          <PortfolioStats stats={[{ label: "Active projects", value: 128, detail: "7 jurisdictions", tone: "dark" }, { label: "In permitting", value: 47, detail: "6 this week", tone: "neutral" }, { label: "At risk", value: 7, detail: "needs action", tone: "brand" }]} />
          <ProjectPipeline stages={[{ label: "Design", count: 32 }, { label: "Permit", count: 47 }, { label: "Review", count: 18 }, { label: "Inspection", count: 19 }]} />
          <AttentionTable rows={[{ id: "PL-2796", project: "42 Willow Loop", stage: "AHJ review", blocker: "Missing docs", risk: "high", due: "Oct 1" }]} />
          <AIRiskCard projectsAtRisk={7} risks={["3 are missing required documents", "2 have unusual review delays"]} />
          <PackageComplianceCard score={94} project="18 Meridian Way" checked={1184} flagged={31} rejected={0.8} />
        </div>
        <ReferenceCluster number="04" title="项目浏览" subtitle="Project browsing" ids="A23–A30" />
        <div className="preview-dashboard-projects">
          <div className="preview-subsection-heading"><div><p className="preview-kicker">Project browsing</p><h3>Projects</h3></div><span>{projects.length} examples · {view} view</span></div>
          <div className={view === "grid" ? "preview-project-grid" : "preview-project-list"}>{projects.map((project) => <ProjectCard key={project.id} project={project} onOpen={() => setShellFeedback(`${project.id} opened`)} />)}</div>
        </div>
        <ReferenceCluster number="05" title="通用小组件" subtitle="Shared primitives" ids="A31–A37" />
      </div>
    </AppShell>
    <GlobalCatalog />
  </PreviewSection>;
}

function NavGlyph({ kind }: { kind: string }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="5" height="5" rx="1" /><rect x="12" y="3" width="5" height="5" rx="1" /><rect x="3" y="12" width="5" height="5" rx="1" /><rect x="12" y="12" width="5" height="5" rx="1" /></>,
    folder: <path d="M2.5 5.5h5l1.6 2h8.4v7.8a1.7 1.7 0 0 1-1.7 1.7H4.2a1.7 1.7 0 0 1-1.7-1.7z" />,
    document: <><path d="M5 2.5h7l3 3v11H5z" /><path d="M12 2.5v3h3M7.5 9h5M7.5 12h5" /></>,
    check: <><path d="m3 5 1.5 1.5L7 4" /><path d="M9 5h7M3 11l1.5 1.5L7 10" /><path d="M9 11h7" /></>,
    clipboard: <><rect x="4" y="3.5" width="12" height="14" rx="1.5" /><path d="M7 3.5V2h6v1.5M7 8h6M7 11h6M7 14h4" /></>,
    bolt: <path d="m10 2-6 9h5l-1 7 6-9H9z" />,
    alert: <><path d="m10 2.7 7.1 12.5a1.3 1.3 0 0 1-1.1 2H3.9a1.3 1.3 0 0 1-1.1-2z" /><path d="M10 7v4M10 14h.01" /></>,
    spark: <path d="m10 2 1.7 5.4L17 9l-5.3 1.6L10 16l-1.7-5.4L3 9l5.3-1.6z" />,
    chart: <><path d="M3 17V9M8 17V5M13 17v-3M18 17V2" /><path d="M2 17.5h17" /></>,
    team: <><circle cx="8" cy="7" r="3" /><path d="M2.5 17c.6-3 2.4-4.5 5.5-4.5s4.9 1.5 5.5 4.5" /><circle cx="16" cy="8" r="2" /><path d="M14.3 13c2.1.1 3.3 1.3 3.7 3" /></>,
    settings: <><circle cx="10" cy="10" r="3" /><path d="m10 2 1 2.2 2.2.9 2.2-1 1.5 1.5-1 2.2.9 2.2L19 11v2l-2.2 1-.9 2.2 1 2.2-1.5 1.5-2.2-1-2.2.9L10 22l-2-1.2-2.2-.9-2.2 1-1.5-1.5 1-2.2-.9-2.2L0 13v-2l2.2-1 .9-2.2-1-2.2L3.6 4.1l2.2 1L8 4.2z" /></>,
  };
  return <svg className="preview-nav-glyph" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" aria-hidden="true">{paths[kind] ?? paths.grid}</svg>;
}

function ReferenceShell({ activeItem = "projects", children }: { activeItem?: string; children: ReactNode }) {
  const [workspace, setWorkspace] = useState({ id: "northstar", name: "Northstar Works", location: "Nova Ridge, NR" });
  const [active, setActive] = useState(activeItem);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [feedback, setFeedback] = useState("");
  const navGroups = [
    { id: "main", items: [{ id: "overview", label: "Overview", icon: <NavGlyph kind="grid" /> }, { id: "projects", label: "Projects", icon: <NavGlyph kind="folder" />, count: 128 }] },
    { id: "permitting", label: "PERMITTING", items: [{ id: "permits", label: "Permits", icon: <NavGlyph kind="document" />, count: 47 }, { id: "requirements", label: "Requirements", icon: <NavGlyph kind="check" /> }, { id: "documents", label: "Documents", icon: <NavGlyph kind="document" /> }, { id: "inspections", label: "Inspections", icon: <NavGlyph kind="clipboard" />, count: 19 }, { id: "utilities", label: "Utilities", icon: <NavGlyph kind="bolt" /> }] },
    { id: "workspace", label: "WORKSPACE", items: [{ id: "risk", label: "Risk Center", icon: <NavGlyph kind="alert" />, count: 7 }, { id: "assistant", label: "AI Assistant", icon: <NavGlyph kind="spark" /> }, { id: "reports", label: "Reports", icon: <NavGlyph kind="chart" /> }, { id: "team", label: "Team", icon: <NavGlyph kind="team" /> }, { id: "settings", label: "Settings", icon: <NavGlyph kind="settings" /> }] },
  ];
  return <AppShell brand={{ name: "infission" }} workspace={workspace} workspaceOptions={[workspace, { id: "bluefern", name: "Bluefern Studio", location: "Bluefern, BF" }, { id: "cedarline", name: "Cedarline Group", location: "Cedarline, CL" }]} onWorkspaceChange={(next) => { setWorkspace(next); setFeedback(`${next.name} selected`); }} navGroups={navGroups} activeItem={active} onNavigate={(item) => { setActive(item.id); setFeedback(`${item.label} selected`); }} aiWidget={{ count: 7, enabled: aiEnabled, onEnabledChange: setAiEnabled, onAction: () => setFeedback("AI risk review opened") }} user={{ name: "Avery Chen", role: "Operations Manager", initials: "AC", moreActions: [{ id: "profile", label: "View profile", onSelect: () => setFeedback("Profile opened") }, { id: "settings", label: "Account settings", onSelect: () => setFeedback("Account settings opened") }] }}>
    <div className="preview-shell-content">{feedback && <p className="preview-shell-feedback" role="status">{feedback}</p>}{children}</div>
  </AppShell>;
}

function GlobalCatalog() {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [workspace, setWorkspace] = useState({ id: "northstar", name: "Northstar Works", location: "Nova Ridge, NR" });
  const [activeNav, setActiveNav] = useState("Projects");
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileMoreAction, setProfileMoreAction] = useState("");
  const [aiRisksVisible, setAiRisksVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [primaryActionState, setPrimaryActionState] = useState("ready");
  const [secondaryActionState, setSecondaryActionState] = useState("ready");
  const [filterSelected, setFilterSelected] = useState(true);
  const [filterVisible, setFilterVisible] = useState(true);
  const [catalogFeedback, setCatalogFeedback] = useState("");
  const notifyCatalog = (message: string) => setCatalogFeedback(message);
  const project = projects[0];
  const variants = [
    { ...project, id: "A26", status: "under-review" as const },
    { ...project, id: "A27", status: "delayed" as const },
    { ...project, id: "A28", status: "missing-docs" as const },
    { ...project, id: "A29", status: "interconnection" as const },
    { ...project, id: "A30", status: "inspection" as const },
  ];
  return <div className="preview-catalog"><div className="preview-catalog__heading"><h3>A01–A37 · 全局组件完整预览 / Complete global catalog</h3><span>37 mapped reference items</span></div>{catalogFeedback && <p className="preview-shell-feedback" role="status">{catalogFeedback}</p>}<div className="preview-component-grid">
    <PreviewTile id="A01 · BrandLogo"><BrandLogo /></PreviewTile>
    <PreviewTile id="A02 · WorkspaceSwitcher"><WorkspaceSwitcher workspace={workspace} options={[{ id: "bluefern", name: "Bluefern Studio", location: "Bluefern, BF" }, { id: "cedarline", name: "Cedarline Group", location: "Cedarline, CL" }]} onChange={setWorkspace} /><p role="status">Current workspace: {workspace.name}</p></PreviewTile>
    <PreviewTile id="A03 · NavGroup"><NavGroup label="PERMITTING"><NavItem label="Projects" active={activeNav === "Projects"} count={128} onClick={() => setActiveNav("Projects")} /></NavGroup></PreviewTile>
    <PreviewTile id="A04 · NavItem default"><NavGroup><NavItem label="Overview" active={activeNav === "Overview"} onClick={() => setActiveNav("Overview")} /></NavGroup></PreviewTile>
    <PreviewTile id="A05 · NavItem active"><NavGroup><NavItem label="Projects" active={activeNav === "Projects"} count={128} onClick={() => setActiveNav("Projects")} /></NavGroup></PreviewTile>
    <PreviewTile id="A06 · NavItem with count"><NavGroup><NavItem label="Inspections" active={activeNav === "Inspections"} count={19} onClick={() => setActiveNav("Inspections")} /></NavGroup><p role="status">Active nav: {activeNav}</p></PreviewTile>
    <PreviewTile id="A07 · SidebarAIWidget"><SidebarAIWidget count={7} enabled={aiEnabled} onEnabledChange={setAiEnabled} onAction={() => setAiRisksVisible((value) => !value)} /><p role="status">AI {aiEnabled ? "enabled / 已开启" : "paused / 已暂停"}</p>{aiRisksVisible && <ul aria-label="Demo project risks"><li>PL-2841: missing disconnect information</li><li>PL-2796: review overdue</li><li>PL-2848: missing required documents</li></ul>}</PreviewTile>
    <PreviewTile id="A08 · UserProfileCard"><UserProfileCard name="Avery Chen" role="Operations Manager" avatarUrl="./references/infission/avatar-avery-chen.svg" onClick={() => setProfileOpen((value) => !value)} moreActions={[{ id: "profile", label: "View profile", onSelect: () => setProfileMoreAction("Profile details opened") }, { id: "settings", label: "Account settings", onSelect: () => setProfileMoreAction("Account settings opened") }]} /><p role="status">Profile panel {profileOpen ? "opened" : "closed"}</p>{profileMoreAction && <p role="status">{profileMoreAction}</p>}{profileOpen && <div className="preview-inline" role="region" aria-label="Profile actions"><Button variant="outline" size="sm" onClick={() => setProfileMoreAction("Account settings opened")}>Account settings</Button><Button variant="ghost" size="sm" onClick={() => setProfileOpen(false)}>Close</Button></div>}</PreviewTile>
    <PreviewTile id="A09 · SearchField"><SearchField value={searchQuery} onChange={setSearchQuery} onSubmit={setSearchSubmitted} /><p role="status">{searchSubmitted ? `Last search: ${searchSubmitted}` : "Type a project or address and press Enter"}</p></PreviewTile>
    <PreviewTile id="A10 · NotificationButton"><NotificationButton unreadCount={3} onClick={() => setNotificationsOpen((value) => !value)} /><p role="status">Notifications {notificationsOpen ? "open" : "closed"}</p>{notificationsOpen && <div className="preview-inline" role="region" aria-label="Notifications panel"><span>3 project updates are waiting</span><Button size="sm" variant="ghost" onClick={() => setNotificationsOpen(false)}>Close</Button></div>}</PreviewTile>
    <PreviewTile id="A11 · PrimaryActionButton"><Button variant="dark" onClick={() => setPrimaryActionState("new project action fired")}>New project</Button><p role="status">{primaryActionState}</p></PreviewTile>
    <PreviewTile id="A12 · SecondaryActionButton"><Button variant="outline" onClick={() => setSecondaryActionState("permit package action fired")}>Permit package</Button><p role="status">{secondaryActionState}</p></PreviewTile>
    <PreviewTile id="A13 · StatusBadge"><StatusBadge status="on-track" /></PreviewTile>
    <PreviewTile id="A14 · FilterChip">{filterVisible ? <FilterChip label="All" count={128} selected={filterSelected} onClick={() => setFilterSelected((value) => !value)} removable onRemove={() => setFilterVisible(false)} /> : <Button size="sm" variant="ghost" onClick={() => { setFilterVisible(true); setFilterSelected(true); }}>Restore filter</Button>}<p role="status">Filter {filterVisible ? (filterSelected ? "selected" : "not selected") : "removed"}</p></PreviewTile>
    <PreviewTile id="A15 · TimeRangeControl"><TimeRangeControl onChange={(value) => notifyCatalog(`Time range: ${value}`)} /></PreviewTile>
    <PreviewTile id="A16 · ProjectHeroCard"><ProjectHeroCard project={project} onOpen={(item) => notifyCatalog(`${item.title} opened`)} /></PreviewTile>
    <PreviewTile id="A17 · PortfolioStats"><PortfolioStats stats={[{ label: "Active projects", value: 128, detail: "7 jurisdictions", tone: "dark" }, { label: "At risk", value: 7, detail: "needs action", tone: "brand" }]} /></PreviewTile>
    <PreviewTile id="A18 · ProjectPipeline"><ProjectPipeline stages={[{ label: "Design", count: 32 }, { label: "Permit", count: 47 }, { label: "Review", count: 18 }, { label: "Inspection", count: 19 }, { label: "PTO", count: 12 }]} onAction={() => notifyCatalog("Project pipeline opened")} /></PreviewTile>
    <PreviewTile id="A19 · AttentionTable"><AttentionTable rows={[{ id: "PL-2796", project: "42 Willow Loop", stage: "AHJ review", blocker: "Missing docs", risk: "high", due: "Oct 1" }]} onRowClick={(row) => notifyCatalog(`${row.project} opened`)} /></PreviewTile>
    <PreviewTile id="A20 · AIRiskCard"><AIRiskCard projectsAtRisk={7} risks={["3 are missing required documents", "2 have unusual review delays"]} onAction={() => notifyCatalog("Risk details toggled")} /></PreviewTile>
    <PreviewTile id="A21 · PackageComplianceCard"><PackageComplianceCard score={94} project="18 Meridian Way" checked={1184} flagged={31} rejected={0.8} onAction={() => notifyCatalog("Compliance details toggled")} /></PreviewTile>
    <PreviewTile id="A22 · ProjectStatusFilters"><ProjectStatusFilters options={[{ value: "all", label: "All", count: 128 }, { value: "risk", label: "At risk", count: 7 }]} onChange={(value) => notifyCatalog(`Status filter: ${value}`)} /></PreviewTile>
    <PreviewTile id="A23 · JurisdictionFilter"><JurisdictionFilter options={[{ value: "harbor", label: "All jurisdictions" }]} onChange={(value) => notifyCatalog(`Jurisdiction: ${value || "all"}`)} /></PreviewTile>
    <PreviewTile id="A24 · ProjectTypeFilter"><ProjectTypeFilter options={[{ value: "standard", label: "Standard" }]} onChange={(value) => notifyCatalog(`Project type: ${value || "all"}`)} /></PreviewTile>
    <PreviewTile id="A25 · ViewToggle"><ViewToggle onChange={(value) => notifyCatalog(`View mode: ${value}`)} /></PreviewTile>
    {variants.map((item) => <PreviewTile key={item.id} id={`${item.id} · ProjectCard ${item.status}`}><ProjectCard project={item} onOpen={(opened) => notifyCatalog(`${opened.id} opened`)} /></PreviewTile>)}
    <PreviewTile id="A31 · StatusPillSet"><StatusPillSet items={[{ value: "track", label: "On track", tone: "success" }, { value: "review", label: "Under review", tone: "warning" }]} value="track" onChange={(value) => notifyCatalog(`Status pill: ${value}`)} /></PreviewTile>
    <PreviewTile id="A32 · RiskBadge"><div className="preview-inline"><RiskBadge level="high" /><RiskBadge level="medium" /><RiskBadge level="low" /></div></PreviewTile>
    <PreviewTile id="A33 · LinearProgress"><LinearProgress value={78} showValue /></PreviewTile>
    <PreviewTile id="A34 · IconButtonSet"><IconButtonSet items={[{ id: "open", label: "Open", icon: <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"><path d="M4 12 12 4M6 4h6v6" /></svg>, onClick: () => notifyCatalog("Open action fired") }, { id: "more", label: "More", menuItems: [{ id: "edit", label: "Edit", onSelect: () => notifyCatalog("Edit selected") }, { id: "archive", label: "Archive", onSelect: () => notifyCatalog("Archive selected") }] }]} /></PreviewTile>
    <PreviewTile id="A35 · CountBadge"><CountBadge value={128} label="projects" tone="brand" /></PreviewTile>
    <PreviewTile id="A36 · CompactProjectRow"><CompactProjectRow project={{ ...project, blocker: "Battery spec missing", risk: "high" }} onOpen={() => notifyCatalog("Compact project row opened")} /></PreviewTile>
    <PreviewTile id="A37 · CardFooterActions"><CardFooterActions actions={[{ id: "view", label: "View", variant: "outline", onClick: () => notifyCatalog("View action fired") }, { id: "more", label: "More", onClick: () => notifyCatalog("More action fired") }]} /></PreviewTile>
  </div></div>;
}

function DetailPreview({ theme, onThemeChange }: { theme: PreviewTheme; onThemeChange: (theme: PreviewTheme) => void }) {
  const [projectTab, setProjectTab] = useState("overview");
  const [query, setQuery] = useState("");
  const [detailFeedback, setDetailFeedback] = useState("");
  const [detailCompliance, setDetailCompliance] = useState(87);
  const notifyDetail = (message: string) => setDetailFeedback(message);
  return <PreviewSection id="detail" eyebrow="02 / Project detail" title="项目详情、文档中心与合规审查 / Detail, documents, compliance" theme={theme} onThemeChange={onThemeChange}>
    <ReferenceShell activeItem="projects">
    {detailFeedback && <p className="preview-shell-feedback" role="status">{detailFeedback}</p>}
    <ReferenceCluster number="01" title="项目头部与页签" subtitle="Project header & tabs" ids="B01–B05" />
    <div className="preview-detail-heading"><ProjectBreadcrumb items={[{ label: "Projects" }, { label: "18 Meridian Way" }]} /><ProjectHeaderActions status={<ProjectStatusBadge status="on-track" />} actions={<><Button variant="outline" size="sm" onClick={() => notifyDetail("Permit package opened")}>Permit package</Button><Button variant="dark" size="sm" onClick={() => notifyDetail("Project actions opened")}>Actions</Button></>} /></div>
    <ProjectTabs items={[{ key: "overview", label: "Overview" }, { key: "documents", label: "Documents", count: 10 }, { key: "compliance", label: "Compliance" }]} value={projectTab} onValueChange={setProjectTab} />
    <ReferenceCluster number="02" title="项目概览" subtitle="Overview modules" ids="B06–B12" />
    <div className="preview-detail-layout">
      <div className="preview-stack">
        <ProjectAIStatusCard status="Project is on track" message="Next milestone is the AHJ decision, expected Oct 2." confidence={91} updatedAt="2 min ago" />
        <RequirementsSummary metrics={[{ label: "Complete", value: 23, tone: "brand" }, { label: "Harbor County", value: "14 of 14", tone: "neutral" }, { label: "Harbor Utilities", value: "9 of 9", tone: "neutral" }]} />
        <ActivityFeed items={[{ id: "1", title: "AHJ review started", description: "Plan reviewer picked up the package.", timestamp: "Sep 25", tone: "success" }, { id: "2", title: "Document intelligence checked", timestamp: "Sep 24" }]} />
      </div>
      <div className="preview-stack">
        <DocumentSearch value={query} onValueChange={setQuery} />
        <AICheckSummary checked={9} total={10} confidence={98} onAction={() => notifyDetail("Document check details opened")} />
        <DocumentGroup title="Design" files={[{ id: "1", name: "Site Plan v3.pdf", size: "2.4 MB", owner: "Mira Solis", status: "verified", confidence: 98, date: "Sep 18" }, { id: "2", name: "Electrical Plan v2.pdf", size: "3.1 MB", owner: "Mira Solis", status: "needs-review", confidence: 87, date: "Sep 18" }]} onOpenFile={(file) => notifyDetail(`${file.name} opened`)} onFileMenu={(file) => notifyDetail(`${file.name} menu opened`)} />
        <DocumentIntelligencePanel fieldsExtracted={214} mismatches={3} averageCheckTime="11s" />
      </div>
      <div className="preview-stack">
        <ComplianceScoreCard score={detailCompliance} passed={2} minor={1} critical={1} interactive onChange={setDetailCompliance} />
        <FileUploadDropzone onFiles={(files) => notifyDetail(`${files.length} file${files.length === 1 ? "" : "s"} selected for demo review`)} onReject={(reason) => notifyDetail(`Upload rejected: ${reason}`)} />
        <TabPanel tabId="detail-overview-panel" labelledBy="detail-overview" active={projectTab === "overview"}>Overview module content</TabPanel>
      </div>
    </div>
    <ReferenceCluster number="03" title="文档中心" subtitle="Documents center" ids="B13–B20" />
    <ReferenceCluster number="04" title="合规审查" subtitle="Compliance review" ids="B21–B27" />
    <ReferenceCluster number="05" title="状态标记与反馈" subtitle="Status markers" ids="B28" />
    <DetailCatalog />
    </ReferenceShell>
  </PreviewSection>;
}

function DetailCatalog() {
  const [feedback, setFeedback] = useState("");
  const [complianceScore, setComplianceScore] = useState(87);
  const [catalogProjectTab, setCatalogProjectTab] = useState("overview");
  const notify = (message: string) => setFeedback(message);
  const file = { id: "doc-1", name: "Site Plan v3.pdf", size: "2.4 MB", owner: "Mira Solis", status: "verified" as const, confidence: 98, date: "Sep 18" };
  const finding = { id: "f-1", label: "Main disconnect information missing", severity: "critical" as const, detail: "Add the disconnect location and rating to detail C." };
  return <div className="preview-catalog"><div className="preview-catalog__heading"><h3>B01–B28 · 项目详情组件完整预览 / Complete detail catalog</h3><span>28 mapped reference items</span></div>{feedback && <p className="preview-shell-feedback" role="status">{feedback}</p>}<div className="preview-component-grid">
    <PreviewTile id="B01 · ProjectBreadcrumb"><ProjectBreadcrumb items={[{ label: "Projects" }, { label: "18 Meridian Way" }]} /></PreviewTile>
    <PreviewTile id="B02 · ProjectIdChip"><ProjectIdChip id="PL-2841" /></PreviewTile>
    <PreviewTile id="B03 · ProjectTabs"><ProjectTabs items={tabs.map((item) => ({ key: item.id, label: item.label, count: item.count }))} value={catalogProjectTab} onValueChange={(value) => { setCatalogProjectTab(value); notify(`Project tab: ${value}`); }} /><p className="preview-inline-feedback" role="status">Selected: {catalogProjectTab}</p></PreviewTile>
    <PreviewTile id="B04 · ProjectHeaderActions"><ProjectHeaderActions status={<ProjectStatusBadge status="on-track" />} actions={<Button variant="dark" size="sm" onClick={() => notify("Project actions opened")}>Actions</Button>} /></PreviewTile>
    <PreviewTile id="B05 · ProjectStatusBadge"><ProjectStatusBadge status="under-review" /></PreviewTile>
    <PreviewTile id="B06 · PermitProgressCard"><PermitProgressCard completion={78} steps={[{ id: "design", label: "Design", date: "Sep 8", status: "complete" }, { id: "review", label: "Submitted in review", date: "Day 4", status: "current" }, { id: "inspection", label: "Inspection", date: "Oct 8", status: "upcoming" }]} /></PreviewTile>
    <PreviewTile id="B07 · ProjectAIStatusCard"><ProjectAIStatusCard status="Project is on track" message="Next milestone is the AHJ decision." confidence={91} updatedAt="2 min ago" /></PreviewTile>
    <PreviewTile id="B08 · RequirementsSummary"><RequirementsSummary metrics={[{ label: "Complete", value: 23, tone: "brand" }, { label: "Harbor County", value: "14 of 14" }, { label: "Harbor Utilities", value: "9 of 9" }]} /></PreviewTile>
    <PreviewTile id="B09 · ActivityFeed"><ActivityFeed items={[{ id: "1", title: "AHJ review started", description: "Plan reviewer picked up the package.", timestamp: "Sep 25", tone: "success" }]} /></PreviewTile>
    <PreviewTile id="B10 · ProjectDetailsCard"><ProjectDetailsCard fields={[{ label: "Jurisdiction", value: "Harbor County" }, { label: "System", value: "42 units · 20 modules" }]} /></PreviewTile>
    <PreviewTile id="B11 · ProjectTeamCard"><ProjectTeamCard members={[{ id: "m1", name: "Avery Chen", role: "Permit coordinator · owner", initials: "AC" }, { id: "m2", name: "Mira Solis", role: "Design lead", initials: "MS" }]} /></PreviewTile>
    <PreviewTile id="B12 · InspectionScheduleCard"><InspectionScheduleCard date="Thu Oct 8" time="10:30 AM" inspector="Riley Stone" location="18 Meridian Way" onAction={() => notify("Inspection schedule opened")} /></PreviewTile>
    <PreviewTile id="B13 · DocumentCategoryTabs"><DocumentCategoryTabs categories={[{ key: "all", label: "All", count: 10 }, { key: "design", label: "Design", count: 3 }, { key: "utility", label: "Utility", count: 4 }]} /></PreviewTile>
    <PreviewTile id="B14 · DocumentStatusFilter"><DocumentStatusFilter options={[{ value: "any", label: "Any status" }, { value: "verified", label: "Verified" }]} /></PreviewTile>
    <PreviewTile id="B15 · DocumentSearch"><DocumentSearch placeholder="Find a document" /></PreviewTile>
    <PreviewTile id="B16 · AICheckSummary"><AICheckSummary checked={9} total={10} confidence={98} /></PreviewTile>
    <PreviewTile id="B17 · DocumentGroup"><DocumentGroup title="Design" files={[file, { ...file, id: "doc-2", name: "Electrical Plan v2.pdf", status: "needs-review", confidence: 75 }]} onOpenFile={(item) => notify(`${item.name} opened`)} onFileMenu={(item) => notify(`${item.name} menu opened`)} /></PreviewTile>
    <PreviewTile id="B18 · DocumentRow"><DocumentRow file={file} onOpen={(item) => notify(`${item.name} opened`)} onMenu={(item) => notify(`${item.name} menu opened`)} /></PreviewTile>
    <PreviewTile id="B19 · FileUploadDropzone"><DetailDropzone /></PreviewTile>
    <PreviewTile id="B20 · DocumentIntelligencePanel"><DocumentIntelligencePanel fieldsExtracted={214} mismatches={3} averageCheckTime="11s" /></PreviewTile>
    <PreviewTile id="B21 · ComplianceScoreCard"><ComplianceScoreCard score={complianceScore} passed={2} minor={1} critical={1} interactive onChange={setComplianceScore} /></PreviewTile>
    <PreviewTile id="B22 · ComplianceFindingsList"><ComplianceFindingsList findings={[finding, { id: "f-2", label: "System size matches the project", severity: "pass" }]} /></PreviewTile>
    <PreviewTile id="B23 · FindingDetailPanel"><FindingDetailPanel finding={finding} description="The submitted plan does not identify the main disconnect location." preview={<div className="preview-placeholder">Sheet E-2 · detail C</div>} reference="NEC 2023 Article 705.20" /></PreviewTile>
    <PreviewTile id="B24 · RequirementSourcesPanel"><RequirementSourcesPanel explanation="What infission saw: the disconnect location is not clear on the plan." sources={[{ id: "src-1", title: "NEC 2023 Article 705.20", description: "Disconnecting means" }, { id: "src-2", title: "Harbor County Field Services Guide" }]} /></PreviewTile>
    <PreviewTile id="B25 · RecommendedActionCard"><RecommendedActionCard title="Add the disconnect location and rating to detail C" description="Recommended action" actionLabel="Apply recommendation" onAction={() => notify("Recommended action applied in demo mode")} /></PreviewTile>
    <PreviewTile id="B26 · AIFixDiffPanel"><AIFixDiffPanel title="AI fix before / after" lines={[{ label: "AC DISCONNECT", before: "Missing", after: "60A NON FUSED" }, { label: "LOCATION", before: "—", after: "LEFT OF METER, 6 FT 4 IN" }]} /></PreviewTile>
    <PreviewTile id="B27 · ReviewActionBar"><ReviewActionBar onOpenViewer={() => notify("Viewer opened")} onSendToDesigner={() => notify("Sent to designer in demo mode")} onFixWithAI={() => notify("AI fix opened")} /></PreviewTile>
    <PreviewTile id="B28 · ReviewStatusPills"><ReviewStatusPills statuses={[{ label: "Verified", status: "verified" }, { label: "Needs review", status: "needs-review" }, { label: "Critical", status: "critical" }, { label: "Fixed", status: "fixed" }]} /></PreviewTile>
  </div></div>;
}

function WorkflowPreview({ theme, onThemeChange }: { theme: PreviewTheme; onThemeChange: (theme: PreviewTheme) => void }) {
  const [fixOpen, setFixOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [progressOpen, setProgressOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [workflowFeedback, setWorkflowFeedback] = useState("");
  const workflowSections = [{ id: "forms", label: "Permit forms", complete: true, documents: [{ id: "permit", name: "Building Permit Application B-1", pages: 4, status: "generated" as const }, { id: "electrical", name: "Electrical Permit Application E-2", pages: 3, status: "generated" as const }] }, { id: "design", label: "Design set", complete: true, documents: [{ id: "site", name: "Site Plan v3", pages: 2, status: "verified" as const }, { id: "structural", name: "Structural Calculation v2", pages: 6, status: "verified" as const }] }];
  const workflowChecklist = [{ id: "notify", label: "Notify the customer when the permit is filed", defaultChecked: true }, { id: "hold", label: "Hold the install date until approval", defaultChecked: true }];
  return <PreviewSection id="workflow" eyebrow="infission 组件拆解 03 / Component board 03" title="流程弹窗 / 提交流程 / 状态反馈 · Workflow / submission / feedback" theme={theme} onThemeChange={onThemeChange}>
    <ReferenceShell activeItem="projects">
    {workflowFeedback && <p className="preview-shell-feedback" role="status">{workflowFeedback}</p>}
    <ReferenceCluster number="01" title="AI 修复确认弹窗" subtitle="AI fix approval modal" ids="C01–C10" />
    <div className="preview-flow-actions">
      <Button onClick={() => setFixOpen(true)}>AI fix approval</Button>
      <Button variant="dark" onClick={() => setConfirmOpen(true)}>Submit package</Button>
      <Button variant="outline" onClick={() => setProgressOpen(true)}>Show progress</Button>
      <Button variant="ghost" onClick={() => setSuccess(true)}>Show success</Button>
    </div>
    <ReferenceCluster number="02" title="提交前打包页" subtitle="Permit package page" ids="C11–C17" />
    <div className="preview-flow-grid">
      <PackageSubmitPanel projectId="PL-2841" projectName="18 Meridian Way" complete={23} total={23} compliance={96} target="Harbor County" sections={workflowSections} checklist={workflowChecklist} finalCheck={{ status: "passed" }} visibilityMode="hide" onDocumentVisibilityChange={(document, hidden) => setWorkflowFeedback(`${document.name} ${hidden ? "hidden" : "visible"}`)} onPreviewDocument={(document) => setWorkflowFeedback(`${document.name} preview opened`)} onPreviewPackage={() => setWorkflowFeedback("Package preview opened")} onSubmitPackage={() => setWorkflowFeedback("Submit package action fired in demo mode")} />
      <SubmissionSuccessPanel referenceId="INF-2026-11482" filedAt="Sep 24 at 9:12 AM" target="Harbor County" estimatedDecision="Oct 2, 2026" planReview="Starts Sep 25" amount="$418 paid" connection="connected" notificationStatus="success" onDownloadReceipt={() => setWorkflowFeedback("Receipt download prepared in demo mode")} onOpenTracker={() => setWorkflowFeedback("Permit tracker opened in demo mode")} />
    </div>
    <ReferenceCluster number="03" title="提交确认弹窗" subtitle="Submit confirmation modal" ids="C18–C22" />
    <div className="preview-workflow-badges">{(["ready", "connected", "passed", "submitted", "complete", "on-track"] as const).map((status) => <WorkflowBadge key={status} status={status} />)}</div>
    <ReferenceCluster number="04" title="过渡态" subtitle="Transitional states" ids="C23–C25" />
    <ReferenceCluster number="05" title="提交成功反馈" subtitle="Success & aftermath" ids="C26–C30" />
    <AIFixDialog open={fixOpen} onOpenChange={setFixOpen} changes={[{ id: "disconnect", kind: "added", label: "AC DISCONNECT · 60A NON FUSED", description: "New callout between the combiner and the main panel" }, { id: "location", kind: "updated", label: "LOCATION · LEFT OF METER, 6 FT 4 IN" }]} onApplyFix={() => setFixOpen(false)} />
    <SubmitConfirmationDialog open={confirmOpen} onOpenChange={setConfirmOpen} project="18 Meridian Way" filingType="Standard field package" packageSummary="10 documents · 48 pages" fee="$418 · company card on file" target="Harbor County" confirmations={[{ id: "accurate", required: true, label: "I confirm the package is complete and accurate" }]} onConfirm={async () => setConfirmOpen(false)} />
    <SubmissionProgressOverlay open={progressOpen} status="loading" progress={60} title="Submitting package" message="Please keep this window open." onDismiss={() => setProgressOpen(false)} onCancel={() => setProgressOpen(false)} />
    <Dialog open={success} onOpenChange={setSuccess} title="Filed with Harbor County" description="Receipt and next steps are ready." actions={<Button onClick={() => setSuccess(false)}>Close</Button>} />
    <ReferenceCluster number="06" title="通用状态组件" subtitle="Workflow status components" ids="C31–C36" />
    <WorkflowCatalog />
    </ReferenceShell>
  </PreviewSection>;
}

function WorkflowCatalog() {
  const [open, setOpen] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const notify = (message: string) => setFeedback(message);
  const changes = [{ id: "disconnect", kind: "added" as const, label: "AC DISCONNECT · 60A NON FUSED", description: "New callout between the combiner and the main panel" }];
  const sections = [{ id: "forms", title: "Permit forms", documents: [{ id: "permit", name: "Building Permit Application B-1", pages: 4, status: "generated" }] }, { id: "design", title: "Design set", documents: [{ id: "site", name: "Site Plan v3", pages: 2, status: "verified" }] }];
  const confirmations = [{ id: "accurate", required: true, label: "I confirm the package is complete and accurate" }];
  const checklist = [{ id: "notify", label: "Notify the customer when the permit is filed", defaultChecked: true }, { id: "hold", label: "Hold the install date until approval", defaultChecked: true }];
  return <div className="preview-catalog"><div className="preview-catalog__heading"><h3>C01–C36 · 流程状态组件完整预览 / Complete workflow catalog</h3><span>36 mapped reference items</span></div>{feedback && <p className="preview-shell-feedback" role="status">{feedback}</p>}<div className="preview-component-grid">
    <PreviewTile id="C01 · AIFixDialog"><Button variant="outline" size="sm" onClick={() => setOpen("c01")}>Open AI fix dialog</Button><AIFixDialog open={open === "c01"} onOpenChange={(value) => setOpen(value ? "c01" : null)} changes={changes} onApplyFix={() => setOpen(null)} /></PreviewTile>
    <PreviewTile id="C02 · DialogTitle / Description"><Button variant="outline" size="sm" onClick={() => setOpen("c02")}>Open dialog preview</Button><Dialog open={open === "c02"} title="AI fix dialog" description="Review the proposed changes." onOpenChange={(value) => setOpen(value ? "c02" : null)} /></PreviewTile>
    <PreviewTile id="C03 · DialogCloseButton"><Button variant="outline" size="sm" onClick={() => notify("Dialog closed")}>Close dialog</Button></PreviewTile>
    <PreviewTile id="C04 · ChangeList"><ChangeList changes={changes} /></PreviewTile>
    <PreviewTile id="C05 · VersionIndicator"><VersionIndicator from="v2" to="v3" /></PreviewTile>
    <PreviewTile id="C06 · ApprovalOptions"><ApprovalOptions /></PreviewTile>
    <PreviewTile id="C07 · VersionHistoryHint"><VersionHistoryHint /></PreviewTile>
    <PreviewTile id="C08 · Button · cancel"><Button variant="outline" onClick={() => notify("Cancel selected")}>Cancel</Button></PreviewTile>
    <PreviewTile id="C09 · Button · apply-fix"><Button variant="brand" onClick={() => notify("Apply fix selected")}>Apply fix</Button></PreviewTile>
    <PreviewTile id="C10 · ProjectHeader · permit"><ProjectHeaderActions status={<WorkflowBadge status="on-track" />} actions={<Button variant="dark" size="sm" onClick={() => notify("Permit package opened")}>Permit</Button>} /></PreviewTile>
    <PreviewTile id="C11 · PackageReadyBanner"><PackageReadyBanner complete={23} total={23} estimatedDecision="Oct 2, 2026" compliance={96} /></PreviewTile>
    <PreviewTile id="C12 · PackageContentList"><PackageContentList sections={sections.map((section) => ({ id: section.id, label: section.title, documents: section.documents.map((document) => ({ ...document, status: document.status as "generated" | "verified" })) }))} visibilityMode="hide" onDocumentVisibilityChange={(document, hidden) => notify(`${document.name} ${hidden ? "hidden" : "visible"}`)} /></PreviewTile>
    <PreviewTile id="C13 · AIFinalCheckCard"><AIFinalCheckCard /></PreviewTile>
    <PreviewTile id="C14 · SubmissionTargetCard"><SubmissionTargetCard target="Harbor County" connection="Connected" filingType="Standard field package" fee="$418 · card on file" filedBy="Avery Chen" /></PreviewTile>
    <PreviewTile id="C15 · BeforeSubmitChecklist"><BeforeSubmitChecklist items={checklist} /></PreviewTile>
    <PreviewTile id="C16 · PreviewPackageButton"><Button variant="outline" onClick={() => notify("Package preview opened")}>Preview package</Button></PreviewTile>
    <PreviewTile id="C17 · SubmitPackageButton"><Button variant="dark" onClick={() => notify("Submit package action fired in demo mode")}>Submit to Harbor County</Button></PreviewTile>
    <PreviewTile id="C18 · SubmitConfirmationDialog"><Button variant="outline" size="sm" onClick={() => setOpen("c18")}>Open submit confirmation</Button><SubmitConfirmationDialog open={open === "c18"} onOpenChange={(value) => setOpen(value ? "c18" : null)} project="18 Meridian Way" filingType="Standard field package" packageSummary="10 documents · 48 pages" fee="$418 · card on file" target="Harbor County" confirmations={confirmations} /></PreviewTile>
    <PreviewTile id="C19 · SubmissionSummary"><SubmissionSummary project="18 Meridian Way" filingType="Standard field package" packageSummary="10 documents · 48 pages" fee="$418" /></PreviewTile>
    <PreviewTile id="C20 · ConnectionStatusBadge"><ConnectionStatusBadge status="connected" /></PreviewTile>
    <PreviewTile id="C21 · SubmissionConfirmations"><SubmissionConfirmations items={confirmations} /></PreviewTile>
    <PreviewTile id="C22 · SubmissionDialogActions"><SubmissionDialogActions onCancel={() => notify("Submission cancelled")} onConfirm={() => notify("Submission confirmed")} /></PreviewTile>
    <PreviewTile id="C23 · SubmissionProgressOverlay"><Button variant="outline" size="sm" onClick={() => setOpen("c23")}>Show loading overlay</Button><SubmissionProgressOverlay open={open === "c23"} status="loading" progress={60} onDismiss={() => setOpen(null)} onCancel={() => setOpen(null)} /></PreviewTile>
    <PreviewTile id="C24 · SubmitButton · pending"><Button variant="dark" loading>Submitting package</Button></PreviewTile>
    <PreviewTile id="C25 · SubmissionStatusBadge"><WorkflowBadge status="submitted" /></PreviewTile>
    <PreviewTile id="C26 · SubmissionSuccessBanner"><SubmissionSuccessPanel referenceId="INF-2026-11482" filedAt="Sep 24 at 9:12 AM" target="Harbor County" estimatedDecision="Oct 2, 2026" amount="$418 paid" onDownloadReceipt={() => notify("Receipt download prepared in demo mode")} onOpenTracker={() => notify("Permit tracker opened in demo mode")} /></PreviewTile>
    <PreviewTile id="C27 · DecisionSummary"><DecisionSummary estimatedDecision="Oct 2, 2026" planReview="Starts Sep 25" /></PreviewTile>
    <PreviewTile id="C28 · SubmissionTargetCard · compact"><SubmissionTargetCard target="Harbor County" connection="Connected" compact /></PreviewTile>
    <PreviewTile id="C29 · NotificationReceiptCard"><NotificationReceiptCard /></PreviewTile>
    <PreviewTile id="C30 · NextStepsPanel"><NextStepsPanel /></PreviewTile>
    <PreviewTile id="C31 · WorkflowBadge · ready"><WorkflowBadge status="ready" /></PreviewTile>
    <PreviewTile id="C32 · WorkflowBadge · connected"><WorkflowBadge status="connected" /></PreviewTile>
    <PreviewTile id="C33 · WorkflowBadge · passed"><WorkflowBadge status="passed" /></PreviewTile>
    <PreviewTile id="C34 · WorkflowBadge · submitted"><WorkflowBadge status="submitted" /></PreviewTile>
    <PreviewTile id="C35 · WorkflowBadge · complete"><WorkflowBadge status="complete" /></PreviewTile>
    <PreviewTile id="C36 · WorkflowBadge · on-track"><WorkflowBadge status="on-track" /></PreviewTile>
  </div></div>;
}

function PreviewSection({ id, eyebrow, title, theme, onThemeChange, children }: { id: string; eyebrow: string; title: string; theme: PreviewTheme; onThemeChange: (theme: PreviewTheme) => void; children: ReactNode }) {
  return <section id={id} className="preview-section"><div className="preview-section__heading"><div><p>{eyebrow}</p><h2>{title}</h2></div><label className="preview-theme-control"><span>Theme</span><select aria-label={`${id} preview theme`} value={theme} onChange={(event) => onThemeChange(event.target.value as PreviewTheme)}>{previewThemes.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label></div>{children}</section>;
}

function ReferenceCluster({ number, title, subtitle, ids }: { number: string; title: string; subtitle: string; ids: string }) {
  return <div className="reference-cluster-heading"><span className="reference-cluster-heading__number">{number}</span><div><h3>{title} <small>{subtitle}</small></h3><p>{ids} · mapped reference components</p></div></div>;
}

function PreviewTile({ id, children }: { id: string; children: ReactNode }) {
  return <article className="preview-tile" data-component={id}><h4>{id}</h4><div className="preview-tile__canvas">{children}</div></article>;
}

function App() {
  const [active, setActive] = useState("global");
  const [theme, setTheme] = useState<PreviewTheme>("default");
  return <div data-infisson data-theme={theme} className="preview-app"><header className="preview-header"><div><BrandMark /><p>Private Apache-2.0 component library · live unified preview</p></div><nav aria-label="Preview sections">{[["global", "Global"], ["detail", "Detail"], ["workflow", "Workflow"]].map(([id, label]) => <a key={id} className={active === id ? "is-active" : ""} href={`#${id}`} onClick={() => setActive(id)}>{label}</a>)}</nav></header><main><GlobalPreview theme={theme} onThemeChange={setTheme} /><DetailPreview theme={theme} onThemeChange={setTheme} /><WorkflowPreview theme={theme} onThemeChange={setTheme} /></main><footer className="preview-footer">Every completed component is documented in Chinese and English under <code>docs/components/</code>.</footer></div>;
}

function BrandMark() { return <div className="preview-brand"><span aria-hidden="true">••</span><strong>infission_ui</strong></div>; }

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);




