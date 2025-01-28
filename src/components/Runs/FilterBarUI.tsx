import { weekdays } from "@/lib/weekdays";
import { HelpCircle, X } from "lucide-react";
import { Button } from "../UI/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../UI/tooltip";

interface FilterBarUIProps {
  selectedDays: number[];
  setSelectedDays: (days: number[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  difficulty: string | null;
  setDifficulty: (difficulty: string | null) => void;
  toggleDay: (dayValue: number) => void;
  resetFilters: () => void;
}

const getDifficultyInfo = (level: string) => {
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

export default function FilterBarUI({
  selectedDays,
  setSelectedDays,
  searchQuery,
  setSearchQuery,
  difficulty,
  setDifficulty,
}: FilterBarUIProps) {
  const hasActiveFilters =
    selectedDays.length > 0 || difficulty !== null || searchQuery !== "";

  return (
    <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 w-full border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 items-start">
          {/* Filter elements */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Days Selection */}
            <div className="flex flex-wrap gap-1.5">
              {weekdays.map((day) => (
                <Tooltip key={day.value}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        setSelectedDays(
                          selectedDays.includes(day.value)
                            ? selectedDays.filter((d) => d !== day.value)
                            : [...selectedDays, day.value]
                        )
                      }
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all border ${
                        selectedDays.includes(day.value)
                          ? "bg-primary text-white border-primary"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-300 border-gray-200"
                      }`}
                    >
                      {day.name}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{day.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Difficulty Selection */}
            <div className="flex items-center gap-2">
              {["easy", "intermediate", "advanced"].map((level) => {
                const info = getDifficultyInfo(level);
                return (
                  <Tooltip key={level}>
                    <TooltipTrigger asChild>
                      <div className="relative group">
                        <button
                          onClick={() =>
                            setDifficulty(difficulty === level ? null : level)
                          }
                          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all border relative ${
                            difficulty === level
                              ? info.style
                              : "bg-gray-100 text-gray-700"
                          } ${difficulty !== level && info.hoverStyle}`}
                        >
                          <span className="hidden md:inline">
                            {info.icon}{" "}
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </span>
                          <span className="md:hidden">{info.icon}</span>
                          <HelpCircle className="w-3 h-3 absolute -top-1 -right-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">{info.description}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Reset button */}
          <div className="flex items-start">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedDays([]);
                  setSearchQuery("");
                  setDifficulty(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                Reset filters
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
