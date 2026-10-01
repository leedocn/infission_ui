import type { HTMLAttributes, ReactNode } from "react";

export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: "sm" | "md";
  dot?: boolean;
  children: ReactNode;
}

export function Badge({ tone = "neutral", size = "md", dot = false, children, className, ...props }: BadgeProps) {
  const classes = ["inf-badge", `inf-badge--${tone}`, size === "sm" ? "inf-badge--sm" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
  return <span className={classes} {...props}>{dot ? <span className="inf-badge__dot" aria-hidden="true" /> : null}{children}</span>;
}
