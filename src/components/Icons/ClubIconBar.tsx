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
  stravaUsername = "website",
}: ClubIconBarInterface) {
  return (
    <>
      <div className="flex gap-3">
        {instagramUsername && (
          <Link
            href={`https://www.instagram.com/${instagramUsername}`}
            target="_blank"
            rel="noopener noreferrer"
          >
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
          <Link
            href={`https://strava.com/clubs/${stravaUsername}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="w-6 h-6 flex items-center justify-center group cursor-pointer">
              <Image
                width={24}
                height={24}
                src="/icons/strava.svg"
                alt={stravaUsername}
                className="rounded-md transform group-hover:scale-110 transition-transform duration-200"
              />
            </div>
          </Link>
        )}
        {websiteUrl && (
          <Link href={websiteUrl} target="_blank" rel="noopener noreferrer">
            <div className="w-6 h-6 flex items-center justify-center group cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-200 text-gray-600"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
          </Link>
        )}
      </div>
    </>
  );
}
