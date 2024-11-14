"use client";
import AddRun from "@/components/Runs/AddRunLogic";
import AddRunSkeleton from "@/components/Runs/AddRunSkeleton";

import { useFetchClubBySlug } from "@/lib/hooks/clubs/useFetchClubs";
import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function AddRunsPage() {
  const slug = useParams().slug.toString();

  const router = useRouter();

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
      <button onClick={() => router.back()} className="absolute top-12 left-12">
        <ChevronLeft className="stroke-primary stroke" />
      </button>
      <h1 className="text-2xl font-bold mb-4">Add Runs to {club.name}</h1>
      <div className="flex flex-col gap-6 w-full">
        <AddRun club={club} />
      </div>
    </div>
  );
}
