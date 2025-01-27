import { useQuery } from "@tanstack/react-query";

import { Club } from '@/lib/types/Club';

export function useUnapprovedClubs() {
  return useQuery<Club[]>({
    queryKey: ["unapprovedClubs"],
    queryFn: async () => {
      const response = await fetch("/api/clubs/unapproved");
      if (!response.ok) {
        throw new Error("Failed to fetch unapproved clubs");
      }
      return response.json();
    },
  });
}
