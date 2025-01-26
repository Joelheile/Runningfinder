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
  date: Date | null;
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
  weekday,
  date,
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

  const handleDeleteRun = () => {
    if (!isAdmin) return;
    deleteRun(id);
  };

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${locationLat},${locationLng}`;

  return (
    <div className="run-card">
      <RunCardUI
        id={id}
        key={id}
        weekday={weekday}
        date={date}
        name={name}
        distance={distance}
        difficulty={difficulty}
        startDescription={startDescription}
        mapsLink={mapsLink}
        location={{ lat: locationLat, lng: locationLng }}
        // handleRegistration={handleRegistration}
        handleDeleteRun={isAdmin ? handleDeleteRun : undefined}
        isAdmin={isAdmin}
      />
    </div>
  );
}
