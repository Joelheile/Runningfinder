import AddClub from "@/components/Clubs/AddClubLogic";
import { auth } from "@/lib/authentication/auth";
import { redirect } from "next/navigation";

export default async function addClubPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/clubs/add");
  }
  return (
    <div className="flex-col p-10 items-center w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Add Club</h1>
      <div className="flex justify-center">
        <AddClub />
      </div>
    </div>
  );
}
