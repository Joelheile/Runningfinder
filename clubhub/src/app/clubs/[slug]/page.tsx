import ClubDetailPage from "@/components/Clubs/ClubDashboardLogic";
import { auth } from "@/lib/authentication/auth";

export default async function ClubPage() {
  const session = await auth();

  return (
    <div>
      <ClubDetailPage userId={session?.user.id} />
    </div>
  );
}
