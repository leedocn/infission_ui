import { render, screen } from "@testing-library/react";
import { ScoreGauge } from "./score-gauge";

describe("ScoreGauge", () => {
  it("clamps values to the range", () => {
    render(<ScoreGauge value={120} label="Compliance" />);
    expect(screen.getByRole("img")).toHaveAccessibleName("Compliance: 100%");
  });

  it("shows an explicit no-data state", () => {
    render(<ScoreGauge value={null} label="Compliance" />);
    expect(screen.getByRole("img")).toHaveAccessibleName("Compliance: No data");
    expect(screen.getByText("—")).toBeVisible();
  });
});
