import MapPage from "@/components/Map/MapPage";
import { Button } from "@/components/UI/button";
import { auth } from "@/lib/authentication/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();

  return (
    <div>
      <div className="absolute z-10 top-2 right-1/2 left-1/2   text-center">
        <Link href="/clubs">
          <Button variant={"outline"}>All Clubs 🏃</Button>
        </Link>
      </div>
      <MapPage session={session} />
    </div>
  );
}
