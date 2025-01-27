import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import { useQuery } from "@tanstack/react-query";







interface RunWithClub extends Run {
  club: Club;
}

async function fetchUnapprovedRuns(): Promise<RunWithClub[]> {
  const response = await fetch("/api/runs/unapproved");
  if (!response.ok) {
    throw new Error("Failed to fetch unapproved runs");
  }
  const data = await response.json();
  console.log("API Response:", data); 
  return data.map((run: any) => {
    console.log("Processing run:", run); 
    return {
      ...run,
      datetime: new Date(run.datetime),
      weekday: run.weekday ?? null,
      mapsLink: run.mapsLink ?? null,
      location: {
        lat: run.locationLat ?? 0,
        lng: run.locationLng ?? 0
      },
      club: run.club 
    };
  });
}

export function useUnapprovedRuns() {
  return useQuery({
    queryKey: ["runs", "unapproved"],
    queryFn: fetchUnapprovedRuns,
  });
}
