import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import { ChevronLeft, Share } from "lucide-react";
import { useRouter } from "next/navigation";
import { RunDisclaimer } from "../disclaimer";
import AddRunState from "../Runs/AddRunLogic";
import RunCard from "../Runs/RunCardLogic";
import { Button } from "../UI/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../UI/tooltip";
import ClubCard from "./ClubCard";
import ClubCardSkeleton from "./ClubCardSkeleton";

interface ClubDetailUIProps {
  club?: Club;
  runs?: Run[];

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

  slug,
  onShare,
  onDelete,
  loading,
  error,
  noData,
}: ClubDetailUIProps) {
  const router = useRouter();

  if (loading) return <ClubCardSkeleton />;
  if (error) return <p>Error: {error}</p>;
  if (noData) return <p>No club data available.</p>;

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

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center hover:bg-gray-100 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 transition-colors gap-1.5 sm:gap-2"
          >
            <ChevronLeft className="stroke-primary h-5 w-5" />
            <span className="text-primary font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onShare}
                    className="hover:bg-gray-100 rounded-lg"
                  >
                    <Share className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share club</TooltipContent>
              </Tooltip>

              {/* <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onDelete}
                    className="hover:bg-gray-100 rounded-lg"
                  >
                    <Trash className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete club</TooltipContent>
              </Tooltip> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* Club Card Section */}
        <section className="w-full">
          <ClubCard
            avatarUrl={avatarUrl}
            name={name}
            description={description}
            instagramUsername={instagramUsername ?? ""}
            stravaUsername={stravaUsername ?? ""}
            websiteUrl={websiteUrl ?? ""}
          />
        </section>

        {/* Upcoming Runs Section */}
        <section className="pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming runs</h2>
            {club && runs && runs.length > 0 && (
              <div className="shrink-0">
                <AddRunState club={club} />
              </div>
            )}
          </div>
          {runs && runs.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {runs
                ?.sort((a, b) => {
                  if (
                    a.datetime instanceof Date &&
                    b.datetime instanceof Date
                  ) {
                    return a.datetime.getTime() - b.datetime.getTime();
                  }
                  return 0;
                })
                .map((run) => (
                  <RunCard
                    id={run.id}
                    key={run.id}
                    datetime={run.datetime}
                    name={run.name}
                    startDescription={run.startDescription}
                    difficulty={run.difficulty}
                    distance={run.distance}
                    locationLat={run.location?.lat}
                    locationLng={run.location?.lng}
                    mapsLink={run.mapsLink}
                    slug={slug}
                    weekday={run.weekday || 0}
                  />
                ))}
            </div>
          )}
          {runs?.length === 0 && (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl px-4">
              <p className="text-gray-600 font-medium">
                No runs found for this club yet.
              </p>
              {club && (
                <p className="mt-2 text-gray-500">
                  <AddRunState club={club} />
                </p>
              )}
            </div>
          )}
        </section>
        <RunDisclaimer />
      </main>
    </div>
  );
}
