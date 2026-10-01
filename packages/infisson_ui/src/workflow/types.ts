import type { ReactNode } from "react";

export type WorkflowStatus = "ready" | "connected" | "passed" | "submitted" | "complete" | "on-track";

/** Connection labels supported by the workflow cards. Custom labels are also
 * accepted by `SubmissionTargetCard` for host-owned connection states. */
export type SubmissionConnection = "connected" | "disconnected" | "ready";

export interface AIFixChange {
  id: string;
  label: string;
  description?: string;
  kind?: "added" | "updated" | "removed";
}

export interface PackageDocument {
  id: string;
  name: string;
  pages?: number;
  status?: "accepted" | "verified" | "generated" | "pending";
  meta?: string;
}

export interface PackageSection {
  id: string;
  label: string;
  documents: PackageDocument[];
  complete?: boolean;
}

export interface SubmissionConfirmation {
  id: string;
  label: ReactNode;
  required?: boolean;
  defaultChecked?: boolean;
}

export interface WorkflowNextStep {
  id: string;
  label: string;
  description?: string;
}
