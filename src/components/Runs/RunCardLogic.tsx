import { useDeleteRun } from "@/lib/hooks/runs/useDeleteRun";
import { useRouter } from "next/navigation";
import RunCardUI from "./RunCardUI";
import { Skeleton } from "@/components/UI/skeleton";
import { getNextIntervalDate } from "@/lib/getNextIntervalDate";
import { fetchWeatherData } from "@/lib/fetchWeatherData";
import { useRouter } from "next/navigation";

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
}

export default function RunCard({
  id,
  name,
  distance,
  locationLat,
  locationLng,

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

  // Create a more descriptive maps link with both coordinates and location name
  const mapsLink = `https://www.google.com/maps/search/${encodeURIComponent(startDescription)}/@${locationLat},${locationLng},15z`;

  return (
    <RunCardUI
      userId={userId}
      id={id}
      key={id}
      datetime={datetime}
      name={name}
      startDescription={startDescription}
      difficulty={difficulty}
      distance={distance}
      locationLat={locationLat}
      locationLng={locationLng}
      mapsLink={mapsLink}
      isAdmin={isAdmin}
    />
  );
}
