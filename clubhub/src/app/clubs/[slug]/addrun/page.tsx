"use client";
import AddClub from "@/components/clubs/AddClub";
import AddRun from "@/components/runs/AddRun";
import { useState } from "react";
import { Run } from "@/lib/types/Run";
import { useParams } from "next/navigation";
import { useFetchClubBySlug, useFetchClubs } from "@/lib/hooks/useFetchClubs";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/authentication/auth";
import AddRunSkeleton from "@/components/runs/addRunSkeleton";

export default  function AddRunsPage() {
  const slug = useParams().slug.toString();

  const {
    data: club,
    isLoading: clubsLoading,
    error: clubsError,
  } = useFetchClubBySlug(slug);

  return (
    <div className="flex-col p-10 items-center w-2/3 mx-auto">
      {club && (
        <h1 className="text-2xl font-bold mb-4">Add Runs to "{club?.name}"</h1>
      )}

      <div className="flex flex-col gap-6 w-full">
        {club && (
          <>
            <AddRun club={club} />
          </>
        )}
        {clubsError && (
          <>
            <p>Club could not be found</p>
          </>
        )}
        {clubsLoading && (
          <>
           <AddRunSkeleton/>
          </>
        )}
      </div>
    </div>
  );
}
