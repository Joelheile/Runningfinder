import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useQueryRuns = (filters: {
  minDistance?: number;
  maxDistance?: number;
  days?: number[];
}) => {
  return useQuery({
    queryKey: ["runs", { ...filters }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.minDistance !== undefined)
        params.append("minDistance", filters.minDistance.toString());
      if (filters.maxDistance !== undefined)
        params.append("maxDistance", filters.maxDistance.toString());
      if (filters.days && filters.days.length > 0) {
        params.append("intervalDay", filters.days.join(","));
      }
      return axios
        .get(`/api/runs?${params.toString()}`)
        .then((res) => res.data);
    },
  });
};
