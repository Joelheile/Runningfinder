import { useDeleteRun } from "@/lib/hooks/runs/useDeleteRun";
import { useRouter } from "next/navigation";
import RunCardUI from "./RunCardUI";

interface RunCardProps {
  id: string;
  name: string;
  distance: string;
  locationLat: number;
  locationLng: number;
  weekday: number;
  datetime: Date | null;
  startDescription: string;
  difficulty: string;
  userId?: string;
  slug?: string;
  isRegistered?: boolean;
  isAdmin?: boolean;
  onUnregister?: () => void;
  mapsLink?: string | null;
}

export default function RunCard({
  id,
  name,
  distance,
  locationLat,
  locationLng,
  mapsLink,
  datetime,
  startDescription,
  difficulty,
  userId,
  slug,
  isRegistered,
  isAdmin,
  onUnregister,
}: RunCardProps) {
  const { mutate: deleteRun } = useDeleteRun();
  const router = useRouter();

  // const handleRegistration = () => {
  //   if (!userId) {
  //     router.push("/auth/login");
  //     return;
  //   }

  //   register({ runId: id, userId });
  // };

  // const handleDeleteRun = () => {
  //   if (!isAdmin) return;
  //   if (window.confirm("Are you sure you want to delete this run?")) {
  //     deleteRun(
  //       { id },
  //       {
  //         onSuccess: () => {
  //           router.refresh();
  //         },
  //       }
  //     );
  //   }
  // };

  // If no mapsLink is provided, create one from the coordinates
  const generatedMapsLink =
    locationLat && locationLng
      ? `https://www.google.com/maps/search/${encodeURIComponent(startDescription)}/@${locationLat},${locationLng},15z`
      : null;

  return (
    <RunCardUI
      id={id}
      key={id}
      datetime={datetime}
      name={name}
      startDescription={startDescription}
      difficulty={difficulty}
      distance={distance}
      mapsLink={mapsLink || generatedMapsLink}
      isAdmin={isAdmin}
    />
  );
}
