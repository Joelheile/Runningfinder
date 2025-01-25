"use client";
import ClubCard from "@/components/Clubs/ClubCard";
import { Button } from "@/components/UI/button";
import { useFetchClubs } from "@/lib/hooks/clubs/useFetchClubs";
import { useScrapeRuns } from "@/lib/hooks/scraping/useScrapeRuns";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClubsDashboard() {
  const { data: clubs, isLoading, isError, error } = useFetchClubs();
  const { scrapeRuns } = useScrapeRuns();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center p-5">
      <button
        onClick={() => router.push("/")}
        className="absolute top-12 left-12"
      >
        <ChevronLeft className="stroke-primary stroke" />
      </button>
      <h1 className="text-2xl font-bold mt-5">Ready for your next run?</h1>
      <p className="text-center mb-2">
        Discover and connect with clubs that vibe with you
      </p>
      <Button onClick={scrapeRuns} variant={"outline"}>
        Scrape 🏃
      </Button>
      <Link href="/clubs/add">
        <Button>Add Club</Button>
      </Link>
      <div className="grid grid-cols-3 gap-x-5 p-5s">
        {clubs?.map((club) => {
          console.log("avatar", club.avatarUrl);
          return (
            <Link key={club.id} href={`/clubs/${club.slug}`}>
              <ClubCard
                avatarUrl={club.avatarUrl}
                name={club.name}
                description={club.description}
                instagramUsername={club.instagramUsername}
                websiteUrl={club.websiteUrl}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
