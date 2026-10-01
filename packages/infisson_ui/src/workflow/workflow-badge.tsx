import { Badge } from "../badge";
import type { WorkflowStatus } from "./types";

const labels: Record<WorkflowStatus, string> = { ready: "Ready", connected: "Connected", passed: "Passed", submitted: "Submitted", complete: "Complete", "on-track": "On track" };
const tones: Record<WorkflowStatus, "neutral" | "brand" | "success" | "warning" | "danger"> = { ready: "brand", connected: "success", passed: "success", submitted: "brand", complete: "success", "on-track": "success" };

export interface WorkflowBadgeProps { status: WorkflowStatus; label?: string; dot?: boolean; }
export function WorkflowBadge({ status, label, dot = true }: WorkflowBadgeProps) { return <Badge className={`inf-workflow-badge--${status}`} tone={tones[status]} dot={dot}>{label ?? labels[status]}</Badge>; }
