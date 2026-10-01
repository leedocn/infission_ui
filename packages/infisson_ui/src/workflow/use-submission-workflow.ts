import { useCallback, useEffect, useRef, useState } from "react";

export type SubmissionPhase = "ready" | "confirming" | "submitting" | "succeeded" | "failed" | "unknown";
export interface SubmissionReceipt { referenceId: string; filedAt: string; target: string; }
export type SubmissionResult = { status: "succeeded"; receipt: SubmissionReceipt } | { status: "unknown"; message: string };
export interface UseSubmissionWorkflowOptions { submit: (signal: AbortSignal) => Promise<SubmissionResult>; }

export function useSubmissionWorkflow({ submit }: UseSubmissionWorkflowOptions) {
  const [phase, setPhase] = useState<SubmissionPhase>("ready");
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const requestConfirmation = useCallback(() => { if (phase !== "submitting" && phase !== "succeeded") setPhase("confirming"); }, [phase]);
  const cancel = useCallback(() => { controller.current?.abort(); controller.current = null; setPhase("ready"); setError(null); setReceipt(null); }, []);
  const confirm = useCallback(async () => {
    if (controller.current || phase !== "confirming") return;
    const current = new AbortController(); controller.current = current; setPhase("submitting"); setError(null);
    try {
      const result = await submit(current.signal);
      if (current.signal.aborted) return;
      if (result.status === "succeeded") { setReceipt(result.receipt); setPhase("succeeded"); }
      else { setError(result.message || "The portal response could not be confirmed."); setPhase("unknown"); }
    } catch (reason) { if (!current.signal.aborted) { setError(reason instanceof Error ? reason.message : "Submission failed."); setPhase("failed"); } }
    finally { if (controller.current === current) controller.current = null; }
  }, [phase, submit]);
  return { phase, receipt, error, requestConfirmation, confirm, cancel, reset: cancel };
}
