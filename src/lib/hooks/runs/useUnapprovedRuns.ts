import { useQuery } from "@tanstack/react-query";

interface Club {
  id: string;
  name: string;
  description: string;
  instagramUsername?: string;
  stravaUsername?: string;
  avatarUrl?: string;
}

interface Run {
  id: string;
  name: string;
  description: string;
  clubId: string;
  club?: Club;
  date: string;
  weekday?: number;
  difficulty?: string;
  distance?: string;
  startDescription?: string;
  locationLng?: number;
  locationLat?: number;
  mapsLink?: string;
  isRecurrent?: boolean;
  isApproved: boolean;
}

async function fetchUnapprovedRuns(): Promise<Run[]> {
  const response = await fetch("/api/runs/unapproved");
  if (!response.ok) {
    throw new Error("Failed to fetch unapproved runs");
  }
  return response.json();
}

export function useUnapprovedRuns() {
  return useQuery({
    queryKey: ["runs", "unapproved"],
    queryFn: fetchUnapprovedRuns,
  });
}
