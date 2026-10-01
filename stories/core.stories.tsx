import type { Meta, StoryObj } from "@storybook/react";
import { Badge, Button, Dialog, ScoreGauge, Tabs } from "infisson_ui";

const meta = {
  title: "Infisson UI/Core",
  parameters: { docs: { description: { component: "基础控件与公开 Props 的可操作示例。/ Interactive examples for the public core primitives." } } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonStates: Story = { render: () => <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}><Button variant="dark">Primary</Button><Button variant="brand">Apply fix</Button><Button variant="outline">Secondary</Button><Button loading>Loading</Button><Button disabled>Disabled</Button></div> };
export const StatusAndScore: Story = { render: () => <div style={{ display: "flex", gap: 24, alignItems: "center" }}><Badge tone="success" dot>On track</Badge><Badge tone="warning" dot>Needs review</Badge><ScoreGauge value={87} label="Compliance" /></div> };
export const TabsAndDialog: Story = { render: () => <div style={{ display: "grid", gap: 16, minWidth: 420 }}><Tabs items={[{ id: "overview", label: "Overview" }, { id: "documents", label: "Documents", count: 10 }]} defaultValue="overview" /><Dialog open title="Accessible dialog" description="This story shows the shared dialog semantics." onOpenChange={() => undefined} /></div> };
