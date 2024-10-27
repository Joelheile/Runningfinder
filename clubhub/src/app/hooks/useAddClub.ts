import { Club } from "@/lib/types/club";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const addClub = async (newClub: Club): Promise<Club> => {
    console.log("hook addClub called")
  const response = await fetch("/api/club", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newClub),
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
