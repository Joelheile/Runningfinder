import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRegistrations } from "./useRegistrations";

interface UseRegistrationStatusParams {
  userId?: string;
  runId: string;
}

/**
 * Stable wrapper hook for checking registration status with controlled refresh
 * Prevents the excessive API calls for registration status checks
 */
export function useRegistrationStatusData({ userId, runId }: UseRegistrationStatusParams) {
  const queryClient = useQueryClient();
  const { checkRegistrationStatus } = useRegistrations();
  
  // Early return if required params are missing
  if (!userId || !runId) {
    return {
      data: false,
      isLoading: false,
      error: null,
      refetch: () => Promise.resolve(),
    };
  }
  
  const result = checkRegistrationStatus({ userId, runId });
  
  // Manual control over when to refresh - only on mount or when params change
  useEffect(() => {
    if (!userId || !runId) return;
    
    // Fetch once on mount by invalidating and then stopping further requests
    const fetchData = async () => {
      await queryClient.invalidateQueries({ 
        queryKey: ["registration", userId, runId],
        exact: true
      });
    };
    
    fetchData();
    
    // No need for cleanup
  }, [userId, runId, queryClient]);
  
  return result;
} 