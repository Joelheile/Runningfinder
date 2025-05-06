import { Run } from "@/lib/types/Run";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function useApproveRun() {
  const queryClient = useQueryClient();

  const approveRun = async (runId: string) => {
    try {
      const response = await fetch(`/api/runs/${runId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to approve run: ${errorText}`);
      }

      await queryClient.invalidateQueries({ queryKey: ['runs'] });
      await queryClient.invalidateQueries({ queryKey: ['runs', 'unapproved'] });
      
      toast.success("Run approved successfully");
      return response.json() as Promise<Run>;
    } catch (error) {
      console.error("Error approving run:", error);
      toast.error("Failed to approve run");
      throw error;
    }
  };

  return approveRun;
}
