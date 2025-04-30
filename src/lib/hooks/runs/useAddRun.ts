import { Run } from "@/lib/types/Run";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const addRun = async (newRun: Run): Promise<Run> => {
  const response = await fetch("/api/runs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...newRun,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to add run:", errorText);
    toast.error(`Failed to add run: ${errorText}`);
    throw new Error(`Failed to add run: ${errorText}`);
  }
  toast.success("Run added, it will now be reviewed!");
  return response.json();
};

export function useAddRun() {
  const queryClient = useQueryClient();
  return useMutation<Run, Error, Run>({
    mutationFn: addRun,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["runs", data.clubId] });

      queryClient.invalidateQueries({ queryKey: ["runs"] });
      queryClient.removeQueries({ queryKey: ["runs"] });

      setTimeout(() => {
        queryClient.refetchQueries({ queryKey: ["runs"] });
      }, 100);
    },
  });
}
