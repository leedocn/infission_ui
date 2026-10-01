import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders tone, size, and optional dot", () => {
    render(<Badge tone="success" size="sm" dot>Ready</Badge>);
    expect(screen.getByText("Ready")).toHaveClass("inf-badge--success", "inf-badge--sm");
    expect(document.querySelector(".inf-badge__dot")).toHaveAttribute("aria-hidden", "true");
  });
});
