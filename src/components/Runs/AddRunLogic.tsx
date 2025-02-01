import { useAddRun } from "@/lib/hooks/runs/useAddRun";
import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";

import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import React, { useEffect, useState } from "react";
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
  const [datetime, setDatetime] = useState<Date>(
    initialValues.datetime || new Date(),
  );
  const [startDescription, setStartDescription] = useState(
    initialValues.startDescription || "",
  );
  const [locationLat, setLocationLat] = useState(
    initialValues.location?.lat || 52.52,
  );
  const [locationLng, setLocationLng] = useState(
    initialValues.location?.lng || 13.405,
  );

  const [isRecurrent, setIsRecurrent] = useState(
    initialValues.isRecurrent || false,
  );
  const [showMap, setShowMap] = useState(false);

  const mutation = useAddRun();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Track submission attempt
    posthog.capture("run_creation_submitted", {
      club_id: club.id,
      club_name: club.name,
      fields_completed: {
        has_name: !!name,
        has_difficulty: !!difficulty,
        has_distance: !!distance,
        has_start_description: !!startDescription,
        has_location: !!(locationLat && locationLng),
      },
      time_spent: Date.now() - (window as any).__runCreationStartTime,
    });

    const validationErrors = [];

    if (!name) {
      validationErrors.push("name");
      toast.error("Please enter a name for the run");
    }
    if (!difficulty) {
      validationErrors.push("difficulty");
      toast.error("Please select a difficulty level");
    }
    if (!distance) {
      validationErrors.push("distance");
      toast.error("Please enter a distance");
    }
    if (!startDescription) {
      validationErrors.push("start_description");
      toast.error("Please enter a start description");
    }
    if (!locationLat || !locationLng) {
      validationErrors.push("location");
      toast.error("Please select a location on the map");
    }

    if (validationErrors.length > 0) {
      posthog.capture("run_creation_validation_failed", {
        missing_fields: validationErrors,
        club_id: club.id,
        club_name: club.name,
      });
      return;
    }

    const newRun: Run = {
      id: uuidv4(),
      name,
      difficulty,
      clubId: club.id,
      datetime: datetime instanceof Date ? datetime : new Date(),
      startDescription,
      weekday: datetime ? new Date(datetime).getDay() : null,
      location: {
        lat: locationLat,
        lng: locationLng,
      },
      mapsLink: null,
      distance,

      isApproved: false,
      isRecurrent,
    };

    mutation.mutate(newRun);

    // Track successful run creation
    posthog.capture("run_created", {
      run_name: name,
      club_name: club.name,
      club_id: club.id,
      difficulty,
      distance,
      is_recurrent: isRecurrent,
      weekday: datetime ? new Date(datetime).getDay() : null,
    });

    router.push(`/clubs/${club.slug}`);
  };

  const handleLocationSelect = (
    lat: number,
    lng: number,
    placeUrl: string,
    formattedAddress: string,
  ) => {
    posthog.capture("run_location_selected", {
      club_id: club.id,
      club_name: club.name,
      has_place_url: !!placeUrl,
      location_type: formattedAddress.includes("Street")
        ? "street"
        : formattedAddress.includes("Park")
          ? "park"
          : "other",
    });

    setLocationLat(lat);
    setLocationLng(lng);
    setStartDescription(formattedAddress);
  };

  useEffect(() => {
    // Track when the run creation form is opened
    (window as any).__runCreationStartTime = Date.now();
    posthog.capture("run_creation_started", {
      club_id: club.id,
      club_name: club.name,
    });

    // Track when the user leaves/closes the form
    return () => {
      const timeSpent = Date.now() - (window as any).__runCreationStartTime;
      posthog.capture("run_creation_abandoned", {
        club_id: club.id,
        club_name: club.name,
        time_spent: timeSpent,
        fields_completed: {
          has_name: !!name,
          has_difficulty: !!difficulty,
          has_distance: !!distance,
          has_start_description: !!startDescription,
          has_location: !!(locationLat && locationLng),
        },
      });
    };
  }, []);

  return (
    <AddRunUI
      name={name}
      setName={setName}
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      distance={distance}
      setDistance={setDistance}
      datetime={datetime}
      setDatetime={setDatetime}
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
