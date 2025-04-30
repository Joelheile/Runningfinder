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
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
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

      params.append("_t", Date.now().toString());

      const queryString = params.toString();
      const url = queryString ? `/api/runs?${queryString}` : `/api/runs`;

      return axios
        .get(url, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        .then((res) => res.data);
    },
  });
};
