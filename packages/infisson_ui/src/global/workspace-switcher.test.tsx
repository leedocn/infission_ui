import { fireEvent, render, screen } from "@testing-library/react";
import { WorkspaceSwitcher } from "./index";

const workspace = { id: "northstar", name: "Northstar Works", location: "Nova Ridge, NR" };
const options = [{ id: "bluefern", name: "Bluefern Studio", location: "Bluefern, BF" }, { id: "cedarline", name: "Cedarline Group", location: "Cedarline, CL" }];

describe("WorkspaceSwitcher interactions (A02)", () => {
  it("opens, selects an option, and closes the menu", () => {
    const onChange = vi.fn();
    render(<WorkspaceSwitcher workspace={workspace} options={options} onChange={onChange} />);
    const trigger = screen.getByRole("button", { name: /Northstar Works/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("menuitem", { name: /Bluefern Studio/ }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(options[0]);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and returns focus to the trigger", () => {
    render(<WorkspaceSwitcher workspace={workspace} options={options} />);
    const trigger = screen.getByRole("button", { name: /Northstar Works/ });
    fireEvent.click(trigger);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(trigger);
  });

  it("closes when the pointer leaves the control", () => {
    render(<WorkspaceSwitcher workspace={workspace} options={options} />);
    const trigger = screen.getByRole("button", { name: /Northstar Works/ });
    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("supports controlled open state and disabled state", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<WorkspaceSwitcher workspace={workspace} options={options} open onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole("button", { name: /Northstar Works/ });
    expect(screen.getByRole("menu")).toBeVisible();
    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    rerender(<WorkspaceSwitcher workspace={workspace} options={options} disabled />);
    expect(screen.getByRole("button", { name: /Northstar Works/ })).toBeDisabled();
  });
});

