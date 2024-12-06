import React from "react";
import { useAddRun } from "@/lib/hooks/runs/useAddRun";
import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import { weekdays } from "@/lib/weekdays";
import { useState } from "react";
import toast from "react-hot-toast";
import { v4 } from "uuid";
import AddRunUI from "./AddRunUI";

interface AddRunStateProps {
  club: Club;
  initialValues?: Partial<Run>;
}

export default function AddRunState({
  club,
  initialValues = {},
}: AddRunStateProps) {
  const [name, setName] = useState(initialValues.name || "");
  const [difficulty, setDifficulty] = useState(
    initialValues.difficulty || "easy",
  );
  const [startDescription, setStartDescription] = useState(
    initialValues.startDescription || "",
  );
  const [weekday, setWeekday] = useState(
    initialValues.intervalDay || weekdays[0].value,
  );
  const [startTime, setStartTime] = useState(initialValues.startTime || "");
  const [distance, setDistance] = useState(initialValues.distance || 0);
  const [location, setLocation] = useState(
    initialValues.location || { lat: 52.52, lng: 13.405 },
  );
  const [membersOnly, setMembersOnly] = useState(
    initialValues.membersOnly || false,
  );
  const [interval, setInterval] = useState(initialValues.interval || "weekly");

  const mutation = useAddRun();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !difficulty || !startTime || !distance) {
      toast("You are missing some important fields!", {
        icon: "🔎",
      });
    } else {
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
      console.log("Form submitted with data:", formData);
      mutation.mutate(formData);
    }
  };

  const handleSelect = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const runProps = {
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
    setLocation,
    membersOnly,
    setMembersOnly,
    interval,
    setInterval,
    handleSubmit,
    handleSelect,
  };

  return <AddRunUI {...runProps} />;
}
