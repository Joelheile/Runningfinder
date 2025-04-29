import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Run } from "@/lib/types/Run";
import { toast } from "react-hot-toast";

async function updateRun(params: { runId: string; updateData: Partial<Run> }) {
  const { runId, updateData } = params;
  const response = await fetch(`/api/runs/${runId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update run: ${errorText}`);
  }

  return response.json() as Promise<Run>;
}

export default function useAdminUpdateRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      toast.success("Run updated successfully");
    },
    onError: (error) => {
      console.error("Error updating run:", error);
      toast.error("Failed to update run");
    },
  });
}
