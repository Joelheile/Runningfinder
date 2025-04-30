import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFetchRunsByClubId } from "./useFetchRunsByClubId";

export function useClubRunsData(clubId: string | undefined) {
  const queryClient = useQueryClient();
  const effectiveClubId = clubId || "";

  const result = useFetchRunsByClubId(effectiveClubId);

  useEffect(() => {
    if (!effectiveClubId) return;

    queryClient.prefetchQuery({
      queryKey: ["runs", "club", effectiveClubId],
      queryFn: () => result.queryFn(),
    });
  }, [effectiveClubId, queryClient, result.queryFn]);

  return result;
}
