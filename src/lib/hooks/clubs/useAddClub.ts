import { Club } from "@/lib/types/Club";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { v4 } from "uuid";

const addClub = async (newClub: Club): Promise<Club> => {
  const response = await fetch("/api/clubs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...newClub,
      id: v4(),
    }),
  });

  
  if (response.status === 409) {
    toast.error("Slug already in use");
    throw new Error("Slug already in use");
  }

  if (!response.ok) {
    toast.error("Failed to add club");
    throw new Error("Failed to add club");
  }

  toast.success("Club added successfully");
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
