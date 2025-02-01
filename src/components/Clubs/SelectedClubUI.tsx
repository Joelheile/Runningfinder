import useGetProfileImage from "@/lib/hooks/scraping/useGetInstagramProfile";
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
  const { getProfileImage } = useGetProfileImage();
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);

  useEffect(() => {
    const fetchInstagramData = async () => {
      if (club.instagramUsername) {
        const data = await getProfileImage({
          instagramUsername: club.instagramUsername,
        });
        setInstagramPosts(data.recentPosts);
      }
    };
    fetchInstagramData();
  }, [club.instagramUsername, getProfileImage]);

  return (
    <div className="fixed inset-0 z-[999] bg-white md:z-[50] md:top-16 md:right-0 md:left-auto md:bottom-auto md:w-[400px] md:h-[calc(100vh-4rem)] md:shadow-lg flex flex-col">
      {/* Sticky Header with Back Button and Club Name */}
      <div className="sticky top-0 bg-white z-20 px-4 py-3 border-b flex items-center gap-3">
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
        <div className="relative w-full aspect-[16/9] md:aspect-[3/2]">
          <Image
            src={avatarUrl}
            alt={club.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Club Info Section */}
        <div className="px-4 py-5 space-y-5">
          {/* Description */}
          <div>
            <p className="text-gray-600 text-base leading-relaxed">
              {club.description}
            </p>
          </div>

          {/* Social Links */}
          {(club.instagramUsername || club.stravaUsername) && (
            <div className="space-y-2.5">
              <h3 className="text-sm font-medium text-gray-500">
                Connect with us
              </h3>
              <ClubIconBar
                instagramUsername={club.instagramUsername || ""}
                stravaUsername={club.stravaUsername || ""}
                websiteUrl={club.websiteUrl || ""}
              />
            </div>
          )}

          {/* View All Runs Link */}
          <Link href={`/clubs/${club.slug}`} className="block">
            <div className="bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
              <p className="text-primary text-sm font-medium flex items-center justify-between">
                View all runs by this club
                <ChevronRight className="h-4 w-4" />
              </p>
            </div>
          </Link>
        </div>

        {/* Runs Section */}
        <div className="mt-2 border-t bg-gray-50">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">
                Upcoming Runs
              </h3>
              <span className="text-xs text-gray-500">{runs.length} runs</span>
            </div>
            <div className="space-y-2.5">
              {runs.map((run) => (
                <RunCardUI
                  key={run.id}
                  id={run.id}
                  datetime={run.datetime}
                  name={run.name}
                  distance={run.distance}
                  difficulty={run.difficulty}
                  startDescription={run.startDescription}
                  locationLat={run.location?.lat || 0}
                  locationLng={run.location?.lng || 0}
                  mapsLink={run.mapsLink || null}
                  isCompact={true}
                />
              ))}
              {runs.length === 0 && (
                <div className="py-3 text-center">
                  <p className="text-sm text-gray-500">
                    No upcoming runs scheduled
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
