import { Club } from "@/lib/types/club";
import { useQuery } from "@tanstack/react-query";

const fetchClubs = async (): Promise<Club[]> => {
  const response = await fetch("/api/v1/club");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

const locations: Club[] = data.map((club: any) => {

  return {
    ...club,
    location: {
      lat: parseFloat(club.locationLat),
      lng: parseFloat(club.locationLng),
    },
//    avatar: `data:image/jpeg;base64,${avatarBase64}`
  };
});
  return locations;
};

export function useClubs() {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: fetchClubs,
  });
}
