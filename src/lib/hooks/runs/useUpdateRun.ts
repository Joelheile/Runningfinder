import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface UpdateRunData {
  name?: string;
  description?: string;
  datetime?: Date;
  difficulty?: string;
  distance?: string;
  startDescription?: string;
  isApproved?: boolean;
  isRecurrent?: boolean;
}

async function updateRun(id: string, data: UpdateRunData) {
  const response = await fetch(`/api/runs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    toast.error(`Failed to update run: ${errorText}`);
    throw new Error(`Failed to update run: ${errorText}`);
  }

  toast.success("Run updated successfully");
  return { id, ...response.json() };
}

export function useUpdateRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRunData }) =>
      updateRun(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      queryClient.removeQueries({ queryKey: ["runs"] });

      queryClient.invalidateQueries({ queryKey: ["runs", result.id] });

      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["runs"] });
      }, 100);
    },
  });
}
