"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useUploadAvatar } from "@/lib/hooks/avatars/useUploadAvatar";
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

  // Call hooks at the top level
  const updateAdminClub = useUpdateAdminClub; // Keep it as a function reference
  const approveClub = useApproveClub; // Keep it as a function reference
  const declineClub = useDeclineClub; // Keep it as a function reference
  const { uploadAvatar } = useUploadAvatar();

  const handleUpdateClub = async (slug: string, updateData: Partial<Club>) => {
    try {
      await updateAdminClub(slug, updateData); // Call with slug and updateData
      toast.success("Club updated successfully");
      await refetch();
      router.refresh();
    } catch (error) {
      console.error("Failed to update club:", error);
      toast.error("Failed to update club");
    }
  };

  const handleApproveClub = async (clubId: string) => {
    try {
      await approveClub(clubId); // Call with clubId
      toast.success("Club approved successfully");
      refetch();
      router.refresh();
    } catch (error) {
      console.error("Failed to approve club:", error);
      toast.error("Failed to approve club");
    }
  };

  const handleClubDecline = async (slug: string) => {
    try {
      const decline = declineClub(slug); // Call with slug
      await decline(); // Await the decline function
      toast.success("Club declined successfully");
      refetch();
      router.refresh();
    } catch (error) {
      console.error("Failed to decline club:", error);
      toast.error("Failed to decline club");
    }
  };

  const handleInstagramFetch = async (slug: string, username: string) => {
    if (!username) return;

    const loadingToast = toast.loading("Fetching Instagram profile...");
    try {
      const instagramScrape = await getInstagramProfile({
        instagramUsername: username,
      });

      await handleUpdateClub(slug, {
        avatarUrl:
          instagramScrape.profileImageUrl ||
          "/assets/default-fallback-image.png",
        description: instagramScrape.profileDescription || "",
      });

      toast.success("Instagram profile fetched successfully", {
        id: loadingToast,
      });
      window.location.reload();
    } catch (error) {
      console.error("Error fetching Instagram profile:", error);
      toast.error("Failed to fetch Instagram profile", { id: loadingToast });
    }
  };

  const handleImageUpload = async (slug: string, file: File) => {
    const loadingToast = toast.loading("Uploading image...");
    try {
      const url = await uploadAvatar(file, slug);
      await handleUpdateClub(slug, { avatarUrl: url });
      toast.success("Image uploaded successfully", { id: loadingToast });
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image", { id: loadingToast });
    }
  };

  return (
    <UnapprovedClubsUI
      clubs={clubs}
      handleInstagramFetch={handleInstagramFetch}
      handleUpdateClub={handleUpdateClub}
      handleApproveClub={handleApproveClub}
      handleClubDecline={handleClubDecline}
      handleImageUpload={handleImageUpload}
    />
  );
}
