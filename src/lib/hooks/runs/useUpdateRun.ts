import { Run } from "@/lib/types/Run";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRun } from "./runAPIs";

/**
 * Hook to update an existing run
 */
export function useUpdateRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Run> }) =>
      updateRun(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["run", data.id],
      });

      if (data.clubId) {
        queryClient.invalidateQueries({
          queryKey: ["runs", "club", data.clubId],
        });
      }

      queryClient.invalidateQueries({
        queryKey: ["runs"],
      });
    },
  });
}

export { updateRun };
