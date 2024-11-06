import { useQuery } from "@tanstack/react-query";
import { Club } from "../types/club";

const fetchClubs = async (): Promise<Club[]> => {
  const response = await fetch("/api/v1/club");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  console.log("Fetched clubs data:", data);

  return data.map((club: any) => ({
    ...club,
    location: {
      lat: parseFloat(club.locationLat),
      lng: parseFloat(club.locationLng),
    },
  }));
};

const fetchClubById = async (slug: string): Promise<Club> => {
  const response = await fetch(`/api/v1/club/${slug}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  console.log("Fetched single club data:", data);

  return {
    ...data,
    location: {
      lat: parseFloat(data.locationLat),
      lng: parseFloat(data.locationLng),
    },
  };
};

function useFetchClubs() {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: fetchClubs,
  });
}

function useFetchClubById(slug: string) {
  return useQuery({
    queryKey: ["clubs", slug],
    queryFn: () => fetchClubById(slug),
  });
}

export { useFetchClubs, useFetchClubById };
