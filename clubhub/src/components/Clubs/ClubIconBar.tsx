import Link from "next/link";
import Instagram from "../icons/InstagramIcon";
import { useState } from "react";
import { Globe } from "lucide-react";
import { Club } from "@/lib/types/club";

interface ClubIconBarInterface {
  websiteUrl: string;
  instagramUsername: string;
}

export default function ClubIconBar({
  websiteUrl,
  instagramUsername,
}: ClubIconBarInterface) {
  const [instagramSelected, setInstagramSelected] = useState(false);
  return (
    <>
      <div className="flex flew-row   space-x-3 mt-3">
        <div
          onMouseEnter={() => setInstagramSelected(true)}
          onMouseLeave={() => setInstagramSelected(false)}
          className="cursor-pointer"
        >
          <Link href={`https://www.instagram.com/${instagramUsername}`}>
            <Instagram filled={instagramSelected} />
          </Link>
        </div>
        <Link className="flex items-center" href={websiteUrl}>
          <Globe
            size={24}
            className=" hover:text-primary"
          />
        </Link>
      </div>
    </>
  );
}
