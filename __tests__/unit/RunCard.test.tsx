/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RunCardUI from "@/components/Runs/RunCardUI";

describe("RunCardUI Props", () => {
  const defaultProps = {
    intervalDay: 3,
    name: "Morning Run",
    time: "10:00 AM",
    distance: 5,
    difficulty: "Easy",
    startDescription: "Start your day with a run",
    googleMapsUrl: "https://maps.google.com",
    likeFilled: false,
    handleRegistration: jest.fn(),
    handleDeleteRun: jest.fn(),
  };

  it("should render with correct props", () => {
    const { getByText } = render(<RunCardUI {...defaultProps} />);

    expect(getByText("Morning Run")).toBeInTheDocument();
    expect(getByText("10:00 AM")).toBeInTheDocument();
    expect(getByText("5 km")).toBeInTheDocument();
    expect(getByText("Start your day with a run")).toBeInTheDocument();
  });
});
