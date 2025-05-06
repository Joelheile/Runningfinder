import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import { ChevronLeft, Heart, Share } from "lucide-react";
import { useRouter } from "next/navigation";
import { RunDisclaimer } from "../disclaimer";
import AddRunState from "../Runs/AddRunLogic";
import RunCard from "../Runs/RunCardLogic";
import { Button } from "../UI/button";
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

  const upcomingRuns = runs?.filter((run) => !run.isPast) || [];
  const pastRuns = runs?.filter((run) => run.isPast) || [];

  const sortedUpcomingRuns = [...upcomingRuns].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  const sortedPastRuns = [...pastRuns].sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-safe">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-2 sm:px-6 lg:px-8 py-2 sm:py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center hover:bg-gray-100 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 transition-colors gap-1 sm:gap-2"
          >
            <ChevronLeft className="stroke-primary h-5 w-5" />
            <span className="text-primary text-sm sm:text-base font-medium">
              Back
            </span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/runs/liked")}
                className="hover:bg-gray-100 rounded-lg"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onShare}
                className="hover:bg-gray-100 rounded-lg"
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-8">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Upcoming runs
            </h2>
            {club && runs && runs.length > 0 && (
              <div className="shrink-0">
                <AddRunState club={club} />
              </div>
            )}
          </div>
          {sortedUpcomingRuns.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {sortedUpcomingRuns.map((run) => (
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
          {upcomingRuns.length === 0 && pastRuns.length === 0 && (
            <div className="text-center py-6 sm:py-12 bg-gray-50 rounded-xl px-3 sm:px-4">
              <p className="text-gray-600 text-sm sm:text-base font-medium">
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

        {/* Past Runs Section */}
        {sortedPastRuns.length > 0 && (
          <section className="pt-4">
            <div className="mb-3 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-500">
                Past runs
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 opacity-60 grayscale">
              {sortedPastRuns.map((run) => (
                <div key={run.id} className="pointer-events-none">
                  <RunCard
                    id={run.id}
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
                    isPast={true}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <RunDisclaimer />
      </main>
    </div>
  );
}
