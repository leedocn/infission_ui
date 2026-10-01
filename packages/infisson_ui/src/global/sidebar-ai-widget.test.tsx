import { fireEvent, render, screen } from "@testing-library/react";
import { SidebarAIWidget } from "./index";

describe("SidebarAIWidget interactions (A07)", () => {
  it("toggles without a host callback and can start disabled", () => {
    render(<SidebarAIWidget defaultEnabled={false} onAction={() => undefined} />);
    const toggle = screen.getByRole("switch", { name: "Enable infission AI" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("button", { name: "Review risks" })).toBeDisabled();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("button", { name: "Review risks" })).toBeEnabled();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("requests controlled state changes without overriding the host", () => {
    const onChange = vi.fn();
    const { rerender } = render(<SidebarAIWidget enabled onEnabledChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    rerender(<SidebarAIWidget enabled={false} onEnabledChange={onChange} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("emits one action per click, and blocks actions while paused", () => {
    const onAction = vi.fn();
    render(<SidebarAIWidget onAction={onAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Review risks" }));
    expect(onAction).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole("switch"));
    fireEvent.click(screen.getByRole("button", { name: "Review risks" }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it("blocks changes when disabled and disables unwired actions", () => {
    const onChange = vi.fn();
    render(<SidebarAIWidget disabled onEnabledChange={onChange} />);
    expect(screen.getByRole("switch")).toBeDisabled();
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Review risks" })).toBeDisabled();
  });
});
