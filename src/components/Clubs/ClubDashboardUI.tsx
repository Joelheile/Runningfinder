import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import { ChevronLeft, Plus, Share } from "lucide-react";
import Link from "next/link";
import RunCard from "../Runs/RunCardLogic";
import { Button } from "../UI/button";
import ClubCard from "./ClubCard";
import ClubCardSkeleton from "./ClubCardSkeleton";

interface ClubDetailUIProps {
  club?: Club;
  runs?: Run[];
  userId?: string;
  slug: string;
  onShare: () => void;
  onAddRun: () => void;
  loading?: boolean;
  error?: string;
  noData?: boolean;
}

export default function ClubDashboardUI({
  club,
  runs,
  userId,
  slug,
  onShare,
  onAddRun,
  loading,
  error,
  noData,
}: ClubDetailUIProps) {
  if (loading) return <ClubCardSkeleton />;
  if (error) return <p>Error: {error}</p>;
  if (noData) return <p>No club data available.</p>;

  const { name, description, avatarUrl, instagramUsername, websiteUrl } =
    club || {
      name: "",
      description: "",
      avatarUrl: "",
      instagramUsername: "",
      websiteUrl: "",
    };

  return (
    <div className="flex flex-col bg-light w-screen max-w-full h-screen p-8">
      <nav className="flex justify-between">
        <Link href="/clubs/">
          <div className="flex">
            <ChevronLeft className="stroke-primary stroke" />
            <span className="Back text-primary">Back</span>
          </div>
        </Link>
        <div className="flex gap-2">
          <button type="button" onClick={onAddRun}>
            <Plus className="stroke-primary" />
          </button>
          <button onClick={onShare}>
            <Share className="stroke-primary" />
          </button>
        </div>
      </nav>

      <ClubCard
        avatarUrl={avatarUrl}
        name={name}
        description={description}
        instagramUsername={instagramUsername}
        websiteUrl={websiteUrl}
      />

      <div className="mt-4 p-8">
        <h2 className="mb-2 text-lg sm:text-xl md:text-2xl">Upcoming runs</h2>
        {runs?.length === 0 && (
          <>
            <p>
              There are no upcoming runs for <strong>{name}</strong>.{" "}
            </p>
            <br />
            <Button onClick={onAddRun}>Add first run 🏃‍♂️</Button>
          </>
        )}
        {runs
          ?.sort((a, b) => a.intervalDay - b.intervalDay)
          .map((run) => (
            <RunCard
              userId={userId}
              id={run.id}
              key={run.id}
              time={run.startTime}
              intervalDay={run.intervalDay}
              name={run.name}
              startDescription={run.startDescription}
              difficulty={run.difficulty}
              distance={run.distance}
              location={run.location}
              slug={slug}
            />
          ))}
      </div>
    </div>
  );
}
