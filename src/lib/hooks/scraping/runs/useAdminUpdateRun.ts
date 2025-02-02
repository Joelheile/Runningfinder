import { Run } from "@/lib/types/Run";
import toast from "react-hot-toast";

export default async function useAdminUpdateRun(runId: string, updateData: Partial<Run>) {
  try {
    const response = await fetch(`/api/runs/${runId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update run: ${errorText}`);
    }

    toast.success("Run updated successfully");
    return response.json() as Promise<Run>;
  } catch (error) {
    console.error("Error updating run:", error);
    toast.error("Failed to update run");
    throw error;
  }
}
