import { useAddRun } from "@/lib/hooks/runs/useAddRun";
import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
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
  const [difficulty, setDifficulty] = useState(initialValues.difficulty || "");
  const [distance, setDistance] = useState(initialValues.distance || "");
  const [date, setDate] = useState<Date>(initialValues.date || new Date());
  const [startDescription, setStartDescription] = useState(
    initialValues.startDescription || ""
  );
  const [locationLat, setLocationLat] = useState(
    initialValues.location?.lat || 52.52
  );
  const [locationLng, setLocationLng] = useState(
    initialValues.location?.lng || 13.405
  );
  const [membersOnly, setMembersOnly] = useState(
    initialValues.membersOnly || false
  );
  const [isRecurrent, setIsRecurrent] = useState(
    initialValues.isRecurrent || false
  );
  const [showMap, setShowMap] = useState(false);

  const mutation = useAddRun();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Please enter a name for the run");
      return;
    }
    if (!difficulty) {
      toast.error("Please select a difficulty level");
      return;
    }
    if (!distance) {
      toast.error("Please enter a distance");
      return;
    }
    if (!startDescription) {
      toast.error("Please enter a start description");
      return;
    }
    if (!locationLat || !locationLng) {
      toast.error("Please select a location on the map");
      return;
    }

    const newRun: Run = {
      id: uuidv4(),
      name,
      difficulty,
      clubId: club.id,
      date: date instanceof Date ? date : new Date(),
      startDescription,
      location: {
        lat: locationLat,
        lng: locationLng,
      },
      mapsLink: null,
      distance,
      temperature: null,
      wind: null,
      uv_index: null,
      membersOnly,
      isRecurrent,
    };

    mutation.mutate(newRun);
    router.push(`/clubs/${club.slug}`);
  };

  const handleLocationSelect = (
    lat: number,
    lng: number,
    placeUrl: string,
    formattedAddress: string
  ) => {
    setLocationLat(lat);
    setLocationLng(lng);
    setStartDescription(formattedAddress);
  };

  return (
    <AddRunUI
      name={name}
      setName={setName}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      distance={distance}
      setDistance={setDistance}
      date={date}
      setDate={setDate}
      startDescription={startDescription}
      setStartDescription={setStartDescription}
      locationLat={locationLat}
      locationLng={locationLng}
      isRecurrent={isRecurrent}
      setIsRecurrent={setIsRecurrent}
      showMap={showMap}
      handleSubmit={handleSubmit}
      handleLocationSelect={handleLocationSelect}
    />
  );
}
