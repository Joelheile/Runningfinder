import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "./ui/slider";

interface FilterBarUIProps {
  allowedDistances: number[];
  distanceIndex: number;
  selectedDays: number[];
  toggleDay: (dayValue: number) => void;
  setDistanceIndex: (index: number) => void;
}

export default function FilterBarUI({
  allowedDistances,
  distanceIndex,
  selectedDays,
  toggleDay,
  setDistanceIndex,
}: FilterBarUIProps) {
  const weekdays = [
    { name: "Monday", index: 1 },
    { name: "Tuesday", index: 2 },
    { name: "Wednesday", index: 3 },
    { name: "Thursday", index: 4 },
    { name: "Friday", index: 5 },
    { name: "Saturday", index: 6 },
    { name: "Sunday", index: 7 },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm absolute bottom-0 left-0 z-10 w-full text-card-foreground shadow-lg p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="space-y-4">
          <label className="font-semibold text-lg">When are you free?</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Select Days
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full sm:w-auto p-4">
              <div className="space-y-2">
                {weekdays.map((day) => (
                  <div key={day.index} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.name}
                      checked={selectedDays.includes(day.index)}
                      onCheckedChange={() => toggleDay(day.index)}
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
        <div className="space-y-4">
          <label className="font-semibold text-lg">
            Your preferred distance (km)
          </label>
          <div className="p-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md">
            <Slider
              id="distance-filter"
              min={0}
              max={allowedDistances.length - 1}
              step={1}
              value={[distanceIndex]}
              onValueChange={(value) => setDistanceIndex(value[0])}
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
    </div>
  );
}
