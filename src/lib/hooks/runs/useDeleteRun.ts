import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRun } from "./runAPIs";

export function useDeleteRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRun,
    onSuccess: (runId) => {
      queryClient.invalidateQueries({
        queryKey: ["run", runId],
      });

      queryClient.invalidateQueries({
        queryKey: ["runs"],
      });

      queryClient.invalidateQueries({
        queryKey: ["registrations"],
      });
    },
  });
}

export { deleteRun };
