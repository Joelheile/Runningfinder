import { Club } from "@/lib/types/club";
import { useQuery } from "@tanstack/react-query";

const fetchClubs = async (): Promise<Club[]> => {
  const response = await fetch("/api/club");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

const locations: Club[] = data.map((club: any) => {
  console.log("buffer avatar, ", club.avatar);
  const avatarBase64 = Buffer.from(club.avatar).toString("base64");
  console.log("avatarBase64", avatarBase64);
  return {
    ...club,
    location: {
      lat: parseFloat(club.locationLat),
      lng: parseFloat(club.locationLng),
    },
    avatar: `data:image/jpeg;base64,${avatarBase64}`
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
