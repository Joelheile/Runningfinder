import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AddRun from "@/components/Runs/AddRunLogic";
import { Club } from "@/lib/types/Club";

const mockClub: Club = {
  id: "1",
  name: "Test Club",
  description: "A test club",
  websiteUrl: "https://testclub.com",
  instagramUsername: "testclub",
  slug: "",
  location: {
    lat: 0,
    lng: 0,
  },
  creationDate: "",
  memberCount: 0,
  avatarFileId: "",
  avatarUrl: "",
};

describe("AddRunState Component", () => {
  it("should render the form with initial state", () => {
    render(<AddRun club={mockClub} />);
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Difficulty")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Weekday")).toBeInTheDocument();
    expect(screen.getByLabelText("Start Time")).toBeInTheDocument();
    expect(screen.getByLabelText("Distance")).toBeInTheDocument();
  });

  it("should update the name state on input change", () => {
    render(<AddRun club={mockClub} />);
    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: "Morning Run" } });
    expect(nameInput).toHaveValue("Morning Run");
  });

  it("should show an error toast when submitting with empty fields", () => {
    render(<AddRun club={mockClub} />);
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
    expect(screen.getByText("You are missing some important fields!")).toBeInTheDocument();
  });
});