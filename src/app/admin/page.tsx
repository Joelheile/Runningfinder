"use client";
import UnapprovedClubs from "@/components/Admin/UnapprovedClubs";
import UnapprovedRuns from "@/components/Admin/UnapprovedRuns";
import MapTest from "@/components/Map/MapTest";
import { TestScraper } from "@/components/Scraper/TestScraper";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default function AdminPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      signIn(undefined, { callbackUrl: "/admin" });
    },
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user?.isAdmin) {
    toast.error("You need to be logged in as an admin to access this page");
    redirect("/");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Scraper Test</h2>
          <TestScraper />
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Google Maps API Test</h2>
          <MapTest />
        </section>

        <section>
          <UnapprovedRuns />
        </section>

        <section>
          <UnapprovedClubs />
        </section>
      </div>
    </div>
  );
}
