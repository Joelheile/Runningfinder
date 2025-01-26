import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import { ChevronLeft, Share, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AddRunState from "../Runs/AddRunLogic";
import RunCard from "../Runs/RunCardLogic";
import { Button } from "../UI/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../UI/tooltip";
import ClubCard from "./ClubCard";
import ClubCardSkeleton from "./ClubCardSkeleton";

interface ClubDetailUIProps {
  club?: Club;
  runs?: Run[];
  userId?: string;
  slug: string;
  onShare: () => void;
  onDelete: () => void;
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
  onDelete,
  loading,
  error,
  noData,
}: ClubDetailUIProps) {
  if (loading) return <ClubCardSkeleton />;
  if (error) return <p>Error: {error}</p>;
  if (noData) return <p>No club data available.</p>;

  const router = useRouter();

  const {
    name,
    description,
    avatarUrl,
    instagramUsername,
    websiteUrl,
    stravaUsername,
  } = club || {
    name: "",
    description: "",
    avatarUrl: "",
    instagramUsername: "",
    websiteUrl: "",
    stravaUsername: "",
  };
  console.log("runs", runs);

  return (
    <div className="flex flex-col w-screen max-w-full h-screen p-8">
      <nav className="flex justify-between items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center hover:bg-slate-100 rounded-md px-2 py-1 transition-colors"
        >
          <div className="flex items-center hover:bg-slate-100 rounded-md px-2 py-1 transition-colors">
            <ChevronLeft className="stroke-primary" />
            <span className="text-primary">Back</span>
          </div>
        </button>
        <div className="flex gap-3">
          {club && <AddRunState club={club} />}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onShare}
                className="hover:bg-slate-100"
              >
                <Share className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share club</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="hover:bg-slate-100"
              >
                <Trash className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete club</TooltipContent>
          </Tooltip>
        </div>
      </nav>

      <ClubCard
        avatarUrl={avatarUrl}
        name={name}
        description={description}
        instagramUsername={instagramUsername}
        stravaUsername={stravaUsername}
        websiteUrl={websiteUrl}
      />

      <div className="mt-4 px-32">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
            Upcoming runs
          </h2>
          {club && runs && runs.length > 0 && <AddRunState club={club} />}
        </div>

        {runs && runs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 p-6">
            {runs
              ?.sort((a, b) =>
                a.date && b.date ? a.date.getTime() - b.date.getTime() : 0
              )
              .map((run) => (
                <RunCard
                  userId={userId}
                  id={run.id}
                  key={run.id}
                  date={run.date}
                  name={run.name}
                  startDescription={run.startDescription}
                  difficulty={run.difficulty}
                  distance={run.distance}
                  locationLat={run.location.lat}
                  locationLng={run.location.lng}
                  slug={slug}
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No runs found for this club yet.</p>
            {userId && (
              <p className="mt-2">
                <Link
                  href={`/clubs/${slug}/runs/new`}
                  className="text-blue-500 hover:underline"
                >
                  Create the first run
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
