"use client";

import { Run } from "@/lib/types/Run";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import RunCard from "./RunCardLogic";
import RunCardUISkeleton from "./RunCardUISkeleton";

type UserRunsProps = {
  userRuns: Run[];
  userId: string;
  onUnregister: (runId: string) => void;
};

export default function UserRunsUI({
  userRuns,
  userId,
  onUnregister,
}: UserRunsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center p-5">
      <button
        onClick={() => router.push("/")}
        className="absolute top-12 left-12"
      >
        <ChevronLeft className="stroke-primary stroke" />
      </button>
      <h1 className="text-2xl font-bold mt-5">Here are your next runs</h1>
      <p className="text-center mb-2">Let&apos;s go, start running!</p>

      <div className=" sm:w-full xl:w-3/4 ">
        {userRuns.length == 0 && <RunCardUISkeleton />}
        {userRuns &&
          userRuns.map((run) => (
            <RunCard
              key={run?.id}
              id={run?.id || ""}
              datetime={run?.datetime || ""}
              distance={run?.distance || ""}
              locationLat={run?.location?.lat || 0}
              locationLng={run?.location?.lng || 0}
              weekday={run?.weekday || 0}
              name={run?.name || ""}
              startDescription={run?.startDescription || ""}
              difficulty={run?.difficulty || ""}
              userId={userId}
              slug={run?.clubId || ""}
              isRegistered={true}
              isAdmin={false}
            />
          ))}
      </div>
    </div>
  );
}
