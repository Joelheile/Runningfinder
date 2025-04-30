import MapPage from "@/components/Map/MapPage";
import { auth } from "@/lib/authentication/auth";

export default async function HomePage() {
  const session = await auth();
  const isAdmin = session?.user?.isAdmin;

  return (
    <div>
      <MapPage />
    </div>
  );
}
