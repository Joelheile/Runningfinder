import calculateCalories from "@/components/Runs/CaloriesCalculator";

describe("Test calculateCalories helper function", () => {
  it("should calculate calories for easy run", () => {
    const difficulty = "easy";
    const distance = 5;

    const result = calculateCalories(difficulty, distance);
    expect(result).toBe(300);
  });

  it("Should calculate calories for intermediate run", () => {
    const difficulty = "intermediate";
    const distance = 5;
    const result = calculateCalories(difficulty, distance);
    expect(result).toBe(360);
  });

  it("Should calculate calories for advanced run", () => {
    const difficulty = "advanced";
    const distance = 5;

    const result = calculateCalories(difficulty, distance);
    expect(result).toBe(450);
  });
  it("Should calculate calories for advanced marathon", () => {
    const difficulty = "advanced";
    const distance = 42;
    const result = calculateCalories(difficulty, distance);
    expect(result).toBe(3780);
  });
});
