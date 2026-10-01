import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  /** Stable prefix shared with TabPanel for accessible tab/panel relationships. */
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  "aria-label"?: string;
  className?: string;
}

export function Tabs({ items, id, value, defaultValue, onValueChange, className, "aria-label": ariaLabel = "Tabs" }: TabsProps) {
  const generatedId = useId();
  const rootId = id ?? generatedId;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const firstEnabled = items.find((item) => !item.disabled)?.id ?? "";
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled);
  const selected = value ?? internalValue;

  function select(next: string) {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const enabled = items.map((item, itemIndex) => ({ item, itemIndex })).filter(({ item }) => !item.disabled);
    const current = enabled.findIndex(({ itemIndex }) => itemIndex === index);
    if (current < 0) return;
    const nextIndex = event.key === "ArrowRight" ? (current + 1) % enabled.length : event.key === "ArrowLeft" ? (current - 1 + enabled.length) % enabled.length : event.key === "Home" ? 0 : event.key === "End" ? enabled.length - 1 : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    const next = enabled[nextIndex];
    tabRefs.current[next.itemIndex]?.focus();
  }

  return (
    <div className={["inf-tabs", className ?? ""].filter(Boolean).join(" ")} role="tablist" aria-label={ariaLabel}>
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={(element) => { tabRefs.current[index] = element; }}
          id={`${rootId}-${item.id}`}
          type="button"
          role="tab"
          aria-selected={selected === item.id}
          aria-controls={`${rootId}-${item.id}-panel`}
          tabIndex={selected === item.id ? 0 : -1}
          disabled={item.disabled}
          className="inf-tabs__trigger"
          onClick={() => select(item.id)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          {item.label}{typeof item.count === "number" ? <span className="inf-tabs__count">{item.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

export interface TabPanelProps {
  tabId: string;
  active: boolean;
  labelledBy: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ tabId, active, labelledBy, children, className }: TabPanelProps) {
  return <div id={tabId} role="tabpanel" aria-labelledby={labelledBy} hidden={!active} tabIndex={active ? 0 : -1} className={className}>{children}</div>;
}
