import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRegistrations } from "./useRegistrations";


export function useUserRegistrationsData(userId: string | undefined) {
  const queryClient = useQueryClient();
  const { getUserRegistrations } = useRegistrations();

  if (!userId) {
    return {
      data: [],
      isLoading: false,
      error: null,
      refetch: () => Promise.resolve(),
    };
  }
  
  const result = getUserRegistrations(userId);
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      await queryClient.invalidateQueries({ 
        queryKey: ["registrations", userId],
        exact: true
      });
    };
    
    fetchData();
  }, [userId, queryClient]);
  
  return result;
} 