import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    throw new Error("Failed to update run");
  }

  return response.json();
}

export function useUpdateRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRunData }) =>
      updateRun(id, data),
    onSuccess: () => {
      // Invalidate all run-related queries
      queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
  });
}
