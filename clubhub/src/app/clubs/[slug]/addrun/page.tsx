"use client";
import AddRun from "@/components/runs/AddRun";
import { useParams } from "next/navigation";
import { useFetchClubBySlug } from "@/lib/hooks/useFetchClubs";
import AddRunSkeleton from "@/components/runs/addRunSkeleton";

export default function AddRunsPage() {
  const slug = useParams().slug.toString();

  const {
    data: club,
    isLoading: clubsLoading,
    error: clubsError,
  } = useFetchClubBySlug(slug);

  if (clubsLoading) {
    return <AddRunSkeleton />;
  }

  if (clubsError || !club) {
    return <p>Club could not be found</p>;
  }

  return (
    <div className="flex-col p-10 items-center w-2/3 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add Runs to "{club.name}"</h1>
      <div className="flex flex-col gap-6 w-full">
        <AddRun club={club} />
      </div>
    </div>
  );
}