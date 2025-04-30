import { Run } from "@/lib/types/Run";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchRunsByClubId = async (clubId: string): Promise<Run[]> => {
  const timestamp = Date.now();
  const response = await axios.get(`/api/runs/club/${clubId}?_t=${timestamp}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  if (response.status !== 200) {
    throw new Error("Failed to fetch runs by club ID");
  }
  return response.data;
};

export function useFetchRunsByClubId(clubId: string) {
  return useQuery({
    queryKey: ["runs", "club", clubId],
    queryFn: () => fetchRunsByClubId(clubId),
    staleTime: 60000,
    gcTime: 300000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    retry: 2,
  });
}
