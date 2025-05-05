import { useQuery } from "@tanstack/react-query";
import { fetchRunById } from "./runAPIs";

export function useFetchRunById(runId: string) {
  return useQuery({
    queryKey: ["run", runId],
    queryFn: () => fetchRunById(runId),
    staleTime: 0,
    enabled: !!runId,
  });
}

export { fetchRunById };
