import Image from "next/image";
import ClubIconBar from "../Icons/ClubIconBar";

interface ClubCardProps {
  avatarUrl?: string;
  name: string;
  description: string;
  instagramUsername: string;
  websiteUrl: string;
  stravaUsername: string;
}

export default function ClubCard({
  avatarUrl,
  name,
  description,
  instagramUsername,
  stravaUsername,
  websiteUrl,
}: ClubCardProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
        <div className="flex flex-col sm:flex-row h-full">
          <div className="relative w-full sm:w-1/3 h-48 sm:h-auto">
            <Image
              width={500}
              height={500}
              src={avatarUrl || "/assets/default-fallback-image.png"}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-5 sm:w-2/3">
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <h1 className="text-xl font-bold text-gray-900 mb-3">{name}</h1>
                <p className="text-gray-600 line-clamp-4">{description}</p>
              </div>
              <div className="pt-4 mt-auto border-t border-gray-100">
                <ClubIconBar
                  instagramUsername={instagramUsername}
                  stravaUsername={stravaUsername}
                  websiteUrl={websiteUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
