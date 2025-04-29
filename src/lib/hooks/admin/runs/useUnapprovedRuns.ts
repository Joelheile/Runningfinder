import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import { useQuery } from "@tanstack/react-query";

interface RunWithClub extends Run {
  club: Club;
}

async function fetchUnapprovedRuns(): Promise<RunWithClub[]> {
  const response = await fetch("/api/runs/unapproved", {
    cache: "no-store",
    headers: {
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch unapproved runs");
  }
  const data = await response.json();

  return data.map((run: any) => {
    return {
      ...run,
      datetime: new Date(run.datetime),
      weekday: run.weekday ?? null,
      mapsLink: run.mapsLink ?? null,
      location: {
        lat: run.locationLat ?? 0,
        lng: run.locationLng ?? 0,
      },
      club: run.club,
    };
  });
}

export function useUnapprovedRuns() {
  return useQuery({
    queryKey: ["runs", "unapproved"],
    queryFn: fetchUnapprovedRuns,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
