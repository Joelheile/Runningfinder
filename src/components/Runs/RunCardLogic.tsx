import { useCancelRegistration } from "@/lib/hooks/registrations/useCancelRegistration";
import { useRegisterRun } from "@/lib/hooks/registrations/useRegisterRun";
import { useDeleteRun } from "@/lib/hooks/runs/useDeleteRun";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import RunCardUI from "./RunCardUI";

interface RunCardProps {
  id: string;
  time: string;
  distance: number;
  location: { lat: number; lng: number };
  intervalDay: number;
  name: string;
  startDescription: string;
  difficulty: string;
  userId: string | undefined;
  slug: string;
  isRegistered: boolean;
  isAdmin?: boolean;
  onUnregister: (runId: string) => void;
}

export default function RunCard({
  id,
  time,
  distance,
  location,
  intervalDay,
  name,
  startDescription,
  difficulty,
  userId,
  slug,
  isRegistered,
  isAdmin,
  onUnregister,
}: RunCardProps) {
  const [isLiked, setIsLiked] = useState(isRegistered);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setIsLiked(isRegistered);
  }, [isRegistered]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;

  const registerMutation = useRegisterRun();
  const cancelRegistrationMutation = useCancelRegistration();

  const handleRegistration = () => {
    if (!userId) {
      redirect(`/api/auth/signin?callbackUrl=/clubs/${slug}`);
    } else {
      if (isLiked) {
        cancelRegistrationMutation.mutate({ runId: id, userId });
      } else {
        registerMutation.mutate({ runId: id, userId });
      }
      setIsLiked(!isLiked);
    }
  };
  const deleteRunMutation = useDeleteRun();

  const handleDeleteRun = () => {
    deleteRunMutation.mutate(id);
  };

  return (
    <div className="run-card">
      <RunCardUI
        intervalDay={intervalDay}
        name={name}
        time={time}
        distance={distance}
        difficulty={difficulty}
        startDescription={startDescription}
        googleMapsUrl={googleMapsUrl}
        likeFilled={isLiked || isRegistered}
        handleRegistration={handleRegistration}
        handleDeleteRun={handleDeleteRun}
        isAdmin={admin || isAdmin}
      />
    </div>
  );
}
