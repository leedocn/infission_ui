import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  JurisdictionFilter,
  ProjectCard,
  ProjectTypeFilter,
  ViewToggle,
  type ProjectCardStatus,
} from "infisson_ui";

const meta = {
  title: "Infisson UI/Global/Project browsing",
  parameters: {
    docs: {
      description: {
        component: "Interactive A23–A30 reference components. / 可交互的 A23–A30 参考组件。",
      },
    },
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const projects = {
  "under-review": { id: "PL-2841", title: "18 Meridian Way", address: "Nova Ridge, NR", jurisdiction: "Harbor County", status: "under-review" as const, progress: 78, system: "42 units", battery: "24 units", owner: "Avery Chen", due: "Oct 2" },
  delayed: { id: "PL-2796", title: "42 Willow Loop", address: "Pine Hollow, PH", jurisdiction: "Pine Hollow County", status: "delayed" as const, progress: 62, system: "56 units", battery: undefined, owner: "Avery Chen", due: "Oct 1" },
  "missing-docs": { id: "PL-2848", title: "73 Lantern Rise", address: "Nova Ridge, NR", jurisdiction: "Harbor County", status: "missing-docs" as const, progress: 41, system: "31 units", battery: undefined, owner: "Mira Solis", due: "Sep 30" },
  interconnection: { id: "PL-2803", title: "9 Juniper Trace", address: "Cedar Vale, CV", jurisdiction: "Cedar Vale County", status: "interconnection" as const, progress: 91, system: "48 units", battery: undefined, owner: "Jordan Hale", due: "Oct 6" },
  inspection: { id: "PL-2767", title: "6 Crescent Path", address: "Nova Ridge, NR", jurisdiction: "Northwind County", status: "inspection" as const, progress: 96, system: "64 units", battery: undefined, owner: "Samira Cole", due: "Oct 9" },
} satisfies Record<ProjectCardStatus, Parameters<typeof ProjectCard>[0]["project"]>;

export const JurisdictionSelection: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return <div style={{ maxWidth: 280 }}><JurisdictionFilter options={[{ value: "harbor", label: "Harbor County" }, { value: "pine-hollow", label: "Pine Hollow County" }]} value={value} onChange={setValue} /><p role="status">Selected jurisdiction: {value || "All jurisdictions"}</p></div>;
  },
};

export const ProjectTypeSelection: Story = {
  render: () => {
    const [value, setValue] = useState("standard");
    return <div style={{ maxWidth: 280 }}><ProjectTypeFilter options={[{ value: "standard", label: "Standard" }, { value: "commercial", label: "Commercial" }]} value={value} onChange={setValue} /><p role="status">Selected project type: {value}</p></div>;
  },
};

export const LayoutToggle: Story = {
  render: () => {
    const [value, setValue] = useState<"grid" | "list">("grid");
    return <div><ViewToggle value={value} onChange={setValue} /><p role="status">Layout: {value}</p></div>;
  },
};

export const ProjectCardVariants: Story = {
  render: () => {
    const [opened, setOpened] = useState("");
    return <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
      {(Object.entries(projects) as Array<[ProjectCardStatus, (typeof projects)[ProjectCardStatus]]>).map(([status, project]) => <div key={status}><ProjectCard project={project} onOpen={(next) => setOpened(next.id)} /><p role="status">{opened ? `Opened ${opened}` : "Choose the arrow to open"}</p></div>)}
    </div>;
  },
};



