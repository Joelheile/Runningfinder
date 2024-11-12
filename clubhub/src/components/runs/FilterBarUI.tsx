import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "../ui/slider";
import { weekdays } from "@/lib/weekdays";

interface FilterBarUIProps {
  allowedDistances: number[];
  distanceIndex: number | null;
  selectedDays: number[];
  toggleDay: (dayValue: number) => void;
  setDistanceIndex: (index: number | null) => void;
  difficulty: string | null;
  setDifficulty: (value: string | null) => void;
  resetFilters: () => void;
}

export default function FilterBarUI({
  allowedDistances,
  distanceIndex,
  selectedDays,
  toggleDay,
  setDistanceIndex,
  difficulty,
  setDifficulty,
  resetFilters,
}: FilterBarUIProps) {
  const difficulties = ["easy", "intermediate", "advanced"];

  return (
    <div className="bg-white/90 backdrop-blur-sm absolute bottom-0 left-0 z-10 w-full text-card-foreground shadow-lg p-6 space-y-6">
      <div className=" flex-col space-y-4">
        <div className="flex flex-row gap-x-5 w-auto ">
          <div className="space-y-4 flex flex-col w-1/3">
            <label className="font-semibold text-lg">When are you free?</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className=" sm:w-auto">
                  Select Days
                </Button>
              </PopoverTrigger>
              <PopoverContent className=" p-4">
                <div className="space-y-2">
                  {weekdays.map((day) => (
                    <div
                      key={day.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={day.name}
                        checked={selectedDays.includes(day.value)}
                        onCheckedChange={() => toggleDay(day.value)}
                      />
                      <label
                        htmlFor={day.name}
                        className="font-medium leading-none"
                      >
                        {day.name}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-4 w-2/3">
            <label className="font-semibold text-lg">
              Your preferred distance (km)
            </label>
            <div className="p-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md">
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
              <div className="flex mt-2 justify-between text-sm">
                {allowedDistances.map((value) => (
                  <span key={value}>{value}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <label className="font-semibold text-lg">Select Difficulty</label>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex space-x-4 mb-2 md:mb-0">
              {difficulties.map((level) => (
                <button
                  key={level}
                  className={`py-2 px-4 rounded w-full md:w-auto ${
                    difficulty === level
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() =>
                    setDifficulty(difficulty === level ? null : level)
                  }
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <div>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full md:w-auto"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
