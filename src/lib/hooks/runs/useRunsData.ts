import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFetchRunsByClubId } from "./useFetchRunsByClubId";

/**
 * Stable wrapper hook for fetching club runs data with controlled refresh
 * Ensures the data is fetched only when needed and not repeatedly
 */
export function useClubRunsData(clubId: string | undefined) {
  const queryClient = useQueryClient();
  const effectiveClubId = clubId || "";
  
  // Use the modified fetch hook with stable keys and controlled refetch
  const result = useFetchRunsByClubId(effectiveClubId);
  
  // Manual control over when to refresh - only on mount or clubId change
  useEffect(() => {
    if (!effectiveClubId) return;
    
    // Initial fetch
    queryClient.prefetchQuery({
      queryKey: ["runs", "club", effectiveClubId],
      queryFn: () => result.queryFn()
    });
    
    // No need for cleanup as we're just prefetching
  }, [effectiveClubId, queryClient, result.queryFn]);
  
  return result;
} 