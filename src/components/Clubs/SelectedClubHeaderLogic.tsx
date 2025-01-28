import { useFetchClubs } from "@/lib/hooks/clubs/useFetchClubs";
import { useFetchRunsByClubId } from "@/lib/hooks/runs/useFetchRunsByClubId";
import { Run } from "@/lib/types/Run";
import { useState } from "react";
import ClubHeaderSkeleton from "./ClubHeaderSkeleton";
import SelectedClubHeaderUI from "./SelectedClubHeaderUI";

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

  console.log("data (clubs):", data);
  console.log("run:", run);
  console.log("run.clubId:", run.clubId);
  const club = data?.find((club) => club.id === run.clubId);
  console.log("found club:", club);
  const clubId = club?.id || "";
  const { data: runs } = useFetchRunsByClubId(clubId);
  console.log("runs", runs);
  const futureRuns =
    runs?.filter((run: Run) => run.datetime > new Date()) || [];

  if (!run.clubId) {
    return <div>No club ID found for this run</div>;
  }

  if (isLoading) {
    return <ClubHeaderSkeleton />;
  }

  if (!club) {
    return <div>Club not found</div>;
  }

  const avatarUrl = club.avatarUrl || "/assets/default-fallback-image.png";

  return (
    <SelectedClubHeaderUI
      club={club}
      avatarUrl={avatarUrl}
      runs={runs || []}
      onClose={onClose}
    />
  );
}
