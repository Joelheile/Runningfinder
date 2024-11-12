import MapPage from "@/components/Map/MapPage";
import { auth } from "@/lib/authentication/auth";

export default async function HomePage() {
  const session = await auth();
  console.log("auth", session);

  return (
    <div>
    
      <MapPage session={session}/>
    </div>
  );
}
