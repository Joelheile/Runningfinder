import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Run } from "../types/Run";

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
      if (
        filters.minDistance !== undefined &&
        filters.maxDistance !== undefined
      ) {
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

const fetchRunsByClubId = async (clubId: string): Promise<Run[]> => {
  const response = await axios.get(`/api/runs?clubId=${clubId}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch runs by club ID");
  }
  return response.data;
};

export function useFetchRunsByClubId(clubId: string) {
  return useQuery({
    queryKey: ["runs", clubId],
    queryFn: () => fetchRunsByClubId(clubId),
    enabled: !!clubId, // only query if clubId exists
  });
}
