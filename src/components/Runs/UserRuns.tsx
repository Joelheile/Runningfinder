"use client";

import { useFetchRegistrationByUser } from "@/lib/hooks/registrations/useFetchUserRegistrations";

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
  return (
    <div>
      <h1>My Runs</h1>
    </div>
  );
}
