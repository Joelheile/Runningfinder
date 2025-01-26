"use client";
import AddClub from "@/components/Clubs/AddClubLogic";
import ClubCard from "@/components/Clubs/ClubCard";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { useFetchClubs } from "@/lib/hooks/clubs/useFetchClubs";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ClubsDashboard() {
  const { data: clubs = [], isLoading, isError } = useFetchClubs();

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (club.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <nav className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center hover:bg-slate-100 rounded-md px-2 py-1 transition-colors"
          >
            <div className="flex items-center hover:bg-slate-100 rounded-md px-2 py-1 transition-colors">
              <ChevronLeft className="stroke-primary" />
              <span className="text-primary">Back</span>
            </div>
          </button>
        </nav>
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-6xl mx-auto gap-6 ">
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold tracking-tight">
              Ready for your next run?
            </h1>
            <p className="text-lg text-muted-foreground mt-1">
              Discover and connect with clubs that vibe with you
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <div className="flex gap-2">
              <AddClub />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading clubs...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-red-500">
              There was an error loading clubs - there are no clubs :)
            </p>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No clubs found. Why not create one?
            </p>
            <Button
              onClick={() =>
                document.getElementById("add-club-trigger")?.click()
              }
              className="mt-4"
            >
              Create New Club
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl pt-5 mx-auto">
            {filteredClubs.map((club) => (
              <Link
                key={club.id}
                href={`/clubs/${club.slug}`}
                className="block h-full"
              >
                <ClubCard
                  avatarUrl={club.avatarUrl}
                  name={club.name}
                  description={club.description}
                  instagramUsername={club.instagramUsername || ""}
                  websiteUrl={club.websiteUrl || ""}
                  stravaUsername={club.stravaUsername || ""}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
