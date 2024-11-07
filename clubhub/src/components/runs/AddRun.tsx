"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MapLocationPicker } from "../MapLocationPicker";

interface ScheduleEntry {
  day: string;
  time: string;
  location: string;
  pace: number;
  coordinates?: { lat: number; lng: number };
}

export default function AddRun() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [schedule, setSchedule] = useState<ScheduleEntry[]>(
    days.map((day) => ({ day, time: "", location: "", pace:  }))
  );

  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("");

  return (
    <div className="">
      {schedule.map((entry) => (
        <div key={entry.day} className="flex gap-2 space-y-2 items-center">
          <Input
            type="time"
            value={entry.time}
            onChange={(e) => {
              const index = schedule.findIndex(
                (item) => item.day === entry.day
              );
              setSchedule((prev) => {
                const updated = [...prev];
                updated[index].time = e.target.value;
                return updated;
              });
            }}
            className="w-32"
          />
          //TODO: Add pace input
          <Input
            type="pace"
            value={entry.pace}
            onChange={(e) => {
              const index = schedule.findIndex(
                (item) => item.day === entry.day
              );
              setSchedule((prev) => {
                const updated = [...prev];
                updated[index].pace = Number(e.target.value);
                return updated;
              });
            }}
            className="w-32"
          />
          <Input
            type="text"
            placeholder="Starting location"
            value={entry.location}
            onChange={(e) => {
              const index = schedule.findIndex(
                (item) => item.day === entry.day
              );
              setSchedule((prev) => {
                const updated = [...prev];
                updated[index].location = e.target.value;
                return updated;
              });
            }}
            className="flex-1"
          />
          <Button
            onClick={() => {
              setIsLocationPickerOpen(true);
              setSelectedDay(entry.day);
            }}
          >
            Set Location
          </Button>
        </div>
      ))}
      <MapLocationPicker onCancel={() => {}} onSelect={() => {}} />
      {isLocationPickerOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4 rounded">
            <MapLocationPicker
              onSelect={(lat: number, lng: number) => {
                setIsLocationPickerOpen(false);
                setSelectedDay(null);
              }}
              onCancel={() => {
                setIsLocationPickerOpen(false);
                setSelectedDay(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
