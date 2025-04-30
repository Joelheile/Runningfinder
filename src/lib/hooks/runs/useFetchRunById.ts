import { Run } from "@/lib/types/Run";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchRunsById = async (runId: string): Promise<Run[]> => {
  // Add timestamp to prevent caching
  const timestamp = Date.now();
  const response = await axios.get(`/api/runs/${runId}?_t=${timestamp}`, {
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
  if (response.status !== 200) {
    throw new Error("Failed to fetch run by ID");
  }
  return response.data;
};

export function useFetchRunsById(runId: string) {
  return useQuery({
    queryKey: ["runs", runId, Date.now()], // Add timestamp to queryKey to force refetch
    queryFn: () => fetchRunsById(runId),
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache at all
    refetchOnMount: "always", // Always refetch when component mounts
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2, // Retry failed requests 2 times
  });
}
