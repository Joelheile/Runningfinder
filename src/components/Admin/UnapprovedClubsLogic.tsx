"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useApproveClub from "@/lib/hooks/scraping/clubs/useApproveClub";
import useDeclineClub from "@/lib/hooks/scraping/clubs/useDeclineClub";
import useFetchClubs from "@/lib/hooks/scraping/clubs/useFetchClubs";
import useUpdateAdminClub from "@/lib/hooks/scraping/clubs/useUpdateAdminClub";
import getInstagramProfile from "@/lib/hooks/scraping/useGetInstagramProfile";
import { Club } from "@/lib/types/Club";
import UnapprovedClubsUI from "./UnapprovedClubsUI";

export default function UnapprovedClubsLogic() {
  const router = useRouter();
  const { clubs, refetch } = useFetchClubs();

  const handleUpdateClub = async (slug: string, updateData: Partial<Club>) => {
    try {
      await useUpdateAdminClub(slug, updateData);
      toast.success("Club updated successfully");
      await refetch();
      router.refresh();
    } catch (error) {
      console.error("Failed to update club:", error);
      toast.error("Failed to update club");
    }
  };

  async function handleApproveClub(slug: string) {
    const approve = await useApproveClub(slug);
    approve();
    router.refresh();
    refetch();
  }

  async function handleClubDecline(slug: string) {
    const decline = await useDeclineClub(slug);
    decline();
    refetch();
    router.refresh();
  }

  const handleInstagramFetch = async (slug: string, username: string) => {
    if (!username) return;

    const loadingToast = toast.loading("Fetching Instagram profile...");
    try {
      const instagramScrape = await getInstagramProfile({
        instagramUsername: username,
      });
      console.log("Instagram scrape result:", instagramScrape);

      await handleUpdateClub(slug, {
        avatarUrl:
          instagramScrape.profileImageUrl ||
          "/assets/default-fallback-image.png",
        description: instagramScrape.profileDescription || "",
      });

      toast.success("Instagram profile fetched successfully", {
        id: loadingToast,
      });
    } catch (error) {
      console.error("Error fetching Instagram profile:", error);
      toast.error("Failed to fetch Instagram profile", { id: loadingToast });
    }
  };

  return (
    <UnapprovedClubsUI
      clubs={clubs}
      handleInstagramFetch={handleInstagramFetch}
      handleUpdateClub={handleUpdateClub}
      handleApproveClub={handleApproveClub}
      handleClubDecline={handleClubDecline}
    />
  );
}
