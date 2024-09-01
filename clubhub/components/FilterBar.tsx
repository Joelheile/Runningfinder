"use client";
import { useState } from "react";
import { Calendar as CalendarIcon, Sliders, RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function FilterBar() {
  const [distance, setDistance] = useState([0]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleReset = () => {
    setDistance([0]);
    setSelectedDays([]);
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="bg-card text-card-foreground shadow-sm rounded-lg p-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <label htmlFor="distance-filter" className="text-sm font-medium">
            Distance (km)
          </label>
          <Slider
            id="distance-filter"
            min={0}
            max={20}
            step={5}
            value={distance}
            onValueChange={setDistance}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            {[0, 5, 10, 15, 20].map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Days</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  selectedDays.length === 0 && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDays.length > 0 ? selectedDays.join(", ") : "Select days"}
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
                    <label htmlFor={day} className="text-sm font-medium leading-none">
                      {day}
                    </label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <Button size="sm">
          Let's run
          <Sliders className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}