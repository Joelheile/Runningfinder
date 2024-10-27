import { Club } from "@/lib/types/club";
import { useQuery } from "@tanstack/react-query";

const fetchClubs = async (): Promise<Club[]> => {
  const response = await fetch("/api/club");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  const locations: Club[] = data.map((club: any) => ({
    id: club.id,
    name: club.name,
    position: {
      lat: parseFloat(club.positionLat),
      lng: parseFloat(club.positionLang),
    },
    description: club.description,
    creationDate: club.creationDate,
    instagramUsername: club.instagramUsername,
    memberCount: club.memberCount,
    profileImageUrl: club.profileImageUrl,
    websiteUrl: club.websiteUrl,
  }));

  return locations;
};

export function useClubs() {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: fetchClubs,
  });
}
