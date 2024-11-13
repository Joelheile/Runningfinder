"use client";
import ClubCard from "@/components/Clubs/ClubCard";
import { Button } from "@/components/UI/button";
import { useFetchClubs } from "@/lib/hooks/useFetchClubs";
import Link from "next/link";

export default function ClubsDashboard() {
  const { data: clubs, isLoading, isError, error } = useFetchClubs();

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-2xl font-bold mt-5">Ready for your next run?</h1>
      <p className="text-center mb-2">
        Discover and connect with clubs that vibe with you
      </p>
      <Link href="/clubs/add">
        <Button>Add Club</Button>
      </Link>
      <div className="grid grid-cols-3 gap-x-5 p-5">
        {clubs?.map((club) => (
          <Link key={club.id} href={`/clubs/${club.slug}`}>
            <ClubCard
              avatarUrl={club.avatarUrl}
              name={club.name}
              description={club.description}
              instagramUsername={club.instagramUsername}
              websiteUrl={club.websiteUrl}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
