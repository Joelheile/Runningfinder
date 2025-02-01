import MapPage from "@/components/Map/MapPage";
import { auth } from "@/lib/authentication/auth";

export default async function HomePage() {
  return (
    <div>
      <MapPage />
    </div>
  );
}
