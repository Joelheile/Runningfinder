import { auth } from "@/lib/authentication/auth";
import { redirect } from "next/navigation";
import React from "react";

async function LikedRunsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/run/your-runs");
  }

  return (
    <>
      <h1>Liked Runs</h1>
    </>
  );
}

export default LikedRunsPage;
