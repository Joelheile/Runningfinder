"use client";

import { useCancelRegistration } from "@/lib/hooks/registrations/useCancelRegistration";
import { useFetchRegistrationByUser } from "@/lib/hooks/registrations/useFetchUserRegistrations";
import { useFetchRuns } from "@/lib/hooks/runs/useFetchRuns";
import { Run } from "@/lib/types/Run";
import UserRunsUI from "./UserRunsUI";

type UserRunsProps = {
  userId: string;
};

export default function UserRuns({ userId }: UserRunsProps) {
  const {
    data: registrations,
    isLoading: registrationsLoading,
    error: registrationsError,
  } = useFetchRegistrationByUser(userId);

  const {
    data: runs,
    isLoading: runsLoading,
    error: runError,
  } = useFetchRuns({});

  const cancelRegistration = useCancelRegistration();

  const handleUnregister = async (runId: string) => {
    try {
      await cancelRegistration.mutateAsync({ runId, userId });
    } catch (error) {
      console.error("Failed to unregister from run", error);
    }
  };

  const userRuns = Array.isArray(registrations)
    ? registrations.map((registration) => {
        return runs?.find((run: Run) => run.id === registration.runId);
      })
    : [];

  return (
    <div>
      <UserRunsUI
        userRuns={userRuns}
        userId={userId}
        onUnregister={handleUnregister}
      />
    </div>
  );
}
