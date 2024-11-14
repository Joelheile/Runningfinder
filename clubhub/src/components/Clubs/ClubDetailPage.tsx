"use client";

import { useFetchClubBySlug } from "@/lib/hooks/clubs/useFetchClubs";

import { ChevronLeft, Plus, Share } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useFetchRunsByClubId } from "@/lib/hooks/runs/useFetchRunsByClubId";
import toast from "react-hot-toast";
import RunCard from "../Runs/RunCard";
import ClubCard from "./ClubCard";
import ClubCardSkeleton from "./ClubCardSkeleton";

const ClubDetailPage = ({ userId }: { userId: string | undefined }) => {
  const router = useRouter();
  const slug = useParams().slug.toString();

  const { data: club, isLoading, isError, error } = useFetchClubBySlug(slug);

  const {
    data: runs,
    isLoading: runsLoading,
    isError: runsError,
  } = useFetchRunsByClubId(club?.id || "");

  if (isLoading) {
    return <ClubCardSkeleton />;
  }

  if (isError) return <p>Error: {error?.message}</p>;

  if (!club) return <p>No club data available.</p>;

  const { name, description, avatarUrl, instagramUsername, websiteUrl } = club;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard!", { icon: "📋" });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="flex flex-col bg-light w-screen  max-w-full h-screen p-8">
      <nav className="flex justify-between">
        <Link href="/clubs/">
          <div className="flex">
            <ChevronLeft className="stroke-primary stroke" />
            <span className="Back text-primary">Back</span>
          </div>
        </Link>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push(`/clubs/${slug}/addrun`)}
          >
            <Plus className="stroke-primary" />
          </button>
          <button onClick={handleShare}>
            <Share className="stroke-primary" />
          </button>
        </div>
      </nav>

      <ClubCard
        avatarUrl={avatarUrl}
        name={club.name}
        description={club.description}
        instagramUsername={club.instagramUsername}
        websiteUrl={club.websiteUrl}
      />
      <div className="mt-4 p-8">
        <h2 className="mb-2 text-lg sm:text-xl md:text-2xl">Upcoming runs</h2>
        {runs
          ?.sort((a, b) => a.intervalDay - b.intervalDay)
          .map((run) => (
            <>
              <RunCard
                userId={userId}
                id={run.id}
                key={run.id}
                time={run.startTime}
                intervalDay={run.intervalDay}
                name={run.name}
                startDescription={run.startDescription}
                difficulty={run.difficulty}
                distance={5}
                location={run.location}
                slug={slug}
              />
            </>
          ))}
      </div>
    </div>
  );
};

export default ClubDetailPage;
