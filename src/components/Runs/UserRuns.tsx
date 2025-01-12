"use client";

import { useFetchRegistrationByUser } from "@/lib/hooks/registrations/useFetchUserRegistrations";
import { useFetchRuns } from "@/lib/hooks/runs/useFetchRuns";
import { Run } from "@/lib/types/Run";

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

  const userRuns: (Run | undefined)[] = [];

  if (registrations && Array.isArray(registrations)) {
    registrations.forEach((registration) => {
      const run = runs?.find((run: any) => run.id === registration.runId);
      userRuns.push(run);
    });
  }
  console.log("userRuns", userRuns);

  return (
    <div>
      <h1>My Runs</h1>
    </div>
  );
}
