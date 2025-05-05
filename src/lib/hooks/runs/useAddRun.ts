import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addRun } from "./runAPIs";

export function useAddRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRun,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["runs", "club", data.clubId],
      });

      queryClient.invalidateQueries({
        queryKey: ["runs"],
      });
    },
  });
}

export { addRun };
