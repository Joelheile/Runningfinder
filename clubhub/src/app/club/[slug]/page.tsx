// clubhub/src/app/club/[slug]/page.tsx

"use client";
import ClubIconBar from "@/components/clubs/ClubIconBar";
import Instagram from "@/components/icons/InstagramIcon";
import LikeButton from "@/components/icons/LikeButton";
import RunCard from "@/components/runs/RunCard";
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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  if (!club) return <p>No club data available.</p>;

  const { name, description, avatarUrl, instagramUsername, websiteUrl } = club;

  return (
    //TODO Redesing page to have all information and description code. Differentiate between mobile and desktop view

    <div className="flex-col bg-light w-screen h-screen p-8">
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

      <div className="flex mt-10 ">
        <Image
          src={avatarUrl || "/default-avatar.png"}
          width={1000}
          height={1000}
          alt={`${name} avatar`}
          className="w-full sm:w-1/2 md:w-1/4 rounded-lg"
        />
        <div className="flex flex-col sm:flex-row mt-4">
          
          <div className="flex-col ml-0 sm:ml-4 mt-4 sm:mt-0">
          
            <h1 className="text-lg sm:text-xl md:text-2xl">{name}</h1>
            <p className="text-sm sm:text-base md:text-lg">{description}</p>
            <p className="text-sm sm:text-base md:text-lg">
              {instagramUsername}
            </p>
            <LikeButton />
            <ClubIconBar instagramUsername={instagramUsername} websiteUrl={websiteUrl} />
          </div>
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
  );
};

export default ClubDetailPage;
