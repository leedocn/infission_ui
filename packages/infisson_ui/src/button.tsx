import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "brand" | "dark" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "brand", size = "md", loading = false, disabled, children, className, ...props },
  ref
) {
  const classes = ["inf-button", `inf-button--${variant}`, size !== "md" ? `inf-button--${size}` : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? <span className="inf-button__spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
});
