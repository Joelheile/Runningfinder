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
  return runId;
};

export function useDeleteRun() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRun,
    onSuccess: (runId) => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      queryClient.removeQueries({ queryKey: ["runs"] });

      queryClient.invalidateQueries({ queryKey: ["runs", runId] });

      queryClient.invalidateQueries({ queryKey: ["registrations"] });

      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["runs"] });
      }, 100);
    },
  });
}
