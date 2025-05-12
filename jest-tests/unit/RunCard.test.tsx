import RunCardUI from "@/components/Runs/RunCardUI";
import { TooltipProvider } from "@/components/UI/tooltip";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";

describe("RunCardUI Props", () => {
  const defaultProps = {
    intervalDay: 3,
    name: "Morning Run",
    time: "10:00 AM",
    distance: "5",
    difficulty: "Easy",
    startDescription: "Start your day with a run",
    googleMapsUrl: "https://maps.google.com",
    likeFilled: false,
    handleRegistration: jest.fn(),
    handleDeleteRun: jest.fn(),
    id: "run-id-1",
    datetime: new Date(),
  };

  it("should render with correct props", () => {
    const { getByText } = render(
      <TooltipProvider>
        <RunCardUI {...defaultProps} />
      </TooltipProvider>,
    );

    expect(getByText("Morning Run")).toBeInTheDocument();
    expect(getByText("5 km")).toBeInTheDocument();
    expect(getByText("Start your day with a run")).toBeInTheDocument();
  });
});
