import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UseCancelRegistrationParams {
  runId: string;
  userId: string;
}

const cancelRegistration = async ({
  runId,
  userId,
}: UseCancelRegistrationParams) => {
  console.log("runId" + runId + "userId" + userId);
  const response = await fetch("/api/registrations", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
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

  return useMutation({
    mutationFn: cancelRegistration,
    onSuccess: (_, variables) => {
      queryClient.resetQueries();

      queryClient.invalidateQueries({ queryKey: ["runs"] });
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
  });
}
