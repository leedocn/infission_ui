import { fireEvent, render, screen } from "@testing-library/react";
import { Dialog } from "./dialog";

describe("Dialog", () => {
  it("renders content and reports close actions", () => {
    const onOpenChange = vi.fn();
    render(<Dialog open onOpenChange={onOpenChange} title="Review" description="Details">Body</Dialog>);
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Review");
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
