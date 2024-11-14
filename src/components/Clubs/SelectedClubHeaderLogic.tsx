import { useFetchClubs } from "@/lib/hooks/clubs/useFetchClubs";
import { Run } from "@/lib/types/Run";
import { useState } from "react";
import ClubHeaderSkeleton from "./ClubHeaderSkeleton";
import SelectedClubHeaderUI from "./SelectedClubHeaderUI";

export default function SelectedClubHeaderLogic({ run }: { run: Run }) {
  const { data, error, isLoading } = useFetchClubs();
  const [instagramSelected, setInstagramSelected] = useState(false);

  const club = data?.find((club) => club.id === run?.clubId);

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
      instagramSelected={instagramSelected}
      setInstagramSelected={setInstagramSelected}
    />
  );
}
