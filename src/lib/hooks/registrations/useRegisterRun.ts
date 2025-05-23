import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRegistrations } from "./useRegistrations";

interface UseRegisterRunParams {
  runId: string;
  userId: string;
}

const registerRun = async ({ runId, userId }: UseRegisterRunParams) => {
  const response = await fetch("/api/registrations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      runId,
      userId,
      status: "registered",
    }),
  });

  if (response.status == 409) {
    toast("Already registered for run", { icon: "👟" });
  } else if (!response.ok) {
    toast.error("Failed to register for run");
    throw new Error("Failed to register for run");
  } else if (response.ok) {
    toast.success("Successfully registered for run");
  }

  return response.json();
};

export function useRegisterRun() {
  const queryClient = useQueryClient();
  const {
    invalidateRegistrations,
    invalidateUserRegistrations,
    invalidateRegistrationStatus,
  } = useRegistrations();

  return useMutation({
    mutationFn: registerRun,
    onSuccess: ({ userId, runId }) => {
      invalidateRegistrations();
      invalidateUserRegistrations(userId);
      invalidateRegistrationStatus(userId, runId);

      queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
  });
}
