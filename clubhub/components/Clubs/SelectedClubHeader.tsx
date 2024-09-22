import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface LocationProps {
  id: string;
  name: string;
  description: string;
}

export default function SelectedClubHeader({
  id,
  name,
  description,
}: LocationProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 z-10 w-full text-card-foreground shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex">
          <Image
            src="/assets/midnightrunners.jpg"
            alt="Midnight Runners"
            width={100}
            height={100}
            className=" rounded-md border border-black  border-2"
          />
          <div className="flex-col ml-10">
            <h2 className="">{name}</h2>

            <p className="mt-2">{description}</p>
          </div>
        </div>

        <div>
          <Link href={`/pages/club/${id}`}>
            <ChevronRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
