"use client";

import UnapprovedClubsLogic from "@/components/Admin/UnapprovedClubsLogic";
import UnapprovedRunsLogic from "@/components/Admin/UnapprovedRunsLogic";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminPage() {
  // session is handled in middleware
  const { status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row ">
        <Link href="/">
          <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
        </Link>
      </div>
      <div className="space-y-8">
        <section>
          <UnapprovedClubsLogic />
        </section>
        <section className="border-t pt-10">
          <UnapprovedRunsLogic />
        </section>
      </div>
    </div>
  );
}
