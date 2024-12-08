import React from "react";
import { weekdays } from "@/lib/weekdays";

import MapLocationPicker from "../Map/MapLocationPicker";
import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { Label } from "../UI/label";

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
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="difficulty">Difficulty</Label>
            <select
              id="difficulty"
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
            <Label htmlFor="interval">Interval</Label>
            <select
              id="interval"
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
            <Label htmlFor="weekday">Weekday</Label>
            <select
              id="weekday"
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
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="distance">Distance (km)</Label>
            <Input
              id="distance"
              type="number"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="startDescription">Where are you starting?</Label>
            <Input
              id="startDescription"
              value={startDescription}
              onChange={(e) => setStartDescription(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="membersOnly">MembersOnly</Label>
            <input
              id="membersOnly"
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
