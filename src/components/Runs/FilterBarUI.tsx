import { Slider } from "@/components/UI/slider";
import { weekdays } from "@/lib/weekdays";

interface FilterBarUIProps {
  selectedDays: number[];
  toggleDay: (dayValue: number) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  difficulty: string | null;
  setDifficulty: (value: string | null) => void;
  resetFilters: () => void;
  allowedDistances: number[];
  distanceIndex: number | null;
  setDistanceIndex: (index: number | null) => void;
}

export default function FilterBarUI({
  selectedDays,
  toggleDay,
  searchQuery,
  setSearchQuery,
  difficulty,
  setDifficulty,
  resetFilters,
  allowedDistances,
  distanceIndex,
  setDistanceIndex,
}: FilterBarUIProps) {
  return (
    <div className="bg-white backdrop-blur-sm fixed bottom-0 left-0 z-10 w-full text-card-foreground shadow-lg">
      <div className=" mx-auto p-6">
        <div className="flex flex-row items-start justify-between gap-8">
          {/* Days Selection */}
          <div className="flex flex-col space-y-2">
            <label className="font-semibold text-lg">When are you free?</label>
            <div className="flex flex-wrap gap-2">
              {weekdays.map((day) => (
                <button
                  key={day.value}
                  onClick={() => toggleDay(day.value)}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    selectedDays.includes(day.value)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {day.name}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Slider */}
          <div className="flex-1 min-w-[300px]">
            <label className="font-semibold text-lg mb-3 block">
              Preferred distance (km)
            </label>
            <div className="p-4 border border-gray-200 rounded-md bg-white">
              <Slider
                id="distance-filter"
                min={0}
                max={allowedDistances.length - 1}
                step={1}
                value={
                  distanceIndex !== null
                    ? [distanceIndex]
                    : [allowedDistances.length - 1]
                }
                onValueChange={(value: number[]) => setDistanceIndex(value[0])}
                className="w-full"
              />
              <div className="flex mt-2 justify-between text-sm text-gray-600">
                {allowedDistances.map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="min-w-[100px]">
            <div className="flex flex-col gap-2">
              {["easy", "intermediate", "advanced"].map((level) => (
                <button
                  key={level}
                  onClick={() =>
                    setDifficulty(difficulty === level ? null : level)
                  }
                  className={`px-4 py-1.5 rounded-md transition-colors w-full text-left ${
                    difficulty === level
                      ? level === "easy"
                        ? "bg-green-500 text-white"
                        : level === "intermediate"
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={resetFilters} className="px-6">
            Reset Filters
          </Button>
        </div> */}
      </div>
    </div>
  );
}
