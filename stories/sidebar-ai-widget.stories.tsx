import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SidebarAIWidget } from "infisson_ui";

const meta = {
  title: "Infisson UI/A07 SidebarAIWidget",
  component: SidebarAIWidget,
  args: { count: 7 },
} satisfies Meta<typeof SidebarAIWidget>;
export default meta;
type Story = StoryObj<typeof meta>;

function ControlledExample() {
  const [enabled, setEnabled] = useState(true);
  const [reviewed, setReviewed] = useState(false);
  return <div style={{ width: 280 }}><SidebarAIWidget count={7} enabled={enabled} onEnabledChange={setEnabled} onAction={() => setReviewed(true)} /><p role="status">{enabled ? "AI enabled" : "AI paused"}{reviewed ? " · Demo risks opened" : ""}</p></div>;
}
export const Controlled: Story = { render: () => <ControlledExample /> };
export const Uncontrolled: Story = { args: { defaultEnabled: false, onAction: () => undefined } };
export const Disabled: Story = { args: { disabled: true } };
