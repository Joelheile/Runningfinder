import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRegistrations } from "./useRegistrations";

interface UseCancelRegistrationParams {
  runId: string;
  userId: string;
}

const cancelRegistration = async ({
  runId,
  userId,
}: UseCancelRegistrationParams) => {
  const response = await fetch("/api/registrations", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      runId,
      userId,
      status: "cancelled",
    }),
  });

  if (!response.ok) {
    toast.error("Failed to deregister from run");
    throw new Error("Failed to deregister from run");
  }

  toast("Successfully deregistered from run", { icon: "🗑️" });
  return response.json();
};

export function useCancelRegistration() {
  const queryClient = useQueryClient();
  const { 
    invalidateRegistrations, 
    invalidateUserRegistrations, 
    invalidateRegistrationStatus 
  } = useRegistrations();

  return useMutation({
    mutationFn: cancelRegistration,
    onSuccess: (_, variables) => {
      // Use the combined hook for more maintainable invalidation
      invalidateRegistrations();
      invalidateUserRegistrations(variables.userId);
      invalidateRegistrationStatus(variables.userId, variables.runId);
      
      // More aggressive invalidation for runs data
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      queryClient.removeQueries({ queryKey: ["runs"] }); // Force complete cache removal
      
      // Invalidate specific run query
      queryClient.invalidateQueries({ queryKey: ["runs", variables.runId] });
      
      // Force the UI to reload fresh data
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["runs"] });
      }, 100);
    },
  });
}
