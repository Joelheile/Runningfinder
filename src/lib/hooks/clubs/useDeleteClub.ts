import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const deleteClub = async (
  clubId: string,
  router: ReturnType<typeof useRouter>,
): Promise<void> => {
  const response = await fetch(`/api/clubs`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: clubId }),
  });

  if (!response.ok) {
    toast.error("Failed to delete club");
    throw new Error("Failed to delete club");
  }
  router.push("/clubs");
  toast.success("Club deleted successfully");
};

export function useDeleteClub() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (clubId: string) => deleteClub(clubId, router),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
}
