import { fireEvent, render, screen } from "@testing-library/react";
import { SearchField } from "./index";

describe("SearchField interactions (A09)", () => {
  it("keeps input state and submits the current query", () => {
    const onSubmit = vi.fn();
    render(<SearchField onSubmit={onSubmit} />);
    const input = screen.getByRole("textbox", { name: "Search projects" });
    expect(document.querySelector(".inf-global-search__icon svg")).toBeTruthy();
    expect(screen.getByLabelText("Submit search")).toBeVisible();
    fireEvent.change(input, { target: { value: "Meridian Way" } });
    fireEvent.submit(input.closest("form")!);
    expect(onSubmit).toHaveBeenCalledWith("Meridian Way");
  });

  it("reports changes for controlled consumers", () => {
    const onChange = vi.fn();
    render(<SearchField value="Nova Ridge" onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox", { name: "Search projects" }), { target: { value: "Nova Ridge NR" } });
    expect(onChange).toHaveBeenCalledWith("Nova Ridge NR");
  });

  it("does not accept input while disabled", () => {
    const onSubmit = vi.fn();
    render(<SearchField disabled onSubmit={onSubmit} />);
    const input = screen.getByRole("textbox", { name: "Search projects" });
    expect(input).toBeDisabled();
    fireEvent.submit(input.closest("form")!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("accepts a readable custom keyboard hint", () => {
    render(<SearchField shortcut="Enter" />);
    expect(screen.getByLabelText("Submit search, Enter")).toBeVisible();
  });
});


