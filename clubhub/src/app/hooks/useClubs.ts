import { useQuery } from "@tanstack/react-query";

type Club = {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  description: string;
  creationDate: string;
  instagramUsername: string;
  memberCount: number;
  profileImageUrl: string;
  websiteUrl: string;
};

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
  console.log("useClubs hook called");
  return useQuery({
    queryKey: ["clubs"],
    queryFn: fetchClubs,
  });
}
