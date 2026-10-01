import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, UserProfileCard } from "infisson_ui";

const meta = { title: "Infisson UI/A08 UserProfileCard", component: UserProfileCard } satisfies Meta<typeof UserProfileCard>;
export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveExample() {
  const [open, setOpen] = useState(false);
  const [lastAction, setLastAction] = useState("");
  return <div style={{ width: 280 }}><UserProfileCard name="Avery Chen" role="Operations Manager" avatarUrl="/references/infission/avatar-avery-chen.svg" onClick={() => setOpen((value) => !value)} moreActions={[{ id: "profile", label: "View profile", onSelect: () => setLastAction("Profile details opened") }, { id: "settings", label: "Account settings", onSelect: () => setLastAction("Account settings opened") }]} />{open && <div role="status" style={{ padding: 12 }}>Profile actions opened <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Close</Button></div>}{lastAction && <p role="status">{lastAction}</p>}</div>;
}
export const Interactive: Story = { render: () => <InteractiveExample /> };
export const WithAvatar: Story = { args: { name: "Mira Solis", role: "Design lead", avatarUrl: "/references/infission/avatar-avery-chen.svg" } };

