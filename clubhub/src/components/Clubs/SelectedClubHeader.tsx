import { ChevronRight, Globe, InstagramIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Instagram from "../icons/InstagramIcon";
import { Club } from "@/lib/types/club";
import { useState } from "react";

export default function SelectedClubHeader(club: Club) {
  const avatarUrl = club.avatarUrl
    ? club.avatarUrl
    : "/assets/default-fallback-image.png";

  const [instagramSelected, setInstagramSelected] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 z-10 w-full text-card-foreground shadow-sm p-4 sm:p-6 space-y-4">
      <Link href={`/club/${club.slug}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div className="flex flex-col sm:flex-row w-full">
            <img
              src={avatarUrl}
              alt={club.name}
              className="rounded-md border w-full sm:w-1/6 h-auto object-cover mb-4 sm:mb-0 sm:mr-6"
            />
            <div className="flex flex-col   justify-between w-full sm:w-2/3">
              <h1 className="text-lg sm:text-xl font-semibold">{club.name}</h1>
              <p className="lg:w-1/3 mt-2">{club.description}</p>

              <div className="flex flew-row   space-x-3 mt-3">
                <div
                  onMouseEnter={() => setInstagramSelected(true)}
                  onMouseLeave={() => setInstagramSelected(false)}
                  className="cursor-pointer"
                >
                  <Link
                    href={`https://www.instagram.com/${club.instagramUsername}`}
                  >
                    <Instagram filled={instagramSelected} />
                  </Link>
                </div>
                <Link className="flex items-center" href={club.websiteUrl}>
                  <Globe size={24} className="transition-colors duration-200" />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex  mt-4 sm:mt-0">
            <strong className=" text-primary"> Club</strong>
            <ChevronRight className="stroke-primary" />
          </div>
        </div>
      </Link>
    </div>
  );
}
