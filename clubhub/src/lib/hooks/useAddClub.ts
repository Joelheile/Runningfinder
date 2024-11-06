import { Avatar } from "@/lib/types/Avatar";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 } from "uuid";
import { useUploadAvatar } from "./useUploadAvatar";
import { Club } from "../types/Club";

const addClub = async (newClub: Club): Promise<Club> => {
  console.log("hook addClub called");

  const response = await fetch("/api/v1/club", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...newClub,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add club");
  }
  return response.json();
};

export function useAddClub() {
  const queryClient = useQueryClient();
  return useMutation<Club, Error, Club>({
    mutationFn: addClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
}
