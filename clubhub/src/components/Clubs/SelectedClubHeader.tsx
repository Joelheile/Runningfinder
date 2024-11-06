import { ChevronRight, Globe, InstagramIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Instagram from "../icons/InstagramIcon";
import { Club } from "@/lib/types/club";
import { useState } from "react";

export default function SelectedClubHeader(club: Club) {
  const avatarUrl = club.avatarUrl
    ? club.avatarUrl
    : "/assets/default-fallback-image.png";

  const [instagramSelected, setInstagramSelected] = useState(false);

  return (
    <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 z-10 h-fit w-full text-card-foreground shadow-sm p-6 space-y-4">
      <Link href={`/club/${club.slug}`}>
        <div className="flex justify-between items-start">
          <div className="flex">
            <Image
              src={avatarUrl}
              alt={club.name}
              width={200}
              height={200}
              className="rounded-md border h-auto w-auto object-cover " 
            />
            <div className="flex flex-col ml-10 size-2/5">
              <h1>{club.name}</h1>
              <p className="">{club.description}</p>
              <div className="flex  space-x-2 mt-3 align-middle flex-row">
                <div
                  onMouseEnter={() => setInstagramSelected(true)}
                  onMouseLeave={() => setInstagramSelected(false)}
    className=" cursor-pointer"
                >
                  <Link
                    href={`https://www.instagram.com/${club.instagramUsername}`}
                  >
                    <Instagram filled={instagramSelected} />
                  </Link>
                </div>
                <Link className="flex h-5" href={club.websiteUrl}>
                  <Globe 
                  size={24}  
                  onMouseEnter={(e) => e.currentTarget.style.color = "hsl(var(--primary))"} 
                  onMouseLeave={(e) => e.currentTarget.style.color = 'black'}
                  />
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
