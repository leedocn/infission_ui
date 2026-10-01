import { fireEvent, render, screen } from "@testing-library/react";
import { AppShell } from "./index";

describe("AppShell composition (A01-A08)", () => {
  const navGroups = [{ id: "main", items: [{ id: "overview", label: "Overview" }, { id: "projects", label: "Projects", count: 128 }] }, { id: "permitting", label: "PERMITTING", items: [{ id: "permits", label: "Permits", count: 47 }] }, { id: "workspace", label: "WORKSPACE", items: [{ id: "settings", label: "Settings" }] }];

  it("composes brand, workspace, grouped navigation, AI and user regions", () => {
    render(<AppShell workspace={{ id: "northstar", name: "Northstar Works", location: "Nova Ridge, NR" }} navGroups={navGroups} activeItem="projects" aiWidget={{ count: 7 }} user={{ name: "Avery Chen", initials: "AC" }}><h1>Dashboard content</h1></AppShell>);
    expect(screen.getByText("infission")).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Application navigation" })).toBeVisible();
    expect(screen.getByRole("button", { name: /^Projects/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("switch", { name: "Enable infission AI" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Avery Chen" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Dashboard content" })).toBeVisible();
  });

  it("supports navigation callbacks and sidebar collapse", () => {
    const onNavigate = vi.fn();
    const onSidebarOpenChange = vi.fn();
    render(<AppShell workspace={{ id: "northstar", name: "Northstar Works" }} navGroups={navGroups} onNavigate={onNavigate} onSidebarOpenChange={onSidebarOpenChange}><span>Content</span></AppShell>);
    fireEvent.click(screen.getByRole("button", { name: /^Projects/ }));
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ id: "projects" }));
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));
    expect(onSidebarOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("navigation", { name: "Application navigation" })).not.toBeInTheDocument();
  });
});


