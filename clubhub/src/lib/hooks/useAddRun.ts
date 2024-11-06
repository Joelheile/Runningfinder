import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Run } from "../types/Run";

const addRun = async (newRun: Run): Promise<Run> => {
  console.log("hook addRun called");

  const response = await fetch("/api/v1/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...newRun,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add run");
  }
  return response.json();
};

export function useAddRun() {
  const queryClient = useQueryClient();
  return useMutation<Run, Error, Run>({
    mutationFn: addRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
    },
  });
}
