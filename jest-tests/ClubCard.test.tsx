/**
 * @jest-environment jsdom
 */

import ClubCard from "@/components/Clubs/ClubCard";

import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";

describe("ClubCard Props", () => {
  const defaultProps = {
    avatarUrl: "https://example.com/avatar.png",
    name: "Test Club",
    description: "A great club",
    instagramUsername: "testclub",
    websiteUrl: "https://testclub.com",
    stravaUsername: "testclub",
  };

  it("should render with correct props", () => {
    const { getAllByText, getByText } = render(<ClubCard {...defaultProps} />);

    const nameElements = getAllByText("Test Club");
    expect(nameElements.length).toBeGreaterThan(0);

    const descriptionElements = getAllByText("A great club");
    expect(descriptionElements.length).toBeGreaterThan(0);
  });
});
