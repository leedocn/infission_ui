import { fireEvent, render, screen } from "@testing-library/react";
import { NotificationButton } from "./index";

describe("NotificationButton interactions (A10)", () => {
  it("calls the host callback when activated", () => {
    const onClick = vi.fn();
    render(<NotificationButton unreadCount={3} onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Notifications" });
    expect(button).toHaveAttribute("type", "button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("caps the unread badge at 9+ and supports a custom label", () => {
    render(<NotificationButton unreadCount={12} label="Project alerts" />);
    expect(screen.getByRole("button", { name: "Project alerts" })).toBeVisible();
    expect(screen.getByText("9+")).toBeVisible();
  });

  it("does not render a badge for zero or negative counts", () => {
    const { rerender } = render(<NotificationButton unreadCount={0} />);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    rerender(<NotificationButton unreadCount={-1} />);
    expect(screen.queryByText("9+")).not.toBeInTheDocument();
  });
});
