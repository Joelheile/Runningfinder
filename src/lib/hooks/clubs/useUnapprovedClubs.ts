import { Club } from "@/lib/types/Club";
import { useQuery } from "@tanstack/react-query";

async function fetchUnapprovedClubs(): Promise<Club[]> {
  const timestamp = new Date().getTime(); // Add timestamp to prevent caching
  const response = await fetch(`/api/clubs/unapproved?t=${timestamp}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Pragma': 'no-cache',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Expires': '0',
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch unapproved clubs");
  }
  
  const data = await response.json();
  console.log('Fetched unapproved clubs:', data);
  return data;
}

export function useUnapprovedClubs() {
  return useQuery({
    queryKey: ["unapprovedClubs"],
    queryFn: () => fetchUnapprovedClubs(),
    staleTime: 0, // Data is never fresh
    gcTime: 0, // Remove data from cache immediately
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    refetchInterval: 5000 // Refetch every 5 seconds
  });
}
