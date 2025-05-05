import { Run } from "@/lib/types/Run";
import toast from "react-hot-toast";

const addTimestamp = (url: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
};

export const fetchRuns = async (filters?: {
  minDistance?: number;
  maxDistance?: number;
  days?: number[];
  difficulty?: string;
}): Promise<Run[]> => {
  const params = new URLSearchParams();

  if (filters) {
    if (
      filters.minDistance !== undefined &&
      filters.maxDistance !== undefined
    ) {
      params.append("minDistance", filters.minDistance.toString());
      params.append("maxDistance", filters.maxDistance.toString());
    }

    if (filters.days && filters.days.length > 0) {
      params.append("weekdays", filters.days.join(","));
    }

    if (filters.difficulty) {
      params.append("difficulty", filters.difficulty);
    }
  }

  const queryString = params.toString();
  const url = queryString ? `/api/runs?${queryString}` : `/api/runs`;

  const response = await fetch(addTimestamp(url), {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch runs");
  }

  return response.json();
};

export const fetchRunsByClubId = async (clubId: string): Promise<Run[]> => {
  if (!clubId) return [];

  const response = await fetch(addTimestamp(`/api/runs/club/${clubId}`), {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch runs by club ID");
  }

  return response.json();
};

export const fetchRunById = async (runId: string): Promise<Run> => {
  if (!runId) throw new Error("Run ID is required");

  const response = await fetch(addTimestamp(`/api/runs/${runId}`), {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch run by ID");
  }

  return response.json();
};

export const addRun = async (newRun: Run): Promise<Run> => {
  const response = await fetch("/api/runs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRun),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to add run:", errorText);
    toast.error(`Failed to add run: ${errorText}`);
    throw new Error(`Failed to add run: ${errorText}`);
  }

  toast.success("Run added successfully! It will now be reviewed.");
  return response.json();
};

export const updateRun = async (
  id: string,
  data: Partial<Run>,
): Promise<Run> => {
  const response = await fetch(`/api/runs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    toast.error(`Failed to update run: ${errorText}`);
    throw new Error(`Failed to update run: ${errorText}`);
  }

  toast.success("Run updated successfully");
  return response.json();
};

export const deleteRun = async (runId: string): Promise<string> => {
  const response = await fetch(`/api/runs`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: runId }),
  });

  if (!response.ok) {
    toast.error("Failed to delete run");
    throw new Error("Failed to delete run");
  }

  toast.success("Run deleted successfully");
  return runId;
};
