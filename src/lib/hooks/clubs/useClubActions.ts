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
      console.log('Starting club update with data:', data);
      
      const response = await fetch(`/api/clubs/${data.slug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Club update failed:', responseData);
        throw new Error(responseData.error || "Failed to update club");
      }

      console.log('Club update successful:', responseData);
      return responseData;
    },
    onMutate: async (newClub: Partial<Club>) => {
      console.log('Starting optimistic update for club:', newClub.slug);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["clubs", newClub.slug] });
      await queryClient.cancelQueries({ queryKey: ["unapprovedClubs"] });

      // Snapshot the previous values
      const previousClub = queryClient.getQueryData<Club>(["clubs", newClub.slug]);
      const previousUnapprovedClubs = queryClient.getQueryData<Club[]>(["unapprovedClubs"]);

      console.log('Previous state:', { previousClub, previousUnapprovedClubs });

      // Optimistically update
      if (newClub.slug) {
        queryClient.setQueryData<Club>(["clubs", newClub.slug], (old) => {
          if (!old) return old;
          const updated = {
            ...old,
            ...newClub,
          } as Club;
          console.log('Optimistically updated club:', updated);
          return updated;
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
      console.error('Update error:', err);
      
      // Revert optimistic updates on error
      if (newClub.slug && context?.previousClub) {
        console.log('Reverting club data to:', context.previousClub);
        queryClient.setQueryData(["clubs", newClub.slug], context.previousClub);
      }
      
      if (context?.previousUnapprovedClubs) {
        console.log('Reverting unapproved clubs to:', context.previousUnapprovedClubs);
        queryClient.setQueryData(["unapprovedClubs"], context.previousUnapprovedClubs);
      }
      
      // Force refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["clubs", newClub.slug] });
      queryClient.invalidateQueries({ queryKey: ["unapprovedClubs"] });
      
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
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to approve club");
      }
      
      const data = await response.json();
      console.log('Approval response:', data);
      
      if (!data.isApproved) {
        throw new Error('Club was not properly approved');
      }
      
      return data;
    },
    onMutate: async (slug: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["unapprovedClubs"] });

      // Snapshot the previous value
      const previousUnapprovedClubs = queryClient.getQueryData<Club[]>(["unapprovedClubs"]);

      // Optimistically update by removing the approved club
      queryClient.setQueryData<Club[]>(["unapprovedClubs"], (old) => {
        if (!old) return [];
        return old.filter((club) => club.slug !== slug);
      });

      return { previousUnapprovedClubs };
    },
    onError: (err, slug, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["unapprovedClubs"], context?.previousUnapprovedClubs);
      toast.error(err instanceof Error ? err.message : "Failed to approve club");
      console.error('Club approval error:', err);
      
      // Refetch to ensure UI is in sync
      queryClient.invalidateQueries({ 
        queryKey: ["unapprovedClubs"],
        refetchType: "active",
      });
    },
    onSuccess: (data) => {
      console.log('Mutation success, approved club:', data);
      toast.success("Club approved successfully");
      
      // Remove all club-related cache and force refetch
      queryClient.removeQueries({ queryKey: ["unapprovedClubs"] });
      queryClient.invalidateQueries({
        queryKey: ["unapprovedClubs"],
        refetchType: "all",
        exact: true
      });
    },
  });

  return {
    deleteClub,
    updateClub,
    approveClub,
  };
}
