"use client";
import ClubIconBar from "@/components/clubs/ClubIconBar";
import Instagram from "@/components/icons/InstagramIcon";
import LikeButton from "@/components/icons/LikeButton";
import RunCard from "@/components/runs/RunCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchClubById } from "@/lib/hooks/useFetchClubs";

import { ChevronLeft, Pencil, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import React from "react";

const ClubDetailPage = () => {
  const router = useRouter();
  const slug = useParams().slug.toString();

  const { data: club, isLoading, isError, error } = useFetchClubById(slug);
  console.log("Fetched club data:", club);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center mt-32">
        <Skeleton className="w-1/3 h-48 mb-4" />
        <Skeleton className="w-1/4 h-6 mb-2" />
        <Skeleton className="w-1/4 h-6 mb-2" />
        <Skeleton className="w-1/4 h-6 mb-2" />
      </div>
    );
  }

  if (isError) return <p>Error: {error?.message}</p>;

  if (!club) return <p>No club data available.</p>;

  const { name, description, avatarUrl, instagramUsername, websiteUrl } = club;

  return (
    <div className="flex flex-col bg-light w-screen h-screen p-8">
      <nav className="flex justify-between">
        <Link href="/">
          <div className="flex">
            <ChevronLeft className="stroke-primary stroke" />
            <span className="Back text-primary">Back</span>
          </div>
        </Link>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push(`club/${slug}/admin`)}
          >
            <Pencil className="stroke-primary" />
          </button>
          <Share className="stroke-primary" />
        </div>
      </nav>

      <div className="flex-col mt-10 lg:max-w-7xl md:w-2/3  sm:flex-row justify-center self-center">
        <div className="flex flex-col sm:flex-row  bg-white gap-x-5 border p-3 rounded-md">
          <img
            src={avatarUrl}
            alt={club.name}
            className="rounded-md border lg:w-1/4 sm:w-1/6 h-auto max-h-48 object-cover mb-4 sm:mb-0 sm:mr-6"
          />
          <div className="flex flex-col max-w-2xl py-4 justify-between">
            <div>
              <h1>{club.name}</h1>
              <p className="mt-2">{club.description}</p>
            </div>
            <ClubIconBar
              instagramUsername={club.instagramUsername}
              websiteUrl={club.websiteUrl}
            />
          </div>
        </div>
        <div className="mt-10">
          <h2 className="mb-2 text-lg sm:text-xl md:text-2xl">Upcoming runs</h2>
          <RunCard
            date={"Fr, 2.1"}
            time={0}
            distance={5}
            location={"Warschauer Straße"}
          />
        </div>
      </div>
    </div>
  );
};

export default ClubDetailPage;
