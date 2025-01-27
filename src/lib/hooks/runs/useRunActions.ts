import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface RunUpdateData {
  id: string;
  name?: string;
  description?: string;
  datetime?: Date;
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
    mutationFn: async ({ id, ...data }: RunUpdateData) => {
      console.log("Updating run with data:", { id, ...data });
      const response = await fetch(`/api/runs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error("API Error:", result);
        throw new Error(result.error || "Failed to update run");
      }

      if (!result.success && result.message === "Run not found") {
        // Handle non-existent run gracefully
        return { success: false, message: "Run no longer exists" };
      }
      
      return result;
    },
    onSuccess: (data) => {
      if (!data.success && data.message) {
        toast.error(data.message);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      queryClient.invalidateQueries({ queryKey: ["runs", "unapproved"] });
      toast.success("Run updated successfully");
    },
    onError: (error: Error) => {
      console.error("Mutation Error:", error);
      toast.error(error.message);
    },
  });

  const approveRun = useMutation({
    mutationFn: async (id: string) => {
      console.log("Approving run:", id);
      const response = await fetch(`/api/runs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error("API Error:", result);
        throw new Error(result.error || "Failed to approve run");
      }

      if (!result.success && result.message === "Run not found") {
        return { success: false, message: "Run no longer exists" };
      }
      
      return result;
    },
    onSuccess: (data) => {
      if (!data.success && data.message) {
        toast.error(data.message);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      queryClient.invalidateQueries({ queryKey: ["runs", "unapproved"] });
      toast.success("Run approved successfully");
    },
    onError: (error: Error) => {
      console.error("Mutation Error:", error);
      toast.error(error.message);
    },
  });

  const deleteRun = useMutation({
    mutationFn: async (id: string) => {
      console.log("Deleting run:", id);
      const response = await fetch(`/api/runs/${id}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error("API Error:", result);
        throw new Error(result.error || "Failed to delete run");
      }
      
      // Both cases are considered success for deletion
      if (result.success && result.message === "Run already deleted") {
        return { success: true, message: result.message };
      }
      
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["runs"] });
      queryClient.invalidateQueries({ queryKey: ["runs", "unapproved"] });
      if (data.message === "Run already deleted") {
        toast.success("Run was already removed");
      } else {
        toast.success("Run deleted successfully");
      }
    },
    onError: (error: Error) => {
      console.error("Mutation Error:", error);
      toast.error(error.message);
    },
  });

  return {
    updateRun,
    approveRun,
    deleteRun,
  };
}
