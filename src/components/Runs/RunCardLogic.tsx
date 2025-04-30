import { useCancelRegistration } from "@/lib/hooks/registrations/useCancelRegistration";
import { useRegisterRun } from "@/lib/hooks/registrations/useRegisterRun";
import { useRegistrations } from "@/lib/hooks/registrations/useRegistrations";
import { useDeleteRun } from "@/lib/hooks/runs/useDeleteRun";
import { getMapsLink } from "@/lib/hooks/runs/useRunCardHelpers";
import { useQueryClient } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
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
  clubSlug?: string;
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
  clubSlug,
}: RunCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUnregistering, setIsUnregistering] = useState(false);
  const { mutate: deleteRun } = useDeleteRun();
  const registerRun = useRegisterRun();
  const cancelRegistration = useCancelRegistration();
  const queryClient = useQueryClient();
  const { checkRegistrationStatus } = useRegistrations();

  const recoveryMapsLink = getMapsLink(
    mapsLink,
    locationLat,
    locationLng,
    startDescription,
  );

  const {
    data: isCheckedRegistered,
    refetch: refetchRegistration,
    isLoading: isCheckingRegistration,
  } = checkRegistrationStatus({
    userId: session?.user?.id,
    runId: id,
  });

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
      setIsUnregistering(true);
      try {
        if (externalUnregister) {
          externalUnregister(id);
        } else {
          await cancelRegistration.mutateAsync({
            runId: id,
            userId: session.user.id,
          });
        }
      } catch (error) {
        toast.error("Error unregistering from run");
      } finally {
        setIsUnregistering(false);
      }
    } else {
      setIsRegistering(true);
      try {
        await registerRun.mutateAsync({ runId: id, userId: session.user.id });
      } catch (error) {
        toast.error("Error registering for run");
      } finally {
        setIsRegistering(false);
      }
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
      isRegistering={isLoading}
      userId={session?.user?.id}
      clubSlug={clubSlug}
    />
  );
}
