import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import LikeButton from "../icons/LikeButton";
import { Button } from "../ui/button";
import { weekdays } from "@/lib/weekdays";
import { redirect } from "next/navigation";
import { useRegisterRun } from "@/lib/hooks/useRegisterRun";
import { useCancelRegistration } from "@/lib/hooks/useCancelRegistration";
import { useFetchRegistration } from "@/lib/hooks/useFetchRegistration";

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
  

  function handleClick() {
    if (!userId) {
      redirect(`/api/auth/signin?callbackUrl=/clubs/${slug}`);
    } else {
      if (likeFilled) {
        cancelRegistrationMutation.mutate({ runId: id, userId: userId });
      } else {
        registerMutation.mutate({
          runId: id,
          userId: userId,
        });
      }
      setLikeFilled(!likeFilled);
    }
  }

  return (
    <div className="mt-2 ">
      <strong className="ml-1">{weekdays[intervalDay - 1].name}</strong>
      <div className="flex bg-white mt-2 border justify-between p-2 rounded-md">
        <div className="flex gap-x-5 items-center pl-2">
          <LikeButton onClick={handleClick} isFilled={likeFilled} />
          <strong>{name} </strong>
          <p className=" text-medium ">|</p>
          <p>{time} </p>
          <p className=" text-medium ">|</p>
          <p>{distance} km </p>
          <p className=" text-medium ">|</p>
          <p>{difficulty} </p>
        </div>
        <div>
          <Button
            className=" min-w-28 w-auto"
            onClick={() => window.open(googleMapsUrl, "_blank")}
          >
            {startDescription}
          </Button>
        </div>
      </div>
    </div>
  );
}

