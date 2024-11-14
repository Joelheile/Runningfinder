import { Club } from "@/lib/types/Club";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ClubIconBar from "../Icons/ClubIconBar";

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
    <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 z-10 w-full text-card-foreground shadow-sm lg:p-6 sm:p-4 space-y-4">
      <Link href={`/clubs/${club.slug}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div className="flex flex-col sm:flex-row w-full">
            <img
              src={avatarUrl}
              alt={club.name}
              className="rounded-md border w-auto max-w-48 sm:w-1/6 h-auto max-h-48 object-cover mb-4 sm:mb-0 sm:mr-6"
            />
            <div className="flex flex-col justify-between w-full sm:w-2/3">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  {club.name}
                </h2>
                <p className="lg:w-1/3 mt-2">{club.description}</p>
              </div>
              <ClubIconBar
                instagramUsername={club.instagramUsername || ""}
                websiteUrl={club.websiteUrl || ""}
              />
            </div>
          </div>
          <div className="flex md:self-center mt-4">
            <strong className="text-primary"> Club</strong>
            <ChevronRight className="stroke-primary" />
          </div>
        </div>
      </Link>
    </div>
  );
}
