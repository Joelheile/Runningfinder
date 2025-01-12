import MapPage from "@/components/Map/MapPage";
import { Button } from "@/components/UI/button";
import { auth } from "@/lib/authentication/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;
  console.log("user", user);

  return (
    <div>
      <div className="absolute z-10 top-2 right-1/2 left-1/2    grid-flow-row text-center">
        <div className="flex flex-row">
          <Link href="/clubs">
            <Button variant={"outline"}>All Clubs 🏃</Button>
          </Link>
          <Link href="/myruns">
            <Button variant={"outline"}>My runs 🥳</Button>
          </Link>
        </div>
      </div>

      <MapPage session={session} />
    </div>
  );
}
