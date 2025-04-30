export const getDifficultyInfo = (level: string) => {
  switch (level) {
    case "easy":
      return {
        icon: "🟢",
        description:
          "Social run, perfect for beginners. Usually under 10km at a conversational pace.",
        style: "bg-green-100 text-green-700 border-green-300",
        hoverStyle: "hover:bg-green-200",
      };
    case "intermediate":
      return {
        icon: "🟡",
        description:
          "More structured run, typically 10-15km. Good for regular runners looking for a challenge.",
        style: "bg-yellow-100 text-yellow-700 border-yellow-300",
        hoverStyle: "hover:bg-yellow-200",
      };
    case "advanced":
      return {
        icon: "🔴",
        description:
          "Technical workout (intervals, hills) or long distance run (>15km). For experienced runners.",
        style: "bg-red-100 text-red-700 border-red-300",
        hoverStyle: "hover:bg-red-200",
      };
    default:
      return {
        icon: "⚪",
        description: "",
        style: "bg-gray-100 text-gray-700",
        hoverStyle: "hover:bg-gray-200",
      };
  }
};
