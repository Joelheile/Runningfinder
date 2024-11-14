"use client";

import { useFetchClubBySlug } from "@/lib/hooks/clubs/useFetchClubs";
import { useFetchRunsByClubId } from "@/lib/hooks/runs/useFetchRunsByClubId";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ClubDashboardUI from "./ClubDashboardUI";

const ClubDashboard = ({ userId }: { userId: string | undefined }) => {
  const router = useRouter();
  const slug = useParams().slug.toString();

  const { data: club, isLoading, isError, error } = useFetchClubBySlug(slug);
  const {
    data: runs,
    isLoading: runsLoading,
    isError: runsError,
  } = useFetchRunsByClubId(club?.id || "");

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard!", { icon: "📋" });
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (isLoading)
    return (
      <ClubDashboardUI
        loading
        slug={slug}
        onShare={handleShare}
        onAddRun={() => router.push(`/clubs/${slug}/addrun`)}
      />
    );
  if (isError)
    return (
      <ClubDashboardUI
        error={error?.message}
        slug={slug}
        onShare={handleShare}
        onAddRun={() => router.push(`/clubs/${slug}/addrun`)}
      />
    );
  if (!club)
    return (
      <ClubDashboardUI
        noData
        slug={slug}
        onShare={handleShare}
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
      onAddRun={() => router.push(`/clubs/${slug}/addrun`)}
    />
  );
};

export default ClubDashboard;
