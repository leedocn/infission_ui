import { fireEvent, render, screen } from "@testing-library/react";
import { ProjectCard, type ProjectCardStatus } from "./index";

const makeProject = (status: ProjectCardStatus) => ({
  id: `PL-${status}`,
  title: `${status} project`,
  address: "18 Meridian Way",
  jurisdiction: "Harbor County",
  status,
  progress: status === "under-review" ? 78 : status === "delayed" ? 62 : status === "missing-docs" ? 41 : status === "interconnection" ? 91 : 96,
  system: "42 units",
  battery: status === "delayed" ? undefined : "24 units",
  owner: "Avery Chen",
  due: "Oct 2",
});

describe("ProjectCard variants and actions (A26-A30)", () => {
  it.each<[ProjectCardStatus]>([["under-review"], ["delayed"], ["missing-docs"], ["interconnection"], ["inspection"]])("renders the %s status as data, not only color", (status) => {
    const { container } = render(<ProjectCard project={makeProject(status)} />);
    expect(container.querySelector(`.inf-global-project-card--${status}`)).toBeInTheDocument();
    expect(screen.getByText(status === "under-review" ? "Under review" : status === "missing-docs" ? "Missing docs" : status === "interconnection" ? "Interconnection" : status[0].toUpperCase() + status.slice(1))).toBeVisible();
    expect(screen.getByText(`${makeProject(status).progress}%`)).toBeVisible();
  });

  it("opens a project only through the explicit card action", () => {
    const onOpen = vi.fn();
    const project = makeProject("delayed");
    render(<ProjectCard project={project} onOpen={onOpen} />);
    expect(screen.getByText("None")).toBeVisible();
    const open = screen.getByRole("button", { name: `Open ${project.title}` });
    fireEvent.click(open);
    expect(onOpen).toHaveBeenCalledWith(project);
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it("keeps missing battery data distinct from zero progress", () => {
    const project = makeProject("delayed");
    project.progress = 0;
    render(<ProjectCard project={project} />);
    expect(screen.getByText("None")).toBeVisible();
    expect(screen.getByText("0%")) .toBeVisible();
  });
});

