import { useQuery } from "@tanstack/react-query";

import { Club } from '@/lib/types/Club';

export function useUnapprovedClubs() {
  return useQuery<Club[]>({
    queryKey: ["unapprovedClubs"],
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    queryFn: async () => {
      const response = await fetch("/api/clubs/unapproved",
        {cache: 'no-store',
          headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
          }}
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch unapproved clubs");
      }
      return response.json();
    },
  });
}
