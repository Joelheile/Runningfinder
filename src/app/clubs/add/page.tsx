import AddClub from "@/components/Clubs/AddClubLogic";
import { auth } from "@/lib/authentication/auth";
import { redirect } from "next/navigation";

export default async function addClubPage() {
  const session = await auth();

  if (!session?.user && !process.env.TESTING) {
    redirect("/api/auth/signin?callbackUrl=/clubs/add");
  }
  return (
    <div>
      <AddClub />
    </div>
  );
}
