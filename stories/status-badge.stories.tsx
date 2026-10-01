import type { Meta, StoryObj } from "@storybook/react";
import { StatusBadge } from "infisson_ui";

const meta = { title: "Infisson UI/A13 StatusBadge", component: StatusBadge } satisfies Meta<typeof StatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const OnTrack: Story = { args: { status: "on-track" } };
export const NeedsReview: Story = { args: { status: "under-review", label: "Needs review" } };
export const Complete: Story = { args: { status: "complete" } };
