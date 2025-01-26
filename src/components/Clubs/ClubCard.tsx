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
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 h-40">
        <div className="flex flex-row h-full">
          <div className="relative w-1/3 h-full">
            <Image
              width={500}
              height={500}
              src={avatarUrl || "/assets/default-fallback-image.png"}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-5 w-2/3">
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <h1 className="text-xl font-bold text-gray-900 mb-2">{name}</h1>
                <p className="text-gray-600 line-clamp-3">{description}</p>
              </div>
              <div className="mt-auto">
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
