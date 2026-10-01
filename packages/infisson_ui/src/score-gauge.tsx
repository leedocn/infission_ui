import { useRef, type KeyboardEvent, type PointerEvent } from "react";

export interface ScoreGaugeProps {
  value: number | null;
  min?: number;
  max?: number;
  label: string;
  variant?: "arc" | "ticks";
  formatValue?: (value: number) => string;
  /** Enables pointer and keyboard adjustment in demos and form-like contexts. */
  interactive?: boolean;
  onChange?: (value: number) => void;
  step?: number;
  className?: string;
}

export function ScoreGauge({ value, min = 0, max = 100, label, variant = "arc", formatValue = (current) => `${Math.round(current)}%`, interactive = false, onChange, step = 1, className }: ScoreGaugeProps) {
  const validRange = Number.isFinite(min) && Number.isFinite(max) && max > min;
  const finiteValue = typeof value === "number" && Number.isFinite(value) ? value : null;
  const ratio = validRange && finiteValue !== null ? Math.max(0, Math.min(1, (finiteValue - min) / (max - min))) : 0;
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - ratio);
  const displayValue = finiteValue === null || !validRange ? null : formatValue(Math.max(min, Math.min(max, finiteValue)));
  const visualRef = useRef<HTMLDivElement>(null);
  const pointerValue = (clientX: number, clientY: number) => {
    if (!interactive || !validRange || !onChange || !visualRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = (Math.atan2(clientY - centerY, clientX - centerX) + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
    const raw = min + (angle / (Math.PI * 2)) * (max - min);
    const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
    const next = Math.max(min, Math.min(max, min + Math.round((raw - min) / safeStep) * safeStep));
    onChange(Number(next.toFixed(6)));
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerValue(event.clientX, event.clientY);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (interactive && event.currentTarget.hasPointerCapture(event.pointerId)) pointerValue(event.clientX, event.clientY);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!interactive || !validRange || !onChange) return;
    const current = finiteValue === null ? min : Math.max(min, Math.min(max, finiteValue));
    const safeStep = Number.isFinite(step) && step > 0 ? step : 1;
    const next = event.key === "ArrowRight" || event.key === "ArrowUp" ? Math.min(max, current + safeStep) : event.key === "ArrowLeft" || event.key === "ArrowDown" ? Math.max(min, current - safeStep) : event.key === "Home" ? min : event.key === "End" ? max : null;
    if (next !== null) { event.preventDefault(); onChange(next); }
  };
  return (
    <div className={["inf-score-gauge", `inf-score-gauge--${variant}`, interactive ? "is-interactive" : "", className ?? ""].filter(Boolean).join(" ")} role={interactive ? "slider" : "img"} aria-label={`${label}: ${displayValue ?? "No data"}`} {...(interactive ? { tabIndex: 0, "aria-valuemin": min, "aria-valuemax": max, "aria-valuenow": finiteValue ?? min, "aria-valuetext": displayValue ?? "No data" } : {})} onKeyDown={onKeyDown}>
      <div ref={visualRef} className="inf-score-gauge__visual" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}>
        <svg className="inf-score-gauge__svg" viewBox="0 0 120 120" aria-hidden="true">
          <circle className="inf-score-gauge__track" cx="60" cy="60" r={radius} />
          <circle className="inf-score-gauge__value" cx="60" cy="60" r={radius} strokeDasharray={circumference} strokeDashoffset={dashOffset} />
        </svg>
        <div className="inf-score-gauge__text"><span className={displayValue === null ? "inf-score-gauge__empty" : "inf-score-gauge__number"}>{displayValue ?? "—"}</span></div>
      </div>
      <span className="inf-score-gauge__label">{label}</span>
    </div>
  );
}
