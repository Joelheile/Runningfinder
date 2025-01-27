import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Club } from "../../types/Club";

const fetchClubs = async (): Promise<Club[]> => {
  const response = await fetch("/api/clubs");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

  return data.map((club: any) => ({
    ...club,
    location: {
      lat: parseFloat(club.locationLat),
      lng: parseFloat(club.locationLng),
    },
  }));
};

const fetchClubById = async (slug: string): Promise<Club> => {
  const response = await fetch(`/api/clubs/${slug}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();

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

function useFetchClubBySlug(slug: string) {
  const queryClient = useQueryClient();

  queryClient.invalidateQueries({
    queryKey: ["clubs"],
    refetchType: "all",
  });

  return useQuery({
    queryKey: ["clubs", slug],
    queryFn: () => fetchClubById(slug),
  });
}

export { useFetchClubBySlug, useFetchClubs };
