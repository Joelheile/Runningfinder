import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface RunUpdateData {
  slug: string;
  name?: string;
  description?: string;
  date?: Date;
  difficulty?: string;
  distance?: string;
  startDescription?: string;
  isApproved?: boolean;
  isRecurrent?: boolean;
  instagramUsername?: string;
  profileUrl?: string;
}

export function useRunActions() {
  const queryClient = useQueryClient();

  const updateRun = useMutation({
    mutationFn: async ({ slug, ...data }: RunUpdateData) => {
      const response = await fetch(`/api/runs/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update run");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      toast.success("Run updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const approveRun = useMutation({
    mutationFn: async (slug: string) => {
      const response = await fetch(`/api/runs/${slug}/approve`, {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to approve run");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      toast.success("Run approved successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteRun = useMutation({
    mutationFn: async (slug: string) => {
      const response = await fetch(`/api/runs/${slug}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete run");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      toast.success("Run deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    updateRun,
    approveRun,
    deleteRun,
  };
}
