import { fireEvent, render, screen } from "@testing-library/react";
import { TabPanel, Tabs } from "./tabs";

describe("Tabs", () => {
  it("supports selection and arrow key focus", () => {
    const onValueChange = vi.fn();
    render(<Tabs id="test-tabs" items={[{ id: "one", label: "One" }, { id: "two", label: "Two" }]} onValueChange={onValueChange} />);
    const one = screen.getByRole("tab", { name: "One" });
    const two = screen.getByRole("tab", { name: "Two" });
    fireEvent.keyDown(one, { key: "ArrowRight" });
    expect(two).toHaveFocus();
    fireEvent.click(two);
    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(two).toHaveAttribute("aria-controls", "test-tabs-two-panel");
  });

  it("connects a panel to its tab", () => {
    render(<TabPanel tabId="test-tabs-one-panel" labelledBy="test-tabs-one" active>Content</TabPanel>);
    expect(screen.getByRole("tabpanel")).toHaveAttribute("aria-labelledby", "test-tabs-one");
  });
});
