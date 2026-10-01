import { fireEvent, render, screen } from "@testing-library/react";
import { UserProfileCard } from "./index";

describe("UserProfileCard interactions (A08)", () => {
  it("calls the host action once on click", () => {
    const onClick = vi.fn();
    render(<UserProfileCard name="Avery Chen" role="Operations Manager" onClick={onClick} />);
    const card = screen.getByRole("button", { name: /^Avery Chen/ });
    fireEvent.click(card);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("keeps native button keyboard semantics and exposes avatar alt text", () => {
    render(<UserProfileCard name="Mira Solis" initials="ER" />);
    const card = screen.getByRole("button", { name: /^Mira Solis/ });
    expect(card).toHaveAttribute("type", "button");
    expect(screen.getByText("ER")).toBeVisible();
  });

  it("opens a labelled more-actions menu and closes after selection", () => {
    const onSelect = vi.fn();
    render(<UserProfileCard name="Avery Chen" moreActions={[{ id: "settings", label: "Account settings", onSelect }]} />);
    const more = screen.getByRole("button", { name: "More actions for Avery Chen" });
    fireEvent.click(more);
    expect(screen.getByRole("menu")).toBeVisible();
    fireEvent.click(screen.getByRole("menuitem", { name: "Account settings" }));
    expect(onSelect).toHaveBeenCalledOnce();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("uses a supplied avatar image without invoking the profile action", () => {
    const onClick = vi.fn();
    render(<UserProfileCard name="Avery Chen" avatarUrl="/avatar.svg" onClick={onClick} />);
    expect(document.querySelector('img[src="/avatar.svg"]')).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "More actions for Avery Chen" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

