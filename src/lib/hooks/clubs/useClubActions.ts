import { Club } from "@/lib/types/Club";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useClubActions() {
  const queryClient = useQueryClient();

  const deleteClub = useMutation({
    mutationFn: async (slug: string) => {
      const response = await fetch(`/api/clubs/${slug}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete club");
      }
      return { slug };
    },
    onMutate: async (slug: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["unapprovedClubs"],
        exact: true,
      });

      // Snapshot the previous value
      const previousClubs = queryClient.getQueryData<Club[]>([
        "unapprovedClubs",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<Club[]>(["unapprovedClubs"], (old) => {
        return old?.filter((club) => club.slug !== slug) ?? [];
      });

      // Return a context object with the snapshotted value
      return { previousClubs };
    },
    onError: (err, slug, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["unapprovedClubs"], context?.previousClubs);
      toast.error(err instanceof Error ? err.message : "Failed to delete club");
    },
    onSettled: async (data, error, variables, context) => {
      if (!error) {
        // Update the cache without triggering a refetch
        queryClient.setQueryData<Club[]>(["unapprovedClubs"], (old) => {
          return old?.filter((club) => club.slug !== variables) ?? [];
        });

        // Invalidate other queries but prevent automatic refetches
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["clubs"],
            refetchType: "none",
          }),
          queryClient.invalidateQueries({
            queryKey: ["club"],
            refetchType: "none",
          }),
        ]);

        toast.success("Club deleted successfully");
      }
    },
  });

  const updateClub = useMutation({
    mutationFn: async (data: Partial<Club>) => {
      const response = await fetch(`/api/clubs/${data.slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update club");
      }
      return response.json();
    },
    onMutate: async (newClub: Partial<Club>) => {
      await queryClient.cancelQueries({ queryKey: ["clubs", newClub.slug] });
      await queryClient.cancelQueries({ queryKey: ["unapprovedClubs"] });

      // Snapshot the previous values
      const previousClub = queryClient.getQueryData<Club>([
        "clubs",
        newClub.slug,
      ]);
      const previousUnapprovedClubs = queryClient.getQueryData<Club[]>([
        "unapprovedClubs",
      ]);

      // Optimistically update
      if (newClub.slug) {
        queryClient.setQueryData<Club>(["clubs", newClub.slug], (old) => {
          if (!old) return old;
          return {
            ...old,
            ...newClub,
          } as Club;
        });
      }

      queryClient.setQueryData<Club[]>(["unapprovedClubs"], (old) => {
        if (!old) return [];
        return old.map((club) =>
          club.slug === newClub.slug ? { ...club, ...newClub } : club,
        );
      });

      return { previousClub, previousUnapprovedClubs };
    },
    onError: (err, newClub, context) => {
      // Revert optimistic updates on error
      if (newClub.slug && context?.previousClub) {
        queryClient.setQueryData(["clubs", newClub.slug], context.previousClub);
      }
      if (context?.previousUnapprovedClubs) {
        queryClient.setQueryData(
          ["unapprovedClubs"],
          context.previousUnapprovedClubs,
        );
      }
      toast.error(err instanceof Error ? err.message : "Failed to update club");
    },
    onSettled: async (data, error, variables) => {
      if (!error) {
        // Invalidate affected queries but prevent automatic refetches
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["clubs"],
            refetchType: "none",
          }),
          queryClient.invalidateQueries({
            queryKey: ["unapprovedClubs"],
            refetchType: "none",
          }),
          variables.slug &&
            queryClient.invalidateQueries({
              queryKey: ["clubs", variables.slug],
              refetchType: "none",
            }),
        ]);
        toast.success("Club updated successfully");
      }
    },
  });

  const approveClub = useMutation({
    mutationFn: async (slug: string) => {
      const response = await fetch(`/api/clubs/${slug}/approve`, {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to approve club");
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate all club-related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["unapprovedClubs"] });
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      queryClient.invalidateQueries({ queryKey: ["club"] });
      toast.success("Club approved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    deleteClub,  
    updateClub,
    approveClub,
  };
}
