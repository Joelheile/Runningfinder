import MapPage from "@/components/Map/MapPage";
import { auth } from "@/lib/authentication/auth";

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;
  console.log("user", user);

  return (
    <div>
      <MapPage session={session} />
    </div>
  );
}
