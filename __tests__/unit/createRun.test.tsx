import { createRun } from "@/components/Testing/CreateRun";
import { Run } from "@/lib/types/Run";

describe("createRun function", () => {
  it("should return an error message if any field is missing", () => {
    const result = createRun({
      name: "Test Run",
      difficulty: "easy",
      clubId: "club123",
      location: { lat: 52.52, lng: 13.405 },
      interval: "weekly",
      intervalDay: 3,
      startDescription: "",
      startTime: "",
      distance: 5,
      membersOnly: false,
    });

    expect(result).toBe("Please fill out all fields");
  });

  it("should return a Run object if all fields are provided", () => {
    const result = createRun({
      name: "Test Run",
      difficulty: "easy",
      clubId: "club123",
      location: { lat: 52.52, lng: 13.405 },
      interval: "weekly",
      intervalDay: 3,
      startDescription: "Start your day with a run",
      startTime: "10:00 AM",
      distance: 5,
      membersOnly: false,
    });

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name", "Test Run");
    expect(result).toHaveProperty("difficulty", "easy");
    expect(result).toHaveProperty("clubId", "club123");
    expect(result).toHaveProperty("location");
    expect(result).toHaveProperty("interval", "weekly");
    expect(result).toHaveProperty("intervalDay", 3);
    expect(result).toHaveProperty(
      "startDescription",
      "Start your day with a run"
    );
    expect(result).toHaveProperty("startTime", "10:00 AM");
    expect(result).toHaveProperty("distance", 5);
    expect(result).toHaveProperty("membersOnly", false);
    expect(result).toHaveProperty("date", null);
  });
});
