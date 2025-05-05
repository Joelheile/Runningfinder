import { Registration } from "@/lib/types/Registration";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type RegistrationStatus = boolean;
interface CheckRegistrationParams {
  userId?: string;
  runId: string;
}

export function useRegistrations() {
  const queryClient = useQueryClient();

  const invalidateRegistrations = () => {
    queryClient.invalidateQueries({ queryKey: ["registrations"] });
  };

  const invalidateUserRegistrations = (userId: string) => {
    queryClient.removeQueries({ queryKey: ["registrations", userId] });
  };

  const invalidateRegistrationStatus = (userId: string, runId: string) => {
    queryClient.removeQueries({ queryKey: ["registration", userId, runId] });
  };

  return {
    invalidateRegistrations,
    invalidateUserRegistrations,
    invalidateRegistrationStatus,
  };
}

export function useUserRegistrations(userId: string) {
  return useQuery<Registration[], Error>({
    queryKey: ["registrations", userId],
    queryFn: () => fetchRegistrationsByUserId(userId),
    enabled: !!userId,
    staleTime: 0,
    gcTime: 0,
    retry: 2,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

export function useRegistrationStatus({
  userId,
  runId,
}: CheckRegistrationParams) {
  return useQuery<RegistrationStatus, Error>({
    queryKey: ["registration", userId, runId],
    queryFn: () => checkUserRegistered({ userId, runId }),
    enabled: !!userId && !!runId,
    staleTime: 0,
    gcTime: 0,
    retry: 2,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}

async function fetchRegistrationsByUserId(
  userId: string,
): Promise<Registration[]> {
  const timestamp = Date.now();
  const response = await fetch(
    `/api/registrations/user/${userId}?_t=${timestamp}`,
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user registrations");
  }

  return response.json();
}

async function checkUserRegistered({
  userId,
  runId,
}: CheckRegistrationParams): Promise<boolean> {
  if (!userId) return false;

  const timestamp = Date.now();
  const response = await fetch(
    `/api/registrations/check?userId=${userId}&runId=${runId}&_t=${timestamp}`,
    {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to check registration status");
  }

  const data = await response.json();
  return data.isRegistered;
}
