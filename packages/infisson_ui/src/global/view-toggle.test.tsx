import { fireEvent, render, screen } from "@testing-library/react";
import { ViewToggle } from "./index";

describe("ViewToggle interactions (A25)", () => {
  it("switches layout and reports the selected mode", () => {
    const onChange = vi.fn();
    render(<ViewToggle defaultValue="grid" onChange={onChange} />);
    const grid = screen.getByRole("button", { name: "grid view" });
    const list = screen.getByRole("button", { name: "list view" });
    expect(grid).toHaveAttribute("aria-pressed", "true");
    expect(list).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(list);
    expect(list).toHaveAttribute("aria-pressed", "true");
    expect(grid).toHaveAttribute("aria-pressed", "false");
    expect(onChange).toHaveBeenCalledWith("list");
  });

  it("does not change a disabled toggle", () => {
    const onChange = vi.fn();
    render(<ViewToggle value="grid" onChange={onChange} disabled />);
    const list = screen.getByRole("button", { name: "list view" });
    expect(list).toBeDisabled();
    fireEvent.click(list);
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "grid view" })).toHaveAttribute("aria-pressed", "true");
  });
});
