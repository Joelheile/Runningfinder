import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LocationProps {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
}

export default function SelectedClubHeader({
  id,
  name,
  description,
  avatar,
}: LocationProps) {
  const avatarUrl = avatar ? avatar : "/path/to/fallback/image.jpg";
  //TODO: Impemenet Fallback data

  return (
    <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 z-10 w-full text-card-foreground shadow-sm p-6 space-y-4">
      <Link href={`/club/${id}`}
      >
        <div className="flex justify-between items-center">
          <div className="flex">
            <Image
              src={avatarUrl}
              alt={name}
              width={100}
              height={100}
              className="rounded-md border "
              unoptimized={true}
            />
            <div className="flex-col ml-10">
              <h2 className="">{name}</h2>
              <p className="mt-2">{description}</p>
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
