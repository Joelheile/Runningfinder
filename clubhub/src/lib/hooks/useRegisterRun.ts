import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface RegisterRunParams {
  runId: string;
  userId: string;
}

const registerRun = async ({ runId, userId }: RegisterRunParams) => {
    console.log("registerRun", runId, userId);
  const response = await fetch("/api/registrations", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      runId,
      userId,
      status: "active"
    }),
  });

  if (!response.ok) {
    toast.error("Failed to register for run");
    throw new Error("Failed to register for run");
  }

  toast.success("Successfully registered for run");
  return response.json();
};

export function useRegisterRun() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerRun,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}