import { Club } from "@/lib/types/Club";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

async function fetchUnapprovedClubs(): Promise<Club[]> {
  const response = await fetch("/api/clubs/unapproved", {
    cache: "no-store",
    headers: {
      Pragma: "no-cache",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch unapproved clubs");
  }

  return await response.json();
}

const useFetchClubs = () => {
  const {
    data = [],
    refetch,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clubs", "unapproved"],
    queryFn: fetchUnapprovedClubs,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (error) {
    toast.error("Failed to fetch clubs.");
  }

  return { clubs: data, refetch, isLoading };
};

export default useFetchClubs;
