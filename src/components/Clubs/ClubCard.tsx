import React from "react";
import Image from "next/image";
import ClubIconBar from "../Icons/ClubIconBar";

interface ClubCardProps {
  avatarUrl?: string;
  name: string;
  description: string;
  instagramUsername: string;
  websiteUrl: string;
}

export default function ClubCard({
  avatarUrl,
  name,
  description,
  instagramUsername,
  websiteUrl,
}: ClubCardProps) {
  return (
    <div className="flex flex-col mt-5 sm:flex-row justify-center self-center w-full max-w-2xl rounded-lg  min-h-44 bg-white border p-3">
      <div className="flex-shrink-0 w-full sm:w-1/4">
        <div className="relative w-full h-32 sm:h-full">
          <Image
            src={avatarUrl || "/assets/default-fallback-image.png"}
            alt={name}
            layout="fill"
            className="rounded-md border object-cover "
          />
        </div>
      </div>
      <div className="flex flex-col justify-between ml-5 w-full sm:w-3/4 mt-4 sm:mt-0">
        <div className="flex-grow overflow-hidden">
          <h1 className="text-xl font-semibold truncate">{name}</h1>
          <p className="mt-2 text-gray-600 overflow-hidden text-ellipsis line-clamp-3">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0 mt-4 sm:mt-0">
          <ClubIconBar
            instagramUsername={instagramUsername}
            websiteUrl={websiteUrl}
          />
        </div>
      </div>
    </div>
  );
}
