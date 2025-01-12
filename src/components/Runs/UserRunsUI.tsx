"use client";

import { Run } from "@/lib/types/Run";
import RunCard from "./RunCardLogic";
import RunCardUISkeleton from "./RunCardUISkeleton";

type UserRunsProps = {
  userRuns: Run[];
  userId: string;
};

export default function UserRunsUI({ userRuns, userId }: UserRunsProps) {
  return (
    <div>
      <h1>My Runs</h1>
      {userRuns.length == 0 && <RunCardUISkeleton />}
      {userRuns &&
        userRuns.map((run) => (
          <RunCard
            id={run?.id || ""}
            time={run?.startTime || ""}
            distance={run?.distance || 0}
            location={run?.location || { lat: 0, lng: 0 }}
            intervalDay={run?.intervalDay || 0}
            name={run?.name || ""}
            startDescription={run?.startDescription || ""}
            difficulty={run?.difficulty || ""}
            userId={userId}
            slug={run?.clubId || ""}
          />
        ))}
    </div>
  );
}
