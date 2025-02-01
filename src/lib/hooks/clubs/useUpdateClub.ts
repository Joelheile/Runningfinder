import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UpdateClubData {
  name?: string;
  description?: string;
  locationLat?: number;
  locationLng?: number;
  instagramUsername?: string;
  stravaUsername?: string;
  avatarUrl?: string;
}

async function updateClub(slug: string, data: UpdateClubData) {
  const response = await fetch(`/api/clubs/${slug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update club");
  }

  return response.json();
}

export function useUpdateClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateClubData }) =>
      updateClub(slug, data),
    onSuccess: () => {
      // Invalidate all club-related queries
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
}
