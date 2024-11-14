import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Run } from "../../types/Run";

const fetchRunsByClubId = async (clubId: string): Promise<Run[]> => {
  const response = await axios.get(`/api/runs/${clubId}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch runs by club ID");
  }
  return response.data;
};

export function useFetchRunsByClubId(clubId: string) {
  return useQuery({
    queryKey: ["runs", clubId],
    queryFn: () => fetchRunsByClubId(clubId),
  });
}
