import { Run } from "@/lib/types/Run";
import toast from "react-hot-toast";

export default function useApproveRun() {
  const approveRun = async (runId: string) => {
    try {
      const response = await fetch(`/api/runs/${runId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to approve run: ${errorText}`);
      }

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
