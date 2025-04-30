"use client";

import UnapprovedClubsLogic from "@/components/Admin/UnapprovedClubsLogic";
import UnapprovedRunsLogic from "@/components/Admin/UnapprovedRunsLogic";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
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
