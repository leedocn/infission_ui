import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, NotificationButton } from "infisson_ui";

const meta = { title: "Infisson UI/A10 NotificationButton", component: NotificationButton } satisfies Meta<typeof NotificationButton>;
export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveExample() {
  const [open, setOpen] = useState(false);
  return <div><NotificationButton unreadCount={3} onClick={() => setOpen((value) => !value)} />{open && <div role="status" style={{ marginTop: 12 }}>Notifications opened <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Close</Button></div>}</div>;
}

export const Interactive: Story = { render: () => <InteractiveExample /> };
export const Empty: Story = { args: { unreadCount: 0 } };
export const LargeCount: Story = { args: { unreadCount: 12 } };
