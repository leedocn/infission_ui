import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchField } from "infisson_ui";

const meta = { title: "Infisson UI/A09 SearchField", component: SearchField } satisfies Meta<typeof SearchField>;
export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveExample() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  return <div style={{ maxWidth: 420 }}><SearchField value={query} onChange={setQuery} onSubmit={setSubmitted} /><p role="status">{submitted ? `Last search: ${submitted}` : "Press Enter to search"}</p></div>;
}

export const Interactive: Story = { render: () => <InteractiveExample /> };
export const Disabled: Story = { args: { disabled: true } };
