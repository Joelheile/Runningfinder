/**
 * @jest-environment jsdom
 */
import React from "react";
import AddClub from "@/components/Clubs/AddClubLogic";
import { fireEvent, render, screen } from "@testing-library/react";
import toast from "react-hot-toast";

const mockMutate = jest.fn();
const mockUseAddClub = jest.fn(() => ({ mutate: mockMutate }));
jest.mock("@/lib/hooks/clubs/useAddClub", () => ({
  useAddClub: mockUseAddClub,
}));
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("react-hot-toast");

describe("AddClub Component", () => {
  test("submits form when all fields are filled", () => {
    render(<AddClub />);

    fireEvent.change(screen.getByLabelText(/Club Name/i), {
      target: { value: "Test Club" },
    });
    fireEvent.change(screen.getByLabelText(/Club Description/i), {
      target: { value: "A great club" },
    });
    fireEvent.change(screen.getByLabelText(/Website URL/i), {
      target: { value: "https://testclub.com" },
    });
    fireEvent.change(screen.getByLabelText(/Instagram Username/i), {
      target: { value: "testclub" },
    });

    // Simulate avatar upload
    const avatarUploader = screen.getByLabelText(/upload/i);
    fireEvent.change(avatarUploader, { target: { checked: true } });

    fireEvent.click(screen.getByText(/Add Club/i));

    expect(mockMutate).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Club added successfully");
  });
});
