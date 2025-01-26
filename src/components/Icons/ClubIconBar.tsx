import Link from "next/link";

import { Globe, InstagramIcon } from "lucide-react";
import Strava from "./StravaIcon";

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
          <Link href={`https://www.instagram.com/${instagramUsername}`}>
            <InstagramIcon size={24} className=" hover:text-primary" />
            <Strava />
          </Link>
        </div>
        <Link className="flex items-center" href={websiteUrl}>
          <Globe size={24} className=" hover:text-primary" />
        </Link>
      </div>
    </>
  );
}
