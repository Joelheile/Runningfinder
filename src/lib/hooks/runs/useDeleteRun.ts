import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const deleteRun = async (runId: string): Promise<string> => {
  const response = await fetch(`/api/runs`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: runId }),
  });
  if (!response.ok) {
    toast.error("Failed to delete run");
    throw new Error("Failed to delete run");
  }

  toast.success("Run deleted successfully");
  return runId; // Return the ID for use in onSuccess
};

export function useDeleteRun() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRun,
    onSuccess: (runId) => {
      // More aggressive cache invalidation
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      queryClient.removeQueries({ queryKey: ["runs"] });
      
      // Invalidate specific run query
      queryClient.invalidateQueries({ queryKey: ["runs", runId] });
      
      // Also invalidate any registrations that might have been for this run
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      
      // Force refetch
      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["runs"] });
      }, 100);
    },
  });
}
