import { useEffect, useId, useRef, type ReactNode } from "react";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, title, description, children, actions, className }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const handleCancel = (event: Event) => { event.preventDefault(); onOpenChange(false); };
    const handleClose = () => { if (open) onOpenChange(false); };
    element.addEventListener("cancel", handleCancel);
    element.addEventListener("close", handleClose);
    return () => { element.removeEventListener("cancel", handleCancel); element.removeEventListener("close", handleClose); };
  }, [onOpenChange, open]);

  if (!open) return null;
  return (
    <dialog ref={ref} className={["inf-dialog", className ?? ""].filter(Boolean).join(" ")} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}>
      <div className="inf-dialog__inner">
        <div className="inf-dialog__header">
          <div>
            <h2 id={titleId} className="inf-dialog__title">{title}</h2>
            {description ? <p id={descriptionId} className="inf-dialog__description">{description}</p> : null}
          </div>
          <button className="inf-dialog__close" type="button" aria-label="Close dialog" onClick={() => onOpenChange(false)}>×</button>
        </div>
        {children ? <div className="inf-dialog__content">{children}</div> : null}
        {actions ? <div className="inf-dialog__actions">{actions}</div> : null}
      </div>
    </dialog>
  );
}
