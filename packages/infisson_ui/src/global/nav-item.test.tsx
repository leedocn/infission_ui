import { fireEvent, render, screen } from "@testing-library/react";
import { NavItem } from "./index";

describe("NavItem interactions (A04-A06)", () => {
  it("emits a click while preserving the controlled active semantics", () => {
    const onClick = vi.fn();
    render(<NavItem label="Projects" active onClick={onClick} count={128} />);
    const item = screen.getByRole("button", { name: /Projects 128/ });
    expect(item).toHaveAttribute("aria-current", "page");
    fireEvent.click(item);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("uses native button semantics and disabled state", () => {
    const onClick = vi.fn();
    render(<><NavItem label="Overview" onClick={onClick} /><NavItem label="Inspections" disabled onClick={onClick} /></>);
    fireEvent.click(screen.getByRole("button", { name: "Overview" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Inspections" })).toBeDisabled();
  });

  it("does not expose an href when disabled", () => {
    const { container } = render(<NavItem label="Projects" href="#projects" disabled />);
    const link = container.querySelector("a");
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveAttribute("aria-disabled", "true");
  });
});
