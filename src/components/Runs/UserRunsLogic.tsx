"use client";

import { useCancelRegistration } from "@/lib/hooks/registrations/useCancelRegistration";
import { useRegistrations } from "@/lib/hooks/registrations/useRegistrations";
import { useFetchRuns } from "@/lib/hooks/runs/useFetchRuns";
import { Run } from "@/lib/types/Run";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import RunCardUISkeleton from "./RunCardUISkeleton";
import UserRunsUI from "./UserRunsUI";

type UserRunsProps = {
  userId: string;
};

export default function UserRuns({ userId }: UserRunsProps) {
  const [isUnregistering, setIsUnregistering] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.resetQueries({ queryKey: ["registrations"] });
    queryClient.resetQueries({ queryKey: ["registration"] });
  }, [queryClient]);

  const { getUserRegistrations } = useRegistrations();
  const {
    data: registrations,
    isLoading: registrationsLoading,
    error: registrationsError,
    refetch: refetchRegistrations,
  } = getUserRegistrations(userId);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    refetchRegistrations();
  }, [refetchRegistrations]);

  const {
    data: runs,
    isLoading: runsLoading,
    error: runError,
  } = useFetchRuns({});

  const cancelRegistration = useCancelRegistration();

  const handleUnregister = async (runId: string) => {
    if (!runId || isUnregistering) return;

    try {
      setIsUnregistering(runId);
      await cancelRegistration.mutateAsync({ runId, userId });

      queryClient.resetQueries();

      await refetchRegistrations();
    } catch (error) {
      console.error("Failed to unregister from run", error);
    } finally {
      setIsUnregistering(null);
    }
  };

  const isLoading = isInitialLoad || registrationsLoading || runsLoading;
  const error = registrationsError || runError;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center p-5">
        <h1 className="text-2xl font-bold mt-5">Loading your runs...</h1>
        <div className="w-full max-w-4xl mt-5">
          <RunCardUISkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center p-5">
        <h1 className="text-2xl font-bold mt-5">Error loading your runs</h1>
        <p className="text-red-500 mt-2">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
      </div>
    );
  }

  const userRuns = Array.isArray(registrations)
    ? (registrations
        .map((registration) => {
          return runs?.find((run: Run) => run.id === registration.runId);
        })
        .filter(Boolean) as Run[])
    : [];

  return (
    <UserRunsUI
      userRuns={userRuns}
      userId={userId}
      onUnregister={handleUnregister}
    />
  );
}
