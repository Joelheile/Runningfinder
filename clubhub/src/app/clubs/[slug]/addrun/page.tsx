"use client";
import AddClub from "@/components/clubs/AddClub";
import AddRun from "@/components/runs/AddRun";
import { useState } from "react";
import { Run } from "@/lib/types/Run";
import { useParams } from "next/navigation";
import { useFetchClubById, useFetchClubs } from "@/lib/hooks/useFetchClubs";
import { Skeleton } from "@/components/ui/skeleton";

export default function AddRunsPage() {
  const [runsData, setRunsData] = useState<{ [key: string]: Run[] }>({});
  const slug = useParams().slug.toString();

  const {
    data: club,
    isLoading: clubsLoading,
    error: clubsError,
  } = useFetchClubById(slug);

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
            <div className="grid gap-4">
              <div className="flex flex-col">
                <Skeleton className="h-8 mt-1 w-full" />
              </div>
              <div className="flex flex-col">
                <Skeleton className="h-8 mt-1 w-full" />
              </div>
              <div className="flex flex-col">
                <Skeleton className="h-8 mt-1 w-full" />
              </div>
              <div className="flex flex-col">
                <Skeleton className="h-8 mt-1 w-full" />
              </div>
              <div className="flex flex-col">
                <Skeleton className="h-8 mt-1 w-full" />
              </div>
              <div className="flex flex-col">
                <Skeleton className="h-8 mt-1 w-full" />
              </div>
              <div className="flex flex-col">
                <Skeleton className="h-8 mt-1 w-full" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 mt-1 w-6" />
              </div>
            </div>

            <Skeleton className="h-10 mt-4 w-full" />
            <div className="App mt-8">
              <Skeleton className="h-64 w-full" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
