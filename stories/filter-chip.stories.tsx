import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FilterChip } from "infisson_ui";

const meta = { title: "Infisson UI/A14 FilterChip", component: FilterChip } satisfies Meta<typeof FilterChip>;
export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveExample() {
  const [selected, setSelected] = useState(true);
  const [visible, setVisible] = useState(true);
  return <div>{visible ? <FilterChip label="All" count={128} selected={selected} onClick={() => setSelected((value) => !value)} removable onRemove={() => setVisible(false)} /> : <button type="button" onClick={() => setVisible(true)}>Restore filter</button>}<p role="status">{visible ? (selected ? "Selected" : "Not selected") : "Removed"}</p></div>;
}

export const Interactive: Story = { render: () => <InteractiveExample /> };
export const Selected: Story = { args: { label: "All", count: 128, selected: true } };
