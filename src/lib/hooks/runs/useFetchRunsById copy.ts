import { Run } from "@/lib/types/Run";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchRunsById = async (runId: string): Promise<Run[]> => {
  const response = await axios.get(`/api/runs/${runId}`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch runs by club ID");
  }
  return response.data;
};

export function useFetchRunsById(runId: string) {
  return useQuery({
    queryKey: ["runs", runId],
    queryFn: () => fetchRunsById(runId),
  });
}
