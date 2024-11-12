import { useState, useEffect } from "react";
import { v4 } from "uuid";
import { useAddRun } from "@/lib/hooks/useAddRun";
import { Run } from "@/lib/types/Run";
import { Club } from "@/lib/types/Club";
import toast from "react-hot-toast";
import { weekdays } from "@/lib/weekdays";
import AddRunUI from "./AddRunUI";

export default function AddRunState({ club }: { club: Club }) {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [startDescription, setStartDescription] = useState("");
  const [weekday, setWeekday] = useState(weekdays[0].value);
  const [startTime, setStartTime] = useState("");
  const [distance, setDistance] = useState(0);
  const [location, setLocation] = useState({ lat: 52.52, lng: 13.405 });
  const [membersOnly, setMembersOnly] = useState(false);
  const [interval, setInterval] = useState("weekly");

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
      mutation.mutate(formData);
    }
  };

  const handleSelect = (lat: number, lng: number) => {
    console.log("Selected location:", lat, lng);
    setLocation({ lat, lng });
  };

  useEffect(() => {
    console.log("Location updated:", location);
    toast.success(`${location.lat} ${location.lng}`);
  }, [location]);

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
