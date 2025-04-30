import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useFetchRuns = (filters: {
  minDistance?: number;
  maxDistance?: number;
  days?: number[];
  difficulty?: string;
}) => {
  return useQuery({
    queryKey: ["runs", { ...filters }],
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache at all (formerly cacheTime)
    refetchOnMount: "always", // Always refetch when component mounts
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2, // Retry failed requests 2 times
    queryFn: () => {
      const params = new URLSearchParams();
      if (
        filters.minDistance !== undefined &&
        filters.maxDistance !== undefined
      ) {
        params.append("minDistance", filters.minDistance.toString());
        params.append("maxDistance", filters.maxDistance.toString());
      }
      if (filters.days && filters.days.length > 0) {
        params.append("weekdays", filters.days.join(","));
      }
      if (filters.difficulty) {
        params.append("difficulty", filters.difficulty);
      }

      // Add a timestamp to bust cache
      params.append("_t", Date.now().toString());

      const queryString = params.toString();
      const url = queryString ? `/api/runs?${queryString}` : `/api/runs`;

      return axios.get(url, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }).then((res) => res.data);
    },
  });
};
