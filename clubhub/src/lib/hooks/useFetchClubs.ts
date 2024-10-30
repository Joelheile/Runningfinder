import { useQuery } from "@tanstack/react-query";
import { Club } from "../types/club";

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
    };
  });
  return locations;
};

function useFetchClubs() {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: fetchClubs,
  });
}

function useFetchClubById(id: string) {
  return useQuery({
    queryKey: ["clubs", id],
    queryFn: fetchClubs,
  });
}

export { useFetchClubs, useFetchClubById };
