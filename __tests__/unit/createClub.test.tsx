import { createClub } from "@/components/Clubs/CreateClub";
import { Club } from "@/lib/types/Club";

describe("createClub function", () => {
  it("should return an error message if any field is missing", () => {
    const result = createClub({
      name: "Test Club",
      description: "A test club",
      websiteUrl: "",
      instagramUsername: "testclub",
      isUploaded: true,
    });

    expect(result).toBe("Please fill out all fields and upload an avatar");
  });

  it("should return a Club object if all fields are provided", () => {
    const result = createClub({
      name: "Test Club",
      description: "A test club",
      websiteUrl: "https://testclub.com",
      instagramUsername: "testclub",
      isUploaded: true,
    });

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name", "Test Club");
    expect(result).toHaveProperty("description", "A test club");
    expect(result).toHaveProperty("websiteUrl", "https://testclub.com");
    expect(result).toHaveProperty("instagramUsername", "testclub");
    expect(result).toHaveProperty("location");
    expect(result).toHaveProperty("memberCount", 0);
    expect(result).toHaveProperty("avatarFileId");
    expect(result).toHaveProperty("avatarUrl", "");
    expect(result).toHaveProperty("creationDate");
    expect(result).toHaveProperty("slug", "test-club");
  });
});
