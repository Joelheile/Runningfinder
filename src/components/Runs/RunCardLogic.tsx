import { useCancelRegistration } from "@/lib/hooks/registrations/useCancelRegistration";
import { useRegisterRun } from "@/lib/hooks/registrations/useRegisterRun";
import { redirect } from "next/navigation";
import { useState } from "react";
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
}: RunCardProps) {
  const [likeFilled, setLikeFilled] = useState(false);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;

  const registerMutation = useRegisterRun();
  const cancelRegistrationMutation = useCancelRegistration();

  const handleRegistration = () => {
    if (!userId) {
      redirect(`/api/auth/signin?callbackUrl=/clubs/${slug}`);
    } else {
      if (likeFilled) {
        cancelRegistrationMutation.mutate({ runId: id, userId });
      } else {
        registerMutation.mutate({ runId: id, userId });
      }
      setLikeFilled(!likeFilled);
    }
  };

  return (
    <RunCardUI
      intervalDay={intervalDay}
      name={name}
      time={time}
      distance={distance}
      difficulty={difficulty}
      startDescription={startDescription}
      googleMapsUrl={googleMapsUrl}
      likeFilled={likeFilled}
      handleRegistration={handleRegistration}
    />
  );
}
