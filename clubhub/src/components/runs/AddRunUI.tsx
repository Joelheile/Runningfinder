import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { MapLocationPicker } from "../Map/MapLocationPicker";
import { weekdays } from "@/lib/weekdays";

interface AddRunUIProps {
  name: string;
  setName: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  startDescription: string;
  setStartDescription: (value: string) => void;
  weekday: number;
  setWeekday: (value: number) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  distance: number;
  setDistance: (value: number) => void;
  location: { lat: number; lng: number };
  setLocation: (location: { lat: number; lng: number }) => void;
  membersOnly: boolean;
  setMembersOnly: (value: boolean) => void;
  interval: string;
  setInterval: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleSelect: (lat: number, lng: number) => void;
}

export default function AddRunUI(props: AddRunUIProps) {
  const {
    name,
    setName,
    difficulty,
    setDifficulty,
    startDescription,
    setStartDescription,
    weekday,
    setWeekday,
    startTime,
    setStartTime,
    distance,
    setDistance,
    location,
    membersOnly,
    setMembersOnly,
    interval,
    setInterval,
    handleSubmit,
    handleSelect,
  } = props;

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
            <Label>Where are you starting?</Label>
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
              className="mt-1 p-2 border rounded"
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
          onSelect={handleSelect}
          onCancel={() => {}}
          location={location}
        />
      </form>
    </div>
  );
}
