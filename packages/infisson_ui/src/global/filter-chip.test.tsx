import { fireEvent, render, screen } from "@testing-library/react";
import { FilterChip } from "./index";

describe("FilterChip interactions (A14)", () => {
  it("exposes selected state and calls the selection callback", () => {
    const onClick = vi.fn();
    render(<FilterChip label="All" count={128} selected onClick={onClick} />);
    const button = screen.getByRole("button", { name: "All, 128" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("keeps remove as a separate labelled action", () => {
    const onRemove = vi.fn();
    const onClick = vi.fn();
    render(<FilterChip label="Needs review" removable onClick={onClick} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole("button", { name: "Remove Needs review" }));
    expect(onRemove).toHaveBeenCalledOnce();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("can render a non-selected chip without a count", () => {
    render(<FilterChip label="All" />);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByText("128")).not.toBeInTheDocument();
  });
});
