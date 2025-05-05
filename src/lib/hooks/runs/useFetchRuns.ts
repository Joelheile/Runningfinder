import { useQuery } from "@tanstack/react-query";
import { fetchRuns } from "./runAPIs";

export function useFetchRuns(filters?: {
  minDistance?: number;
  maxDistance?: number;
  days?: number[];
  difficulty?: string;
}) {
  return useQuery({
    queryKey: ["runs", filters || {}],
    queryFn: () => fetchRuns(filters),
    staleTime: 0,
  });
}

export { fetchRuns };
