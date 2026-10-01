import { fireEvent, render, screen } from "@testing-library/react";
import { JurisdictionFilter } from "./index";

describe("JurisdictionFilter interactions (A23)", () => {
  const options = [
    { value: "northstar", label: "Harbor County" },
    { value: "pine-hollow", label: "Pine Hollow County" },
  ];

  it("changes and clears the selected jurisdiction", () => {
    const onChange = vi.fn();
    const onClear = vi.fn();
    render(<JurisdictionFilter options={options} onChange={onChange} onClear={onClear} />);
    const select = screen.getByRole("combobox", { name: "Jurisdiction" });
    fireEvent.change(select, { target: { value: "northstar" } });
    expect(onChange).toHaveBeenLastCalledWith("northstar");
    expect(screen.getByRole("button", { name: "Clear Jurisdiction" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Clear Jurisdiction" }));
    expect(select).toHaveValue("");
    expect(onChange).toHaveBeenLastCalledWith("");
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("supports a controlled value and disabled state", () => {
    const onChange = vi.fn();
    const { rerender } = render(<JurisdictionFilter options={options} value="pine-hollow" onChange={onChange} disabled />);
    const select = screen.getByRole("combobox", { name: "Jurisdiction" });
    expect(select).toHaveValue("pine-hollow");
    expect(select).toBeDisabled();
    expect(screen.getByRole("button", { name: "Clear Jurisdiction" })).toBeDisabled();
    fireEvent.change(select, { target: { value: "northstar" } });
    expect(onChange).not.toHaveBeenCalled();
    rerender(<JurisdictionFilter options={options} value="pine-hollow" onChange={onChange} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Jurisdiction" }), { target: { value: "northstar" } });
    expect(onChange).toHaveBeenCalledWith("northstar");
  });
});

