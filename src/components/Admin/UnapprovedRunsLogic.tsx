"use client";

import useAdminUpdateRun from "@/lib/hooks/admin/runs/useAdminUpdateRun";
import useApproveRun from "@/lib/hooks/admin/runs/useApproveRun";
import { useUnapprovedRuns } from "@/lib/hooks/admin/runs/useUnapprovedRuns";
import { Run } from "@/lib/types/Run";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import UnapprovedRunsUI from "./UnapprovedRunsUI";

export default function UnapprovedRunsLogic() {
  const router = useRouter();
  const { data: runs, refetch, isLoading, isError } = useUnapprovedRuns();
  const updateRun = useAdminUpdateRun();
  const approveRun = useApproveRun();

  // Force refresh on initial load
  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleUpdateRun = async (runId: string, updateData: Partial<Run>) => {
    try {
      await updateRun.mutateAsync({ runId, updateData });
      await refetch();
      router.refresh();
    } catch (error) {
      console.error("Failed to update run:", error);
      toast.error("Failed to update run");
    }
  };

  const handleApproveRun = async (runId: string) => {
    try {
      await approveRun(runId);
      await refetch();
      router.refresh();
    } catch (error) {
      console.error("Failed to approve run:", error);
      toast.error("Failed to approve run");
    }
  };

  const handleDeleteRun = async (runId: string) => {
    try {
      const response = await fetch(`/api/runs/${runId}`, {
        method: "DELETE",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete run");
      }
      await refetch();
      router.refresh();
      toast.success("Run deleted successfully");
    } catch (error) {
      console.error("Failed to delete run:", error);
      toast.error("Failed to delete run");
    }
  };

  if (isLoading) return <div>Loading unapproved runs...</div>;
  if (isError)
    return <div>Error loading unapproved runs. Please try again.</div>;
  if (!runs) return <div>No unapproved runs data available.</div>;

  return (
    <UnapprovedRunsUI
      runs={runs}
      handleUpdateRun={handleUpdateRun}
      handleApproveRun={handleApproveRun}
      handleDeleteRun={handleDeleteRun}
    />
  );
}
