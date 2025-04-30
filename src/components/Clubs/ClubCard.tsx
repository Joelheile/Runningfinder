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
    <div className="w-full transform transition-all duration-300 hover:scale-[1.02]">
      <div className="bg-white rounded-lg hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
        <div className="md:hidden">
          <div className="relative h-48 w-full">
            <Image
              width={500}
              height={500}
              src={avatarUrl || "/assets/default-fallback-image.png"}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-0 p-4 text-white">
                <h1 className="text-2xl font-bold mb-1 line-clamp-1 text-white">
                  {name}
                </h1>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-gray-600 line-clamp-3 text-sm">{description}</p>
            <div className="mt-4">
              <ClubIconBar
                instagramUsername={instagramUsername}
                stravaUsername={stravaUsername}
                websiteUrl={websiteUrl}
              />
            </div>
          </div>
        </div>

        <div className="hidden md:flex flex-row min-h-[12rem]">
          <div className="relative w-1/3">
            <Image
              width={500}
              height={500}
              src={avatarUrl || "/assets/default-fallback-image.png"}
              alt={name}
              className="absolute inset-0 w-full h-full object-cover"
              priority
            />
          </div>
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-1">
                {name}
              </h1>
              <p className="text-gray-600 line-clamp-3">{description}</p>
            </div>
            <div className="mt-4">
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
  );
}
