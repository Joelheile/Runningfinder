"use client";

import { Run } from "@/lib/types/Run";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import RunCard from "./RunCardLogic";

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
        className="absolute top-12 left-4 md:left-12"
      >
        <ChevronLeft className="stroke-primary stroke" />
      </button>
      <h1 className="text-2xl font-bold mt-5">Here are your next runs</h1>
      <p className="text-center mb-5">Let&apos;s go, start running!</p>

      <div className="w-full max-w-4xl">
        {userRuns.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-lg">
              You haven&apos;t registered for any runs yet.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            >
              Find runs
            </button>
          </div>
        ) : (
          userRuns.map((run) => (
            <div key={run?.id} className="mb-4 relative">
              <RunCard
                id={run?.id || ""}
                datetime={run?.datetime || ""}
                distance={run?.distance || ""}
                locationLat={run?.location?.lat || 0}
                locationLng={run?.location?.lng || 0}
                weekday={run?.weekday || 0}
                name={run?.name || ""}
                startDescription={run?.startDescription || ""}
                difficulty={run?.difficulty || ""}
                slug={run?.clubId || ""}
                isRegistered={true}
                isAdmin={false}
              />
              <button
                onClick={() => onUnregister(run?.id || "")}
                className="absolute bottom-4 right-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
              >
                Unregister
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
