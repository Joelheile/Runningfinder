import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapLocationPicker } from "../Map/MapLocationPicker";
import { Run } from "@/lib/types/Run";
import { useAddRun } from "@/lib/hooks/useAddRun";
import { Button } from "../ui/button";

import { weekdays } from "@/lib/weekdays";

import { v4 } from "uuid";
import { Club } from "@/lib/types/Club";
import toast from "react-hot-toast";

export default function AddRun({ club }: { club: Club }) {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [startDescription, setStartDescription] = useState("");
  const [weekday, setWeekday] = useState(weekdays[0].value);
  const [startTime, setStartTime] = useState("");
  const [distance, setDistance] = useState(0);
  const [location, setLocation] = useState({ lat: 52.52, lng: 13.405 });
  const [membersOnly, setMembersOnly] = useState(false);
  const [interval, setInterval] = useState("weekly");

  const handleSubmit = (e: React.FormEvent) => {
    if (!name || !difficulty || !startTime || !distance) {
      toast('You are missing some important fields!', {
        icon: '🔎',
      });
    }

    e.preventDefault();
    const formData: Run = {
      name,
      difficulty,
      clubId: club?.id || "",
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      interval: interval,
      intervalDay: weekday,
      startDescription,
      startTime,
      distance,
      id: v4(),
      date: null,
      membersOnly,
    };
    mutation.mutate(formData);
  };

  const mutation = useAddRun();

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="flex flex-col">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <Label>Difficulty</Label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="mt-1 p-2 border rounded"
            >
              <option value="easy">Easy</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="flex flex-col">
            <Label>Interval</Label>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="mt-1 p-2 border rounded"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Biweekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="flex flex-col">
            <Label>Weekday</Label>
            <select
              value={weekday}
              onChange={(e) => setWeekday(Number(e.target.value))}
              className="mt-1 p-2 border rounded"
            >
              {weekdays.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <Label>Start Time</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <Label>Distance (km)</Label>
            <Input
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <Label>Describe the meeting point</Label>
            <Input
              value={startDescription}
              onChange={(e) => setStartDescription(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label>MembersOnly</Label>
            <input
              type="checkbox"
              checked={membersOnly}
              onChange={() => setMembersOnly(!membersOnly)}
              className="mt-1   p-2 border rounded"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          Add run
        </Button>
        <div className="App mt-8"></div>
        <MapLocationPicker
          onSelect={(lat, lng) => setLocation({ lat, lng })}
          onCancel={() => {}}
        />
      </form>
    </div>
  );
}
