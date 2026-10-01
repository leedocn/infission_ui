import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { AppShell, SidebarAIWidget, UserProfileCard } from "infisson_ui";

const meta = { title: "Infisson UI/Composition/AppShell", component: AppShell } satisfies Meta<typeof AppShell>;
export default meta;
type Story = StoryObj<typeof meta>;

const navGroups = [{ id: "main", items: [{ id: "overview", label: "Overview" }, { id: "projects", label: "Projects", count: 128 }] }, { id: "permitting", label: "PERMITTING", items: [{ id: "permits", label: "Permits", count: 47 }, { id: "documents", label: "Documents" }] }, { id: "workspace", label: "WORKSPACE", items: [{ id: "risk", label: "Risk Center", count: 7 }, { id: "settings", label: "Settings" }] }];

function InteractiveExample() {
  const [active, setActive] = useState("projects");
  return <AppShell workspace={{ id: "northstar", name: "Northstar Works", location: "Nova Ridge, NR" }} navGroups={navGroups} activeItem={active} onNavigate={(item) => setActive(item.id)} aiWidget={{ count: 7, onAction: () => undefined }} user={{ name: "Avery Chen", initials: "AC", moreActions: [{ id: "settings", label: "Account settings" }] }}><div><h2>Dashboard content</h2><p role="status">Active page: {active}</p></div></AppShell>;
}

export const Interactive: Story = { render: () => <InteractiveExample /> };
export const PrimitivesOnly: Story = { args: { workspace: { id: "northstar", name: "Northstar Works" }, navGroups, children: <SidebarAIWidget count={0} /> } };
export const CustomUser: Story = { args: { workspace: { id: "northstar", name: "Northstar Works" }, navGroups, user: { name: "Kai Morgan", role: "Operations Manager" }, children: <UserProfileCard name="Kai Morgan" role="Operations Manager" /> } };



