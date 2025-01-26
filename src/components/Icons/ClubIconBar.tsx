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
      <div className="flex flew-row   space-x-3 mt-3">
        <div className="cursor-pointer stroke-primary">
          {instagramUsername && (
            <Link href={`https://www.instagram.com/${instagramUsername}`}>
              <Image
                width={24}
                height={24}
                src="/icons/instagram.jpeg"
                alt={instagramUsername}
                className="rounded-md hover:w-7 "
              />
            </Link>
          )}
        </div>
        {stravaUsername && (
          <Link href={`https://strava${instagramUsername}`}>
            <Image
              width={24}
              height={24}
              src="/icons/strava.svg"
              alt={instagramUsername}
              className="rounded-md hover:w-7 "
            />
          </Link>
        )}
      </div>
    </>
  );
}
