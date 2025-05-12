import { useFetchClubs } from "@/lib/hooks/clubs/useFetchClubs";
import { useClubRunsData } from "@/lib/hooks/runs/useRunsData";
import { Run } from "@/lib/types/Run";
import { useState } from "react";
import ClubHeaderSkeleton from "./ClubHeaderSkeleton";
import SelectedClubHeaderUI from "./SelectedClubUI";

interface SelectedClubHeaderProps {
  run: Run;
  onClose?: () => void;
}

export function SelectedClubHeaderLogic({
  run,
  onClose,
}: SelectedClubHeaderProps) {
  const { data, error, isLoading } = useFetchClubs();
  const [instagramSelected, setInstagramSelected] = useState(false);

  const club = data?.find((club) => club.id === run.clubId);

  const clubId = club?.id || "";
  const { data: runs } = useClubRunsData(clubId);

  const futureRuns =
    runs?.filter((run: Run) => new Date(run.datetime) > new Date()) || [];

  const avatarUrl = club?.avatarUrl || "/assets/default-fallback-image.png";

  if (isLoading) return <ClubHeaderSkeleton />;
  if (!run.clubId) return <div>No club ID found for this run</div>;
  if (!club) return <div>Club not found</div>;

  return (
    <SelectedClubHeaderUI
      club={club}
      avatarUrl={avatarUrl}
      runs={futureRuns || []}
      onClose={onClose}
    />
  );
}
