import MapPage from "@/components/Map/MapPage";
import { auth } from "@/lib/authentication/auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await auth();
  const isAdmin = session?.user?.isAdmin;

  return (
    <div>
      <MapPage />

      {/* API Documentation Link - only visible to admin users */}
      {isAdmin && (
        <div className="fixed bottom-4 right-4 z-50">
          <Link
            href="/api-docs"
            className="bg-black text-white hover:bg-gray-800 rounded-full py-2 px-4 text-sm flex items-center shadow-lg"
          >
            API Docs
          </Link>
        </div>
      )}
    </div>
  );
}
