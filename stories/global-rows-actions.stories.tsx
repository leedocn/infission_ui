import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  CardFooterActions,
  CompactProjectRow,
  CountBadge,
  IconButtonSet,
  LinearProgress,
  RiskBadge,
  StatusPillSet,
} from "infisson_ui";

const ArrowIcon = () => <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>;
const MoreIcon = () => <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><circle cx="3" cy="8" r="1.25" /><circle cx="8" cy="8" r="1.25" /><circle cx="13" cy="8" r="1.25" /></svg>;

const meta = {
  title: "Infisson UI/Global/Rows and actions",
  parameters: {
    docs: {
      description: {
        component: "A31-A37 share the same source as the standalone preview. Status badges and progress are display-only; row/action controls call host callbacks. / A31-A37 与独立预览共用源码。状态徽标和进度条只展示；行和操作控件通过回调交给宿主。",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusPills: Story = {
  render: () => {
    const [value, setValue] = useState("all");
    return <StatusPillSet items={[{ value: "all", label: "All", tone: "neutral" }, { value: "review", label: "Under review", tone: "warning" }, { value: "risk", label: "At risk", tone: "danger" }]} value={value} onChange={setValue} />;
  },
};

export const DisplayMarkers: Story = {
  render: () => <div style={{ display: "flex", gap: 12, alignItems: "center" }}><RiskBadge level="high" /><RiskBadge level="medium" /><RiskBadge level="low" /><CountBadge value={128} label="projects" /></div>,
};

export const Progress: Story = { render: () => <div style={{ maxWidth: 360 }}><LinearProgress value={78} showValue label="Permit progress" /></div> };

export const IconActions: Story = {
  render: () => <IconButtonSet ariaLabel="Project actions" items={[{ id: "open", label: "Open project", icon: <ArrowIcon />, onClick: () => undefined }, { id: "more", label: "More actions", icon: <MoreIcon />, menuItems: [{ id: "archive", label: "Archive project" }, { id: "duplicate", label: "Duplicate project" }] }]} />,
};

export const ProjectRow: Story = {
  render: () => <CompactProjectRow project={{ id: "PL-2841", title: "18 Meridian Way", address: "Nova Ridge, NR", status: "under-review", due: "Oct 2", blocker: "Missing docs", risk: "high" }} onOpen={() => undefined} />,
};

export const FooterActions: Story = {
  render: () => <CardFooterActions actions={[{ id: "open", label: "Open project", variant: "outline", onClick: () => undefined }, { id: "review", label: "Review risks", variant: "brand", onClick: () => undefined }]} />,
};

