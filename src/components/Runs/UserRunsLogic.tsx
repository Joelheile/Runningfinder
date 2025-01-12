"use client";

import { useFetchRegistrationByUser } from "@/lib/hooks/registrations/useFetchUserRegistrations";
import { useFetchRuns } from "@/lib/hooks/runs/useFetchRuns";
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
  console.log("registrations", registrations);

  const {
    data: runs,
    isLoading: runsLoading,
    error: runError,
  } = useFetchRuns({});

  const userRuns = Array.isArray(registrations)
    ? registrations.map((registration) => {
        return runs?.find((run: any) => run.id === registration.runId);
      })
    : [];

  return (
    <div>
      <UserRunsUI userRuns={userRuns} userId={userId} />
    </div>
  );
}
