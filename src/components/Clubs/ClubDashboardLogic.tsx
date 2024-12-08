"use client";

import { useDeleteClub } from "@/lib/hooks/clubs/useDeleteClub";
import { useFetchClubBySlug } from "@/lib/hooks/clubs/useFetchClubs";
import { useFetchRuns } from "@/lib/hooks/runs/useFetchRuns";
import { Run } from "@/lib/types/Run";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ClubDashboardUI from "./ClubDashboardUI";

export default function ClubDashboard({
  userId,
}: {
  userId: string | undefined;
}) {
  const router = useRouter();
  const slug = useParams().slug.toString();

  const { data: club, isLoading, isError, error } = useFetchClubBySlug(slug);

  const {
    data: unFilteredRuns,
    isLoading: runsLoading,
    isError: runsError,
  } = useFetchRuns({});

  const runs = unFilteredRuns?.filter((run: Run) => run.clubId === club?.id);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard!", { icon: "📋" });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  const deleteClubMutation = useDeleteClub();

  const handleDelete = async () => {
    if (club?.id) {
      deleteClubMutation.mutate(club.id);
    }
  };

  if (isLoading)
    return (
      <ClubDashboardUI
        loading
        slug={slug}
        onShare={handleShare}
        onDelete={handleDelete}
        onAddRun={() => router.push(`/clubs/${slug}/addrun`)}
      />
    );
  if (isError)
    return (
      <ClubDashboardUI
        error={error?.message}
        slug={slug}
        onShare={handleShare}
        onDelete={handleDelete}
        onAddRun={() => router.push(`/clubs/${slug}/addrun`)}
      />
    );
  if (!club)
    return (
      <ClubDashboardUI
        noData
        slug={slug}
        onShare={handleShare}
        onDelete={handleDelete}
        onAddRun={() => router.push(`/clubs/${slug}/addrun`)}
      />
    );

  return (
    <ClubDashboardUI
      club={club}
      runs={runs}
      userId={userId}
      slug={slug}
      onShare={handleShare}
      onDelete={handleDelete}
      onAddRun={() => router.push(`/clubs/${slug}/addrun`)}
    />
  );
}
