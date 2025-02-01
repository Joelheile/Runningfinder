import { Club } from "@/lib/types/Club";
import { useMutation, useQueryClient } from "@tanstack/react-query";



async function useUpdateAdminClub(slug: string, club: Partial<Club>) {
  const response = await fetch(`/api/clubs/${slug}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(club),
  });

  if (!response.ok) {
    throw new Error("Failed to update club");
  }

  return response.json();
}

export default useUpdateAdminClub;
