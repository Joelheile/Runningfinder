"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useApproveClub from "@/lib/hooks/admin/clubs/useApproveClub";
import useDeclineClub from "@/lib/hooks/admin/clubs/useDeclineClub";
import useFetchClubs from "@/lib/hooks/admin/clubs/useFetchClubs";
import useUpdateAdminClub from "@/lib/hooks/admin/clubs/useUpdateAdminClub";
import getInstagramProfile from "@/lib/hooks/admin/useGetInstagramProfile";
import { useUploadAvatar } from "@/lib/hooks/avatars/useUploadAvatar";
import { Club } from "@/lib/types/Club";
import UnapprovedClubsUI from "./UnapprovedClubsUI";

export default function UnapprovedClubsLogic() {
  const router = useRouter();
  const { clubs, refetch, isLoading } = useFetchClubs();

  const updateAdminClub = useUpdateAdminClub;
  const approveClubFn = useApproveClub();
  const declineClub = useDeclineClub;
  const { uploadAvatar } = useUploadAvatar();

  const handleUpdateClub = async (slug: string, updateData: Partial<Club>) => {
    try {
      await updateAdminClub(slug, updateData);
      toast.success("Club updated successfully");
      await refetch();
      router.refresh();
    } catch (error) {
      console.error("Failed to update club:", error);
      toast.error("Failed to update club");
    }
  };

  const handleApproveClub = async (slug: string) => {
    try {
      const loadingToast = toast.loading("Approving club...");

      const result = await approveClubFn(slug);

      toast.success("Club approved successfully", { id: loadingToast });

      await refetch();
      router.refresh();

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error("Failed to approve club");
    }
  };

  const handleClubDecline = async (slug: string) => {
    try {
      const decline = declineClub(slug);
      await decline();
      toast.success("Club declined successfully");
      refetch();
      router.refresh();
    } catch (error) {
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

  if (isLoading) return <div>Loading...</div>;

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
