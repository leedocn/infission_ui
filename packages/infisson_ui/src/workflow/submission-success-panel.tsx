import { Button } from "../button";
import { Badge } from "../badge";
import type { SubmissionConnection, WorkflowNextStep } from "./types";
import { SubmissionTargetCard } from "./package-submit-panel";

export interface DecisionSummaryProps { estimatedDecision: string; planReview?: string; }
export function DecisionSummary({ estimatedDecision, planReview }: DecisionSummaryProps) { return <dl className="inf-workflow-decision"><div><dt>Estimated decision</dt><dd>{estimatedDecision}</dd></div>{planReview ? <div><dt>Plan review</dt><dd>{planReview}</dd></div> : null}</dl>; }

export type NotificationStatus = "success" | "pending" | "failed";
export interface NotificationReceiptCardProps { label?: string; detail?: string; simulated?: boolean; status?: NotificationStatus; }
export function NotificationReceiptCard({ label, detail, simulated = true, status = "success" }: NotificationReceiptCardProps) {
  const copy = status === "success"
    ? { label: label ?? "Homeowners notified", detail: detail ?? "A simulated notification receipt is ready for review.", tone: "success" as const }
    : status === "pending"
      ? { label: label ?? "Notification pending", detail: detail ?? "The filing succeeded; notification delivery is still pending.", tone: "warning" as const }
      : { label: label ?? "Notification failed", detail: detail ?? "The filing succeeded, but the notification could not be delivered.", tone: "danger" as const };
  return <section className="inf-workflow-receipt" role={status === "failed" ? "alert" : "status"}><Badge tone={copy.tone} dot>{copy.label}</Badge><p>{copy.detail}</p>{simulated ? <small>Demo mode · no message was sent</small> : null}</section>;
}

export interface NextStepsPanelProps { steps?: WorkflowNextStep[]; }
export function NextStepsPanel({ steps = [{ id: "review", label: "Plan review starts within a working day" }, { id: "poll", label: "infission checks the portal every 30 minutes" }, { id: "decision", label: "Decision expected in 5 to 7 days" }] }: NextStepsPanelProps) { return <section className="inf-workflow-next-steps"><h3>What happens next</h3><ol>{steps.map((step) => <li key={step.id}><span aria-hidden="true">⌁</span><div><strong>{step.label}</strong>{step.description ? <small>{step.description}</small> : null}</div></li>)}</ol></section>; }

export interface SubmissionSuccessPanelProps { referenceId: string; filedAt: string; target: string; estimatedDecision: string; planReview?: string; amount?: string; connection?: SubmissionConnection | string; notificationStatus?: NotificationStatus; notificationDetail?: string; notificationSimulated?: boolean; onDownloadReceipt?: () => void; onOpenTracker?: () => void; nextSteps?: WorkflowNextStep[]; }
export function SubmissionSuccessPanel({ referenceId, filedAt, target, estimatedDecision, planReview, amount, connection = "connected", notificationStatus = "success", notificationDetail, notificationSimulated = true, onDownloadReceipt, onOpenTracker, nextSteps }: SubmissionSuccessPanelProps) { return <section className="inf-workflow-success" aria-label="Submission success"><div className="inf-workflow-success__banner"><span aria-hidden="true">✓</span><div><h2>Filed with {target}</h2><p>Reference {referenceId} · {filedAt}{amount ? ` · ${amount}` : ""}</p></div><Badge tone="success">Complete</Badge></div><div className="inf-workflow-success__actions"><Button type="button" variant="outline" onClick={onDownloadReceipt}>Download receipt</Button><Button type="button" variant="dark" onClick={onOpenTracker}>Open permit tracker</Button></div><DecisionSummary estimatedDecision={estimatedDecision} planReview={planReview} /><SubmissionTargetCard target={target} connection={connection} compact /><NotificationReceiptCard status={notificationStatus} detail={notificationDetail} simulated={notificationSimulated} /><NextStepsPanel steps={nextSteps} /></section>; }
