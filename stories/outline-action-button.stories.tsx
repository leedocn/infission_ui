import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { OutlineActionButton } from "infisson_ui";

const meta = { title: "Infisson UI/A12 OutlineActionButton", component: OutlineActionButton } satisfies Meta<typeof OutlineActionButton>;
export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveExample() {
  const [opened, setOpened] = useState(false);
  return <OutlineActionButton onClick={() => setOpened(true)}>{opened ? "Package opened" : "Permit package"}</OutlineActionButton>;
}
export const Interactive: Story = { render: () => <InteractiveExample /> };
export const Disabled: Story = { args: { children: "Permit package", disabled: true } };
