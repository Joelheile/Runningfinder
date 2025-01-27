import { useQuery } from "@tanstack/react-query";
import { Club } from "@/lib/types/Club";

async function fetchUnapprovedClubs(): Promise<Club[]> {
  const response = await fetch("/api/clubs/unapproved", {
    cache: "no-store",
    headers: {
      Pragma: "no-cache",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Expires: "0",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch unapproved clubs");
  }
  return response.json();
}

export function useUnapprovedClubs() {
  return useQuery<Club[]>({
    queryKey: ["unapprovedClubs"],
    queryFn: fetchUnapprovedClubs,
    // Disable caching to always fetch fresh data
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: "always",
    retry: 3,
  });
}
