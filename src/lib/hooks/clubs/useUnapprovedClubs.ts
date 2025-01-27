import { useQuery } from "@tanstack/react-query";

interface Club {
  id: string;
  name: string;
  description: string;
  instagramUsername?: string;
  stravaUsername?: string;
  websiteUrl?: string;
  isApproved: boolean;
}

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
