import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface Club {
  id: string;
  name: string;
  description: string;
  instagramUsername?: string;
  stravaUsername?: string;
  websiteUrl?: string;
  isApproved: boolean;
  slug: string;
}

export function useClubActions() {
  const queryClient = useQueryClient();

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
    onSuccess: () => {
      // Invalidate all club-related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["unapprovedClubs"] });
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      queryClient.invalidateQueries({ queryKey: ["club"] });
      toast.success("Club updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
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
        exact: true 
      });

      // Snapshot the previous value
      const previousClubs = queryClient.getQueryData<Club[]>(["unapprovedClubs"]);

      // Optimistically update to the new value
      queryClient.setQueryData<Club[]>(["unapprovedClubs"], (old) => {
        return old?.filter(club => club.slug !== slug) ?? [];
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
          return old?.filter(club => club.slug !== variables) ?? [];
        });
        
        // Invalidate other queries but not unapprovedClubs
        await Promise.all([
          queryClient.invalidateQueries({ 
            queryKey: ["clubs"],
            refetchType: 'none' 
          }),
          queryClient.invalidateQueries({ 
            queryKey: ["club"],
            refetchType: 'none'
          })
        ]);
        
        toast.success("Club deleted successfully");
      }
    }
  });

  return {
    updateClub,
    approveClub,
    deleteClub,
  };
}
