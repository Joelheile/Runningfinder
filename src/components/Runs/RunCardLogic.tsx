import { useCancelRegistration } from "@/lib/hooks/registrations/useCancelRegistration";
import { useRegisterRun } from "@/lib/hooks/registrations/useRegisterRun";
import { useRegistrationStatusData } from "@/lib/hooks/registrations/useRegistrationStatusData";
import { useDeleteRun } from "@/lib/hooks/runs/useDeleteRun";
import {
  getMapsLink,
  registerForRun,
  unregisterFromRun,
} from "@/lib/hooks/runs/useRunCardHelpers";
import { useQueryClient } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RunCardUI from "./RunCardUI";

interface RunCardProps {
  id: string;
  name: string;
  distance: string;
  locationLat: number;
  locationLng: number;
  weekday: number;
  datetime: Date | null;
  startDescription: string;
  difficulty: string;

  slug?: string;
  isRegistered?: boolean;
  isAdmin?: boolean;
  onUnregister?: (runId: string) => void;
  mapsLink?: string | null;
}

export default function RunCard({
  id,
  name,
  distance,
  locationLat,
  locationLng,
  mapsLink,
  datetime,
  startDescription,
  difficulty,

  slug,
  isRegistered: initialIsRegistered,
  isAdmin,
  onUnregister: externalUnregister,
}: RunCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUnregistering, setIsUnregistering] = useState(false);
  const { mutate: deleteRun } = useDeleteRun();
  const registerRun = useRegisterRun();
  const cancelRegistration = useCancelRegistration();
  const queryClient = useQueryClient();

  const recoveryMapsLink = getMapsLink(
    mapsLink,
    locationLat,
    locationLng,
    startDescription
  );

  // Check registration status using the stable wrapper hook
  const {
    data: isCheckedRegistered,
    refetch: refetchRegistration,
    isLoading: isCheckingRegistration,
  } = useRegistrationStatusData({
    userId: session?.user?.id,
    runId: id,
  });

  // Force refetch data when component mounts - but only once
  useEffect(() => {
    // Force clear and refetch all run data when component mounts
    queryClient.invalidateQueries({ queryKey: ["runs"] });

    // No need for continual refetching
  }, [queryClient]);

  const isRegistered =
    typeof initialIsRegistered !== "undefined"
      ? initialIsRegistered
      : isCheckedRegistered;

  const isLoading = isRegistering || isUnregistering || isCheckingRegistration;

  const handleHeartClick = async () => {
    if (isLoading) return;

    if (!session?.user) {
      signIn(undefined, { callbackUrl: window.location.href });
      return;
    }

    if (isRegistered) {
      await unregisterFromRun(
        id,
        session.user.id,
        externalUnregister,
        setIsUnregistering,
        cancelRegistration,
        refetchRegistration
      );
    } else {
      await registerForRun(
        id,
        session.user.id,
        setIsRegistering,
        registerRun,
        refetchRegistration
      );
    }
  };

  return (
    <RunCardUI
      id={id}
      key={id}
      datetime={datetime}
      name={name}
      startDescription={startDescription}
      difficulty={difficulty}
      distance={distance}
      mapsLink={recoveryMapsLink}
      isAdmin={isAdmin}
      isRegistered={isRegistered}
      onLikeRun={handleHeartClick}
      onUnregister={handleHeartClick}
      isRegistering={isLoading}
      userId={session?.user?.id}
    />
  );
}
