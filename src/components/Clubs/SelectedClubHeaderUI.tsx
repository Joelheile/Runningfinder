import useGetProfileImage from "@/lib/hooks/scraping/useGetInstagramProfile";
import { Club } from "@/lib/types/Club";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ClubIconBar from "../Icons/ClubIconBar";

interface InstagramPost {
  url: string;
  displayUrl: string;
  caption?: string;
}

interface SelectedClubHeaderUIProps {
  club: Club;
  avatarUrl: string;
}

export default function SelectedClubHeaderUI({
  club,
  avatarUrl,
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
  }, [club.instagramUsername]);

  return (
    <div className="fixed top-16 right-0 z-10 w-[400px] h-[calc(100vh-4rem)] bg-white shadow-lg flex flex-col">
      <Link
        href={`/clubs/${club.slug}`}
        className="block transition-colors hover:bg-gray-50 flex-1 min-h-0"
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Static Header Content */}
          <div className="flex-none p-6 space-y-6">
            {/* Club Image */}
            <div className="relative w-full h-48">
              <Image
                src={avatarUrl}
                alt={club.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            {/* Club Name and Description */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {club.name}
                </h2>
                <ChevronRight className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-600 leading-relaxed">
                {club.description}
              </p>
            </div>

            {/* Click for Runs Hint */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-700 text-sm font-medium">
                Click to view all runs by this club →
              </p>
            </div>

            {/* Social Links */}
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
          </div>
        </div>
      </Link>
    </div>
  );
}
