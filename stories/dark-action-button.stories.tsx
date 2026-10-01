import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { DarkActionButton } from "infisson_ui";

const meta = { title: "Infisson UI/A11 DarkActionButton", component: DarkActionButton } satisfies Meta<typeof DarkActionButton>;
export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveExample() {
  const [created, setCreated] = useState(false);
  return <DarkActionButton onClick={() => setCreated(true)}>{created ? "Created" : "New project"}</DarkActionButton>;
}
export const Interactive: Story = { render: () => <InteractiveExample /> };
export const Loading: Story = { args: { children: "Creating project", loading: true } };
