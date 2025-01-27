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
      queryClient.invalidateQueries({ queryKey: ["unapprovedClubs"] });
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
      queryClient.invalidateQueries({ queryKey: ["unapprovedClubs"] });
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
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unapprovedClubs"] });
      toast.success("Club deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    updateClub,
    approveClub,
    deleteClub,
  };
}
