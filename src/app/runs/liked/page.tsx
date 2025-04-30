import UserRuns from "@/components/Runs/UserRunsLogic";
import { auth } from "@/lib/authentication/auth";
import { redirect } from "next/navigation";

export default async function MyRunsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(`/api/auth/signin?callbackUrl="/runs/liked"}`);
  }

  return <UserRuns userId={session.user.id} />;
}
