import { useState } from "react";
import Link from "next/link";
import ClubIconBar from "../icons/ClubIconBar";
import { useFetchClubBySlug, useFetchClubs } from "@/lib/hooks/useFetchClubs";
import { ChevronRight } from "lucide-react";
import { Run } from "@/lib/types/Run";
import toast from "react-hot-toast";

export default function SelectedClubHeader({ run }: { run: Run }) {
  const { data, error, isLoading } = useFetchClubs();

    const club = data?.filter((club) => club.id === run.clubId)[0];

    if (isLoading) {
      return (
        <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 z-10 w-full text-card-foreground shadow-sm lg:p-6 sm:p-4 space-y-4 animate-pulse">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div className="flex flex-col sm:flex-row w-full">
              <div className="rounded-md bg-gray-300 w-auto max-w-48 sm:w-1/6 h-48 object-cover mb-4 sm:mb-0 sm:mr-6"></div>
              <div className="flex flex-col justify-between w-full sm:w-2/3">
                <div>
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded mt-2 w-1/2"></div>
                </div>
                <div className="flex space-x-4 mt-4">
                  <div className="h-8 bg-gray-300 rounded w-24"></div>
                  <div className="h-8 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            </div>
            <div className="flex md:self-center mt-4">
              <div className="h-6 bg-gray-300 rounded w-12"></div>
              <div className="h-6 bg-gray-300 rounded w-6 ml-2"></div>
            </div>
          </div>
        </div>
      );
    }

    const avatarUrl = club?.avatarUrl
      ? club.avatarUrl
      : "/assets/default-fallback-image.png";

    const [instagramSelected, setInstagramSelected] = useState(false);

    return (
      <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 z-10 w-full text-card-foreground shadow-sm lg:p-6 sm:p-4 space-y-4">
        <Link href={`/clubs/${club?.slug}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <div className="flex flex-col sm:flex-row w-full">
              <img
                src={avatarUrl}
                alt={club?.name}
                className="rounded-md border w-auto max-w-48 sm:w-1/6 h-auto max-h-48 object-cover mb-4 sm:mb-0 sm:mr-6"
              />
              <div className="flex flex-col justify-between w-full sm:w-2/3">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold">
                    {club?.name}
                  </h2>
                  <p className="lg:w-1/3 mt-2">{club?.description}</p>
                </div>
                <ClubIconBar
                  instagramUsername={club?.instagramUsername || ""}
                  websiteUrl={club?.websiteUrl || ""}
                />
              </div>
            </div>
            <div className="flex md:self-center mt-4">
              <strong className="text-primary"> Club</strong>
              <ChevronRight className="stroke-primary" />
            </div>
          </div>
        </Link>
      </div>
    );
}
