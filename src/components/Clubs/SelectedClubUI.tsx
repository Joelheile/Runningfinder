import getInstagramProfile from "@/lib/hooks/admin/useGetInstagramProfile";
import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ClubIconBar from "../Icons/ClubIconBar";
import RunCardUI from "../Runs/RunCardUI";
import { Button } from "../UI/button";

interface InstagramPost {
  url: string;
  displayUrl: string;
  caption?: string;
}

interface SelectedClubHeaderUIProps {
  club: Club;
  avatarUrl: string;
  runs: Run[];
  onClose?: () => void;
}

export default function SelectedClubHeaderUI({
  club,
  avatarUrl,
  runs,
  onClose,
}: SelectedClubHeaderUIProps) {
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    const fetchInstagramData = async () => {
      if (club.instagramUsername) {
        const data = await getInstagramProfile({
          instagramUsername: club.instagramUsername,
        });
        setInstagramPosts(data.recentPosts);
      }
    };
    fetchInstagramData();
  }, [club.instagramUsername]);

  return (
    <div className="fixed inset-0 z-[999] bg-white md:z-[50] md:top-16 md:right-0 md:left-auto md:bottom-auto md:w-[400px] md:h-[calc(100vh-4rem)] md:shadow-lg flex flex-col">
      {/* Sticky Header with Back Button and Club Name */}
      <div className="sticky top-0 bg-white z-20 px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-gray-700"
          onClick={onClose}
          asChild
        >
          <Link href="/map">
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Link>
        </Button>
        <h2 className="text-lg font-semibold text-gray-900 truncate flex-1">
          {club.name}
        </h2>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Club Image */}
        <div className="pb-4 px-4">
          <div className="relative w-full aspect-[16/9] md:aspect-[3/2] rounded-lg overflow-hidden shadow-sm">
            <Image
              src={avatarUrl}
              alt={club.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
          {/* Description */}
          <p className="text-gray-600 pt-4 px-2 text-[15px] leading-relaxed">
            {club.description}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-6">
          <div className="flex items-center gap-6">
            <Link href={`/clubs/${club.slug}`} className="flex-1">
              <Button className="w-full">View Club Profile</Button>
            </Link>
            {(club.instagramUsername || club.stravaUsername) && (
              <div className="flex items-center pl-1">
                <ClubIconBar
                  instagramUsername={club.instagramUsername || ""}
                  stravaUsername={club.stravaUsername || ""}
                  websiteUrl={club.websiteUrl || ""}
                />
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Runs Section */}
        <div className="border-t">
          <div className="px-4 py-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              Upcoming Runs
            </h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              {runs.length} runs
            </span>
          </div>
        </div>

        {/* Club Info Section */}
        <div className="px-4 space-y-4">
          {/* Runs List */}
          <div className="space-y-2.5 mt-2">
            {runs.map((run) => (
              <RunCardUI
                key={run.id}
                id={run.id}
                datetime={run.datetime}
                name={run.name}
                distance={run.distance}
                difficulty={run.difficulty}
                startDescription={run.startDescription}
                mapsLink={run.mapsLink || null}
                isCompact={true}
              />
            ))}
            {runs.length === 0 && (
              <div className="py-3 text-center bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">
                  No upcoming runs scheduled
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
