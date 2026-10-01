import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./index";

describe("StatusBadge display states (A13)", () => {
  it("maps a status to its visible label and tone", () => {
    render(<StatusBadge status="on-track" />);
    expect(screen.getByText("On track")).toBeVisible();
  });

  it("supports custom labels and sizes without becoming interactive", () => {
    render(<StatusBadge status="delayed" label="Needs review" size="md" />);
    const badge = screen.getByText("Needs review");
    expect(badge).toHaveClass("inf-badge--danger");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("covers missing-docs and complete status labels", () => {
    render(<><StatusBadge status="missing-docs" /><StatusBadge status="complete" /></>);
    expect(screen.getByText("Missing docs")).toBeVisible();
    expect(screen.getByText("Complete")).toBeVisible();
  });
});
