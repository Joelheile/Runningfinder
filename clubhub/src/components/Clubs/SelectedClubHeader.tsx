import { ChevronRight, Globe, InstagramIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Instagram from "../icons/InstagramIcon";
import { Club } from "@/lib/types/club";



export default function SelectedClubHeader(
  club
: Club) {
  const avatarUrl = club.avatarUrl ? club.avatarUrl : "/path/to/fallback/image.jpg";
  //TODO: Impemenet Fallback data

  return (
    <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 z-10 w-full text-card-foreground shadow-sm p-6 space-y-4">
      <Link href={`/club/${club.slug}`}>
        <div className="flex justify-between items-center">
          <div className="flex">
            <Image
              src={avatarUrl}
              alt={club.name}
              width={100}
              height={100}
              className="rounded-md border w-20 h-20  object-fill "
              unoptimized={true}
            />
            <div className="flex-col ml-10">
              <h2 className="">{club.name}</h2>
              <p className="mt-2">{club.description}</p>
              <div>
                <Link href={`https://www.instagram.com/${club.instagramUsername}`}>
                  <Instagram />
                </Link>
                <Link href={club.websiteUrl}>
                  <Globe />
                </Link>
              </div>
            </div>
          </div>
          <div>
            <ChevronRight className="stroke-primary" />
          </div>
        </div>
      </Link>
    </div>
  );
}
