import { getDifficultyInfo } from "@/lib/utils/getDifficultyInfo";
import { weekdays } from "@/lib/utils/weekdays";
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
    <div className="sticky top-0 z-[50] md:z-[60] bg-white/80 backdrop-blur-sm w-full border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="md:grid md:grid-cols-[1fr_auto_auto] gap-4 items-start">
          <div className="block md:hidden">
            <div className="flex flex-col gap-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Find Your Perfect Run
                </h2>
                <p className="text-sm text-gray-600">
                  Select days and difficulty to get started
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {weekdays.map((day) => (
                    <button
                      key={day.value}
                      onClick={() =>
                        setSelectedDays(
                          selectedDays.includes(day.value)
                            ? selectedDays.filter((d) => d !== day.value)
                            : [...selectedDays, day.value],
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
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-center gap-2">
                  {["easy", "intermediate", "advanced"].map((level) => {
                    const info = getDifficultyInfo(level);
                    return (
                      <Tooltip key={level}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() =>
                              setDifficulty(difficulty === level ? null : level)
                            }
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all border ${
                              difficulty === level
                                ? `${info.style} ${info.hoverStyle}`
                                : `bg-gray-100 text-gray-700 hover:bg-gray-200`
                            }`}
                          >
                            <span>{info.icon}</span>
                            <span className="capitalize">
                              {difficulty === level ? `${level} ` : level}
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="text-sm">{info.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedDays([]);
                      setSearchQuery("");
                      setDifficulty(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 w-full"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reset filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="hidden md:flex md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {weekdays.map((day) => (
                <Tooltip key={day.value}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() =>
                        setSelectedDays(
                          selectedDays.includes(day.value)
                            ? selectedDays.filter((d) => d !== day.value)
                            : [...selectedDays, day.value],
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
                          <span>
                            {info.icon}{" "}
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </span>
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

          <div className="hidden md:flex items-start">
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
