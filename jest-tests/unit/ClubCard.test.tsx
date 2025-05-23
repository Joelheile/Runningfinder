/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ClubCard from "@/components/Clubs/ClubCard";

describe("ClubCard Props", () => {
  const defaultProps = {
    avatarUrl: "https://example.com/avatar.png",
    name: "Test Club",
    description: "A great club",
    instagramUsername: "testclub",
    websiteUrl: "https://testclub.com",
  };

  it("should render with correct props", () => {
    const { getByText, getByAltText } = render(<ClubCard {...defaultProps} />);

    expect(getByAltText("Test Club")).toBeInTheDocument();
    expect(getByText("Test Club")).toBeInTheDocument();
    expect(getByText("A great club")).toBeInTheDocument();
  });
});
