import Link from "next/link";

import Image from "next/image";

interface ClubIconBarInterface {
  websiteUrl: string;
  instagramUsername: string;
  stravaUsername: string;
}

export default function ClubIconBar({
  websiteUrl,
  instagramUsername,
  stravaUsername,
}: ClubIconBarInterface) {
  return (
    <>
      <div className="flex gap-3">
        {instagramUsername && (
          <Link href={`https://www.instagram.com/${instagramUsername}`}>
            <div className="w-6 h-6 flex items-center justify-center group cursor-pointer">
              <Image
                width={24}
                height={24}
                src="/icons/instagram.jpeg"
                alt={instagramUsername}
                className="rounded-md transform group-hover:scale-110 transition-transform duration-200"
              />
            </div>
          </Link>
        )}
        {stravaUsername && (
          <Link href={`https://strava.com/clubs/${stravaUsername}`}>
            <div className="w-6 h-6 flex items-center justify-center group cursor-pointer">
              <Image
                width={24}
                height={24}
                src="/icons/strava.svg"
                alt={instagramUsername}
                className="rounded-md transform group-hover:scale-110 transition-transform duration-200"
              />
            </div>
          </Link>
        )}
      </div>
    </>
  );
}
