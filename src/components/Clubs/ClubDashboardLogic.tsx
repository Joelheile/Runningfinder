"use client";

import { useDeleteClub } from "@/lib/hooks/clubs/useDeleteClub";
import { useFetchClubBySlug } from "@/lib/hooks/clubs/useFetchClubs";
import { useFetchRunsByClubId } from "@/lib/hooks/runs/useFetchRunsByClubId";
import { Club } from "@/lib/types/Club";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ClubDashboardUI from "./ClubDashboardUI";

export default function ClubDashboard() {
  const router = useRouter();
  const slug = useParams().slug.toString();

  const {
    data: club,
    isLoading,
    isError,
    error,
  } = useFetchClubBySlug(slug) as {
    data: Club | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error;
  };

  const { data: runs } = useFetchRunsByClubId(club?.id || "");
  const deleteClubMutation = useDeleteClub();

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Club link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    if (club?.id) {
      if (window.confirm("Are you sure you want to delete this club?")) {
        deleteClubMutation.mutate(club.id, {
          onSuccess: () => {
            toast.success("Club deleted successfully");
            router.push("/clubs");
          },
          onError: () => {
            toast.error("Failed to delete club");
          },
        });
      }
    }
  };

  if (isLoading)
    return (
      <ClubDashboardUI
        loading
        slug={slug}
        onShare={handleShare}
        onDelete={handleDelete}
      />
    );
  if (isError)
    return (
      <ClubDashboardUI
        error={error?.message}
        slug={slug}
        onShare={handleShare}
        onDelete={handleDelete}
      />
    );
  if (!club)
    return (
      <ClubDashboardUI
        noData
        slug={slug}
        onShare={handleShare}
        onDelete={handleDelete}
      />
    );

  return (
    <ClubDashboardUI
      club={club}
      runs={runs}
      slug={slug}
      onShare={handleShare}
      onDelete={handleDelete}
    />
  );
}
