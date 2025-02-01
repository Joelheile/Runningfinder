import useGetProfileImage from "@/lib/hooks/scraping/useGetInstagramProfile";
import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import { ChevronRight, X } from "lucide-react";
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
    <div className="fixed top-16 right-0 z-10 w-[400px] h-[calc(100vh-4rem)] bg-white shadow-lg flex flex-col">
      <div className="flex-none p-6 space-y-6">
        {/* Close Button */}
        {onClose && (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Club Image */}
        <Link href={`/clubs/${club.slug}`} className="block">
          <div className="relative w-full h-48">
            <Image
              src={avatarUrl}
              alt={club.name}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </Link>

        {/* Club Name and Description */}
        <Link
          href={`/clubs/${club.slug}`}
          className="block hover:bg-gray-50 rounded-lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{club.name}</h2>
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-gray-600 leading-relaxed">{club.description}</p>
          </div>
        </Link>

        {/* Social Links */}
        {(club.instagramUsername || club.stravaUsername) && (
          <div className="pt-2">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              Connect with us
            </h3>
            <ClubIconBar
              instagramUsername={club.instagramUsername || ""}
              stravaUsername={club.stravaUsername || ""}
              websiteUrl={club.websiteUrl || ""}
            />
          </div>
        )}
      </div>
      {/* Scrollable Runs Section */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <Link href={`/clubs/${club.slug}`}>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 sticky top-0 bg-white py-2">
              Upcoming Runs
            </h3>
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
              <p className="text-sm text-gray-500">
                No upcoming runs scheduled
              </p>
            )}

            {/* View All Runs Link */}
            <div className="mt-6 pt-4">
              <div className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
                <p className="text-primary text-sm font-medium flex items-center justify-between">
                  Click to view all runs by this club
                  <ChevronRight className="h-5 w-5" />
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
