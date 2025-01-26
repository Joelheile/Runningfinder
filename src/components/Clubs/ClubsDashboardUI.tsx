"use client";
import { Button } from "@/components/UI/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { ChevronLeft, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ClubCard from "./ClubCard";

interface ClubsDashboardUIProps {
  clubs: any[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  scrapeRuns: () => void;
}

export default function ClubsDashboardUI({
  clubs,
  isLoading,
  isError,
  error,
  searchQuery,
  setSearchQuery,
  scrapeRuns,
}: ClubsDashboardUIProps) {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>

      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Ready for your next run?
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover and connect with clubs that vibe with you
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <Button onClick={scrapeRuns} variant="outline" className="gap-2">
            <Search className="w-4 h-4" />
            Scrape Runs
          </Button>
          <Link href="/clubs/add">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Club
            </Button>
          </Link>
        </div>

        <Card className="border-none shadow-none">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Find Your Club</CardTitle>
            <CardDescription>Search by club name or description</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Type to search clubs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading clubs...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading clubs: {error?.message}</p>
          </div>
        ) : clubs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No clubs found. Why not create one?
            </p>
            <Link href="/clubs/add">
              <Button className="mt-4">Create New Club</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <Link key={club.id} href={`/clubs/${club.slug}`} className="block">
                <ClubCard
                  avatarUrl={club.avatarUrl}
                  name={club.name}
                  description={club.description}
                  instagramUsername={club.instagramUsername}
                  websiteUrl={club.websiteUrl}
                  stravaUsername={club.stravaUsername}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
