import AddClub from "@/components/clubs/AddClub";
import AddRun from "@/components/runs/AddRun";

export default async function addClubPage() {
 const session = auth

  const session = await console.log("session", session);
  if (!session?.user) {
    redirect("/apu/auth/signin?callbackUrl=/clubs/add");
  }
  return (
    <div className="flex-col p-10 items-center w-2/3 mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Add Club</h1>
      <div className="flex justify-center">
        <AddClub />
      </div>
    </div>
  );
}
