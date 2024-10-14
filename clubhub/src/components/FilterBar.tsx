"use client";
import { useState } from "react";
import { Calendar as CalendarIcon, Sliders, RotateCcw } from "lucide-react";
import { Checkbox } from "@/src/components/ui/checkbox";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Slider } from "@/src/components/ui/slider";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function FilterBar() {
  const [distance, setDistance] = useState([0]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleReset = () => {
    setDistance([0]);
    setSelectedDays([]);
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm absolute bottom-0 left-0 z-10 w-full text-card-foreground shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 w-1/2  space-y-2">
          <label className="  ">When are you free?</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start font-normal",
                  selectedDays.length === 0 && "",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />

                {selectedDays.length === 0
                  ? "Select Days"
                  : selectedDays.length > 2
                    ? `${selectedDays.slice(0, 2).join(", ")}...`
                    : selectedDays.join(", ")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <div className="p-4 space-y-2">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={selectedDays.includes(day)}
                      onCheckedChange={() => toggleDay(day)}
                    />
                    <label htmlFor={day} className="font-medium leading-none">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex-1 space-y-2 ">
        <label className=" font-medium">Your prefered distance (km)</label>
        <div className="  pt-5 pb-1 px-4 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-sm">
          <Slider
            id="distance-filter"
            min={0}
            max={20}
            step={5}
            value={distance}
            onValueChange={setDistance}
            className="w-full"
          />

          <div className="flex mt-2 mx-2 justify-between">
            {[0, 5, 10, 15, 20].map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
