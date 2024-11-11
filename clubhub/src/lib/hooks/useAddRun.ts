import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Run } from "../types/Run";
import { v4 } from "uuid";
import toast from "react-hot-toast";

const addRun = async (newRun: Run): Promise<Run> => {
  console.log("hook addRun called", newRun);

  const response = await fetch("/api/runs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...newRun,
    }),
  });

  if (!response.ok) {
    toast.error("Failed to add run");
    throw new Error("Failed to add run");
   
  }
  toast.success("Run added successfully");
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
