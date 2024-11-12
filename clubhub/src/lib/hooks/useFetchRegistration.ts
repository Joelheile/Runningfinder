import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UseFetchRegistrationParams {
  runId: string;
  userId: string;
}

const fetchRegistration = async ({
  runId,
  userId,
}: UseFetchRegistrationParams) => {
  const response = await fetch("/api/registrations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      runId,
      userId,
    }),
  });

  if (!response.ok) {
    toast.error("Failed to fetch registration status");
    throw new Error("Failed to fetch registration status");
  }

  return response.json();
};

export function useFetchRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchRegistration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
  });
}
