"use client";

import { Run } from "@/lib/types/Run";
import { ChevronLeft, MapPin, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../UI/button";
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
    <div className="flex flex-col items-center p-5 max-w-5xl mx-auto">
      <div className="w-full flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center hover:bg-gray-100 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 transition-colors gap-1 sm:gap-2"
        >
          <ChevronLeft className="stroke-primary h-5 w-5" />
          <span className="text-primary text-sm sm:text-base font-medium">
            Back
          </span>
        </button>
        <h1 className="text-2xl font-bold">Your dashboard</h1>
        <div className="w-24"></div>
      </div>

      <div className="w-full flex justify-center gap-4 mb-8">
        <Button onClick={() => router.push("/clubs")} variant="outline">
          <Users className="h-5 w-5 mr-1" />
          <span> All clubs</span>
        </Button>
        <Button onClick={() => router.push("/")} variant="outline">
          <MapPin className="h-5 w-5 mr-1" />
          <span> View map</span>
        </Button>
      </div>

      <div className="w-full">
        <h2 className="text-xl font-semibold mb-4">Your upcoming runs</h2>
        {userRuns.length === 0 ? (
          <div className="text-center p-8 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-lg mb-4">
              You haven&apos;t registered for any runs yet.
            </p>
            <Button onClick={() => router.push("/")}>Find runs</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {userRuns.map((run) => (
              <div key={run?.id} className="relative">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
