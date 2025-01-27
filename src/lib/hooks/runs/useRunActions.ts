import { Run } from "@/lib/types/Run";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useRunActions() {
  const queryClient = useQueryClient();

  const deleteRun = useMutation({
    mutationFn: async (runId: string) => {
      const response = await fetch(`/api/runs/${runId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete run");
      }
      return { runId };
    },
    onMutate: async (runId: string) => {
      // Cancel any outgoing refetches
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["runs"], exact: true }),
        queryClient.cancelQueries({
          queryKey: ["unapprovedRuns"],
          exact: true,
        }),
      ]);

      // Snapshot the previous values
      const previousRuns = queryClient.getQueryData<Run[]>(["runs"]);
      const previousUnapprovedRuns = queryClient.getQueryData<Run[]>([
        "unapprovedRuns",
      ]);

      // Optimistically update both caches
      queryClient.setQueryData<Run[]>(
        ["runs"],
        (old) => old?.filter((run) => run.id !== runId) ?? [],
      );
      queryClient.setQueryData<Run[]>(
        ["unapprovedRuns"],
        (old) => old?.filter((run) => run.id !== runId) ?? [],
      );

      return { previousRuns, previousUnapprovedRuns };
    },
    onError: (err, runId, context) => {
      // Revert optimistic updates on error
      if (context?.previousRuns) {
        queryClient.setQueryData(["runs"], context.previousRuns);
      }
      if (context?.previousUnapprovedRuns) {
        queryClient.setQueryData(
          ["unapprovedRuns"],
          context.previousUnapprovedRuns,
        );
      }
      toast.error(err instanceof Error ? err.message : "Failed to delete run");
    },
    onSettled: async (data, error) => {
      if (!error) {
        // Invalidate affected queries but prevent automatic refetches
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["runs"],
            refetchType: "none",
          }),
          queryClient.invalidateQueries({
            queryKey: ["unapprovedRuns"],
            refetchType: "none",
          }),
        ]);
        toast.success("Run deleted successfully");
      }
    },
  });

  const updateRun = useMutation({
    mutationFn: async (data: Partial<Run>) => {
      const response = await fetch(`/api/runs/${data.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update run");
      }
      return response.json();
    },
    onMutate: async (newRun: Partial<Run>) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["runs", newRun.id] }),
        queryClient.cancelQueries({ queryKey: ["runs"] }),
        queryClient.cancelQueries({ queryKey: ["unapprovedRuns"] }),
      ]);

      // Snapshot previous values
      const previousRun = queryClient.getQueryData<Run>(["runs", newRun.id]);
      const previousRuns = queryClient.getQueryData<Run[]>(["runs"]);
      const previousUnapprovedRuns = queryClient.getQueryData<Run[]>([
        "unapprovedRuns",
      ]);

      // Optimistically update
      if (newRun.id) {
        queryClient.setQueryData<Run>(["runs", newRun.id], (old) => {
          if (!old) return old;
          return {
            ...old,
            ...newRun,
          } as Run;
        });
      }

      // Update run lists
      const updateRunInList = (runs: Run[] | undefined) => {
        if (!runs) return [];
        return runs.map((run) =>
          run.id === newRun.id ? { ...run, ...newRun } : run,
        );
      };

      queryClient.setQueryData<Run[]>(["runs"], (old) => updateRunInList(old));
      queryClient.setQueryData<Run[]>(["unapprovedRuns"], (old) =>
        updateRunInList(old),
      );

      return { previousRun, previousRuns, previousUnapprovedRuns };
    },
    onError: (err, newRun, context) => {
      // Revert all optimistic updates
      if (newRun.id && context?.previousRun) {
        queryClient.setQueryData(["runs", newRun.id], context.previousRun);
      }
      if (context?.previousRuns) {
        queryClient.setQueryData(["runs"], context.previousRuns);
      }
      if (context?.previousUnapprovedRuns) {
        queryClient.setQueryData(
          ["unapprovedRuns"],
          context.previousUnapprovedRuns,
        );
      }
      toast.error(err instanceof Error ? err.message : "Failed to update run");
    },
    onSettled: async (data, error, variables) => {
      if (!error) {
        // Invalidate affected queries but prevent automatic refetches
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["runs"],
            refetchType: "none",
          }),
          queryClient.invalidateQueries({
            queryKey: ["unapprovedRuns"],
            refetchType: "none",
          }),
          variables.id &&
            queryClient.invalidateQueries({
              queryKey: ["runs", variables.id],
              refetchType: "none",
            }),
        ]);
        toast.success("Run updated successfully");
      }
    },
  });

  const approveRun = useMutation({
    mutationFn: async (runId: string) => {
      const response = await fetch(`/api/runs/${runId}/approve`, {
        method: "POST",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to approve run");
      }
      return response.json();
    },
    onMutate: async (runId: string) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["runs"] }),
        queryClient.cancelQueries({ queryKey: ["unapprovedRuns"] }),
      ]);

      const previousRuns = queryClient.getQueryData<Run[]>(["runs"]);
      const previousUnapprovedRuns = queryClient.getQueryData<Run[]>([
        "unapprovedRuns",
      ]);

      // Optimistically move run from unapproved to approved
      queryClient.setQueryData<Run[]>(
        ["unapprovedRuns"],
        (old) => old?.filter((run) => run.id !== runId) ?? [],
      );

      const runToApprove = previousUnapprovedRuns?.find(
        (run) => run.id === runId,
      );
      if (runToApprove) {
        queryClient.setQueryData<Run[]>(["runs"], (old) => [
          ...(old ?? []),
          { ...runToApprove, isApproved: true },
        ]);
      }

      return { previousRuns, previousUnapprovedRuns };
    },
    onError: (err, runId, context) => {
      if (context?.previousRuns) {
        queryClient.setQueryData(["runs"], context.previousRuns);
      }
      if (context?.previousUnapprovedRuns) {
        queryClient.setQueryData(
          ["unapprovedRuns"],
          context.previousUnapprovedRuns,
        );
      }
      toast.error(err instanceof Error ? err.message : "Failed to approve run");
    },
    onSettled: async (data, error) => {
      if (!error) {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["runs"],
            refetchType: "none",
          }),
          queryClient.invalidateQueries({
            queryKey: ["unapprovedRuns"],
            refetchType: "none",
          }),
        ]);
        toast.success("Run approved successfully");
      }
    },
  });

  return {
    deleteRun,
    updateRun,
    approveRun,
  };
}
