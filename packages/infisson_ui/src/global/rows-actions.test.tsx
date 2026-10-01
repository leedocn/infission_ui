import { fireEvent, render, screen } from "@testing-library/react";
import {
  CardFooterActions,
  CompactProjectRow,
  CountBadge,
  IconButtonSet,
  LinearProgress,
  RiskBadge,
  StatusPillSet,
} from "./index";

describe("global row and action components (A31-A37)", () => {
  it("supports uncontrolled status selection and reports the chosen value", () => {
    const onChange = vi.fn();
    render(<StatusPillSet items={[{ value: "all", label: "All" }, { value: "risk", label: "At risk", tone: "danger" }]} defaultValue="all" onChange={onChange} />);
    const risk = screen.getByRole("button", { name: "At risk" });
    expect(screen.getByRole("group", { name: "Status" })).toBeVisible();
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(risk);
    expect(risk).toHaveAttribute("aria-pressed", "true");
    expect(onChange).toHaveBeenCalledExactlyOnceWith("risk");
  });

  it("keeps risk badges and counts display-only", () => {
    render(<><RiskBadge level="high" /><CountBadge value={128} label="projects" /></>);
    expect(screen.getByText("High")).toBeVisible();
    expect(screen.getByText("128")).toBeVisible();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("clamps linear progress and exposes an accessible percentage", () => {
    const { rerender } = render(<LinearProgress value={140} showValue />);
    const progress = screen.getByRole("progressbar", { name: "Progress" });
    expect(progress).toHaveAttribute("aria-valuenow", "100");
    expect(progress).toHaveAttribute("aria-valuetext", "100%");
    expect(screen.getByText("100%")).toBeVisible();
    rerender(<LinearProgress value={-4} max={0} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "100");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("routes icon button actions and preserves disabled semantics", () => {
    const onOpen = vi.fn();
    render(<IconButtonSet ariaLabel="Project actions" items={[{ id: "open", label: "Open project", onClick: onOpen }, { id: "share", label: "Share project", disabled: true }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Open project" }));
    expect(onOpen).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Share project" })).toBeDisabled();
    expect(screen.getByRole("group", { name: "Project actions" })).toBeVisible();
  });

  it("opens a keyboard-dismissible more menu and routes menu actions", () => {
    const onSelect = vi.fn();
    render(<IconButtonSet items={[{ id: "more", label: "More actions", menuItems: [{ id: "archive", label: "Archive project", onSelect }] }]} />);
    const trigger = screen.getByRole("button", { name: "More actions" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("menuitem", { name: "Archive project" }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(trigger);
  });

  it("emits one open action for a compact project row", () => {
    const onOpen = vi.fn();
    render(<CompactProjectRow project={{ id: "PL-2841", title: "18 Meridian Way", address: "Nova Ridge, NR", status: "under-review", due: "Oct 2", blocker: "Missing docs", risk: "high" }} onOpen={onOpen} />);
    const row = screen.getByRole("button", { name: /PL-2841.*18 Meridian Way.*Missing docs.*High.*Oct 2/ });
    fireEvent.click(row);
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("calls footer actions and prevents a loading action", () => {
    const onOpen = vi.fn();
    const onDelete = vi.fn();
    render(<CardFooterActions actions={[{ id: "open", label: "Open", onClick: onOpen }, { id: "delete", label: "Delete", variant: "danger", onClick: onDelete, loading: true }]} />);
    expect(screen.getByRole("contentinfo", { name: "Card actions" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onOpen).toHaveBeenCalledOnce();
    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
  });
});

