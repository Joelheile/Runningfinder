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
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.minDistance !== undefined && filters.maxDistance !== undefined) {
        params.append("minDistance", filters.minDistance.toString());
        params.append("maxDistance", filters.maxDistance.toString());
      }
      if (filters.days && filters.days.length > 0) {
        params.append("interval_day", filters.days.join(","));
      }
      if (filters.difficulty) {
        params.append("difficulty", filters.difficulty);
      }

      const queryString = params.toString();
      const url = queryString ? `/api/runs?${queryString}` : `/api/runs`;

      return axios.get(url).then((res) => res.data);
    },
  });
};