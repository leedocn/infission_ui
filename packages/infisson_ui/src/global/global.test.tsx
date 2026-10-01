import { fireEvent, render, screen } from "@testing-library/react";
import {
  AIRiskCard,
  AttentionTable,
  BrandLogo,
  CardFooterActions,
  CompactProjectRow,
  CountBadge,
  DarkActionButton,
  FilterChip,
  IconButtonSet,
  JurisdictionFilter,
  LinearProgress,
  NavGroup,
  NavItem,
  NotificationButton,
  OutlineActionButton,
  PackageComplianceCard,
  PortfolioStats,
  ProjectCard,
  ProjectHeroCard,
  ProjectPipeline,
  ProjectStatusFilters,
  ProjectTypeFilter,
  RiskBadge,
  SearchField,
  SidebarAIWidget,
  StatusBadge,
  StatusPillSet,
  TimeRangeControl,
  UserProfileCard,
  ViewToggle,
  WorkspaceSwitcher,
} from "./index";

describe("global reference components", () => {
  it("renders the reference-board primitives together", () => {
    const project = { id: "PL-2841", title: "18 Meridian Way", address: "Nova Ridge, NR", status: "under-review" as const, progress: 78 };
    render(<>
      <BrandLogo />
      <WorkspaceSwitcher workspace={{ id: "northstar", name: "Northstar Works" }} options={[{ id: "bluefern", name: "Bluefern Studio" }]} />
      <NavGroup label="Permitting"><NavItem label="Projects" active count={128} /></NavGroup>
      <SidebarAIWidget count={7} />
      <UserProfileCard name="Avery Chen" role="Operations Manager" />
      <SearchField />
      <NotificationButton unreadCount={2} />
      <DarkActionButton>New project</DarkActionButton><OutlineActionButton>Permit package</OutlineActionButton>
      <StatusBadge status="under-review" /><FilterChip label="All" selected count={128} /><TimeRangeControl />
      <ProjectHeroCard project={project} /><PortfolioStats stats={[{ label: "Active projects", value: 128 }]} />
      <ProjectPipeline stages={[{ label: "Design", count: 32 }, { label: "Permit", count: 47 }]} />
      <AttentionTable rows={[{ id: "PL-2796", project: "42 Willow Loop", stage: "AHJ review", blocker: "Missing docs", risk: "high" }]} />
      <AIRiskCard projectsAtRisk={7} risks={["3 are missing required documents"]} />
      <PackageComplianceCard score={94} checked={1184} flagged={31} rejected={0.8} />
      <ProjectStatusFilters options={[{ value: "all", label: "All", count: 128 }]} />
      <JurisdictionFilter options={[{ value: "northstar", label: "Harbor County" }]} />
      <ProjectTypeFilter options={[{ value: "standard", label: "Standard" }]} />
      <ViewToggle /><ProjectCard project={project} />
      <StatusPillSet items={[{ value: "track", label: "On track", tone: "success" }]} value="track" />
      <RiskBadge level="high" /><LinearProgress value={78} showValue />
      <IconButtonSet items={[{ id: "open", label: "Open" }]} /><CountBadge value={128} label="projects" />
      <CompactProjectRow project={project} /><CardFooterActions actions={[{ id: "open", label: "Open" }]} />
    </>);
    expect(screen.getByText("infission")).toBeVisible();
    expect(screen.getAllByRole("progressbar").some((element) => element.getAttribute("aria-valuenow") === "78")).toBe(true);
    expect(screen.getByRole("button", { name: "Notifications" })).toBeVisible();
  });

  it("supports controlled search, filter, and workspace interactions", () => {
    const onSearch = vi.fn();
    const onFilter = vi.fn();
    const onWorkspace = vi.fn();
    render(<>
      <SearchField onSubmit={onSearch} />
      <FilterChip label="Needs review" onClick={onFilter} />
      <WorkspaceSwitcher workspace={{ id: "a", name: "A" }} options={[{ id: "b", name: "B" }]} onChange={onWorkspace} />
    </>);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Oak" } });
    fireEvent.submit(screen.getByRole("textbox").closest("form")!);
    fireEvent.click(screen.getByRole("button", { name: /Needs review/ }));
    fireEvent.click(screen.getByRole("button", { name: /A/ }));
    fireEvent.click(screen.getByRole("menuitem", { name: "B" }));
    expect(onSearch).toHaveBeenCalledWith("Oak");
    expect(onFilter).toHaveBeenCalledOnce();
    expect(onWorkspace).toHaveBeenCalledWith({ id: "b", name: "B" });
  });
});


