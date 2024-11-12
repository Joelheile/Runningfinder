import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UseCancelRegistrationParams {
  runId: string;
  userId: string;
}

const cancelRegistration = async ({ runId, userId }: UseCancelRegistrationParams) => {
  const response = await fetch("/api/registrations", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      runId,
      userId,
    }),
  });

  if (!response.ok) {
    toast.error("Failed to deregister from run");
    throw new Error("Failed to deregister from run");
  }

  toast.success("Successfully deregistered from run");
  return response.json();
};

export function useCancelRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}