/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import AddRunState from ".@/components/Runs/AddRunLogic";
import { useAddRun } from "@/lib/hooks/runs/useAddRun";

// Mock dependencies
jest.mock("react-hot-toast", () => ({
  toast: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"),
}));

jest.mock("@/lib/hooks/runs/useAddRun", () => ({
  useAddRun: jest.fn(),
}));

describe("handleSubmit function", () => {
  let mutationMock;

  beforeEach(() => {
    mutationMock = { mutate: jest.fn() };
    (useAddRun as jest.Mock).mockReturnValue(mutationMock);
  });

  test("submits form data if all fields are filled", () => {
    render(
      <AddRunState
        club={{ id: "club123" }}
        initialValues={{
          name: "Test Run",
          difficulty: "easy",
          startTime: "10:00",
          distance: 5,
          location: { lat: 52.52, lng: 13.405 },
          interval: "weekly",
          intervalDay: "Monday",
          startDescription: "",
          membersOnly: false,
        }}
      />
    );

    // Simulate form submission
    const formElement = document.querySelector("form");
    if (formElement) {
      fireEvent.submit(formElement);
    }

    // Check that toast was not called
    expect(toast).not.toHaveBeenCalled();

    // Check that mutation.mutate was called with correct data
    expect(mutationMock.mutate).toHaveBeenCalledWith({
      name: "Test Run",
      difficulty: "easy",
      clubId: "club123",
      location: { lat: 52.52, lng: 13.405 },
      interval: "weekly",
      intervalDay: "Monday",
      startDescription: "",
      startTime: "10:00",
      distance: 5,
      id: "mocked-uuid",
      date: null,
      membersOnly: false,
    });
  });
});
