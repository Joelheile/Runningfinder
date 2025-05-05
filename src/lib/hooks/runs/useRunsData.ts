import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { fetchRunsByClubId } from "./runAPIs";

export function useClubRunsData(clubId: string | undefined) {
  const queryClient = useQueryClient();
  const effectiveClubId = clubId || "";

  const queryKey = ["runs", "club", effectiveClubId];

  const result = useQuery({
    queryKey,
    queryFn: () => fetchRunsByClubId(effectiveClubId),
    staleTime: 0,
    enabled: !!effectiveClubId,
  });

  useEffect(() => {
    if (!effectiveClubId) return;

    queryClient.prefetchQuery({
      queryKey,
      queryFn: () => fetchRunsByClubId(effectiveClubId),
    });
  }, [effectiveClubId, queryClient, queryKey]);

  return result;
}

export { fetchRunsByClubId };
