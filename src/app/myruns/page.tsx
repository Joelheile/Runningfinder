import UserRuns from "@/components/Runs/UserRuns";
import { auth } from "@/lib/authentication/auth";

import { redirect } from "next/navigation";

export default async function myRunsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/myruns");
  }

  return (
    <div>
      <UserRuns userId={session.user.id} />
    </div>
  );
}
