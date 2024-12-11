import { Club } from "@/lib/types/Club";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ClubIconBar from "../Icons/ClubIconBar";
import { Button } from "../UI/button";

interface SelectedClubHeaderUIProps {
  club: Club;
  avatarUrl: string;
  instagramSelected: boolean;
  setInstagramSelected: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SelectedClubHeaderUI({
  club,
  avatarUrl,
  instagramSelected,
  setInstagramSelected,
}: SelectedClubHeaderUIProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm absolute top-0 right-0 z-10 h-5/6 w-1/6 text-card-foreground shadow-sm lg:p-6 sm:p-4 space-y-4 flex flex-col justify-between">
      <div className="flex flex-col justify-between items-center h-full">
        <div className="flex flex-col items-center w-full">
          <Image
            width={500}
            height={500}
            src={avatarUrl}
            alt={club.name}
            className="rounded-md border w-auto max-w-48 h-auto max-h-48 object-cover mb-4"
          />
          <div className="flex flex-col justify-between mx-auto w-full text-center">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">{club.name}</h2>
              <p className="mt-2">{club.description}</p>
              <div className="flex justify-center">
                <ClubIconBar
                  instagramUsername={club.instagramUsername || ""}
                  websiteUrl={club.websiteUrl || ""}
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" flex-col mt-4">
          <Link href={`/clubs/${club.slug}`}>
            <Button>Go to runs </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
