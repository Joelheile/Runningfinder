const calculateCalories = (difficulty: string, distance: number): number => {
  const baseCaloriesPerKm = 60;

  let difficultyMultiplier = 1;
  switch (difficulty) {
    case "easy":
      difficultyMultiplier = 1;
      break;
    case "intermediate":
      difficultyMultiplier = 1.2;
      break;
    case "advanced":
      difficultyMultiplier = 1.5;
      break;
    default:
      difficultyMultiplier = 1;
  }

  return baseCaloriesPerKm * difficultyMultiplier * distance;
};

export default calculateCalories;
