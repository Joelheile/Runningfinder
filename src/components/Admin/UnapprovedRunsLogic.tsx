"use client";

import useAdminUpdateRun from "@/lib/hooks/scraping/runs/useAdminUpdateRun";
import useApproveRun from "@/lib/hooks/scraping/runs/useApproveRun";
import { useUnapprovedRuns } from "@/lib/hooks/scraping/runs/useUnapprovedRuns";
import { Run } from "@/lib/types/Run";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import UnapprovedRunsUI from "./UnapprovedRunsUI";

export default function UnapprovedRunsLogic() {
  const router = useRouter();
  const { data: runs, refetch } = useUnapprovedRuns();

  const handleUpdateRun = async (runId: string, updateData: Partial<Run>) => {
    try {
      await useAdminUpdateRun(runId, updateData);

      await refetch();
      router.refresh();
    } catch (error) {
      console.error("Failed to update run:", error);
      toast.error("Failed to update run");
    }
  };

  const handleApproveRun = async (runId: string) => {
    try {
      await useApproveRun(runId);
      await refetch();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error("Failed to approve run:", error);
      toast.error("Failed to approve run");
    }
  };

  const handleDeleteRun = async (runId: string) => {
    try {
      const response = await fetch(`/api/runs/${runId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete run");
      }
      await refetch();
      router.refresh();
      toast.success("Run deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete run:", error);
      toast.error("Failed to delete run");
    }
  };

  if (!runs) return <div>Loading...</div>;

  return (
    <UnapprovedRunsUI
      runs={runs}
      handleUpdateRun={handleUpdateRun}
      handleApproveRun={handleApproveRun}
      handleDeleteRun={handleDeleteRun}
    />
  );
}
