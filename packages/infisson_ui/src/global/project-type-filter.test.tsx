import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectTypeFilter } from "./index";

describe("ProjectTypeFilter interactions (A24)", () => {
  it("selects a business supplied project type", () => {
    const onChange = vi.fn();
    render(<ProjectTypeFilter options={[{ value: "standard", label: "Standard" }, { value: "commercial", label: "Commercial" }]} onChange={onChange} />);
    const select = screen.getByRole("combobox", { name: "Project type" });
    expect(select).toHaveValue("");
    fireEvent.change(select, { target: { value: "commercial" } });
    expect(select).toHaveValue("commercial");
    expect(onChange).toHaveBeenCalledWith("commercial");
  });

  it("keeps the empty option available when no type matches", () => {
    render(<ProjectTypeFilter options={[]} placeholder="Any project type" />);
    const select = screen.getByRole("combobox", { name: "Project type" });
    expect(select).toHaveDisplayValue("Any project type");
    expect(select.querySelectorAll("option")).toHaveLength(1);
  });
});


