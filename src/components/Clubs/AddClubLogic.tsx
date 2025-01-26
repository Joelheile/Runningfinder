"use client";
import { useAddClub } from "@/lib/hooks/clubs/useAddClub";
import useGetProfileImage from "@/lib/hooks/scraping/useGetInstagramProfile";
import { Club } from "@/lib/types/Club";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import AddClubUI from "./AddClubUI";

export default function AddClub() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stravaUsername, setStravaUsername] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [avatarFileId] = useState(uuidv4());
  const [isUploaded, setIsUploaded] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 2;

  const router = useRouter();
  const mutation = useAddClub();
  const { getProfileImage } = useGetProfileImage();

  const handleInstagramUsernameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const username = e.target.value;
    setInstagramUsername(username);

    // Only fetch the profile image if no image has been manually uploaded
    if (username && !isUploaded) {
      try {
        const data = await getProfileImage({ instagramUsername: username });
        // We'll let the backend handle setting the avatar URL from Instagram
      } catch (error) {
        console.error("Failed to fetch Instagram data:", error);
      }
    }
  };

  const handleUploadChange = (uploaded: boolean, url: string | null) => {
    setIsUploaded(uploaded);
    setAvatarUrl(url);
  };

  const validateRequiredFields = () => {
    if (!name.trim()) {
      toast.error("Please enter a club name");
      return false;
    }
    if (!description.trim()) {
      toast.error("Please tell us about your club");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && !validateRequiredFields()) return;
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    setStep(1);
    setName("");
    setDescription("");
    setStravaUsername("");
    setInstagramUsername("");
    setIsUploaded(false);
    setAvatarUrl(null);
  };

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only process submission on the final step
    if (step !== totalSteps) {
      return;
    }

    if (!validateRequiredFields()) return;

    // Show creation toast
    const creationToast = toast.loading("🏗️ Creating your running club...");

    try {
      // If Instagram username is provided and no avatar is uploaded, try to get the profile image
      if (instagramUsername && !isUploaded) {
        console.log("📸 Fetching Instagram profile for:", instagramUsername);
        try {
          const data = await getProfileImage({ instagramUsername });
          console.log("📱 Instagram profile data:", data);

          if (data.profileImageUrl) {
            console.log(
              "🖼️ Setting avatar URL from Instagram:",
              data.profileImageUrl
            );
            setAvatarUrl(data.profileImageUrl);
            setIsUploaded(false); // We should set this to false for Instagram avatars
          } else {
            console.warn("⚠️ No profile image URL returned from Instagram");
          }
        } catch (error) {
          console.error("❌ Failed to fetch Instagram data:", error);
          // Continue with club creation even if Instagram fetch fails
        }
      } else {
        console.log("ℹ️ Skipping Instagram fetch:", {
          instagramUsername,
          isUploaded,
          avatarUrl,
        });
      }

      console.log("📝 Preparing club data:", {
        name,
        description,
        instagramUsername,
        stravaUsername,
        avatarFileId,
        isUploaded,
        avatarUrl: avatarUrl || "",
      });

      const formData: Club = {
        id: "",
        name,
        description,
        instagramUsername: instagramUsername.trim() || "",
        stravaUsername: stravaUsername.trim() || "",
        avatarFileId: isUploaded ? avatarFileId : null, // Only use avatarFileId for manual uploads
        avatarUrl: avatarUrl || "", // Use avatarUrl state which already contains Instagram URL if available
        creationDate: "",
        slug: "",
        isApproved: false,
        websiteUrl: "",
      };

      console.log("💾 Submitting club data:", formData);
      await mutation.mutateAsync(formData);
      console.log("✅ Club created successfully!");

      toast.success("Club added successfully! 🎉", { id: creationToast });
      resetForm();
      setIsOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error("❌ Error creating club:", error);
      toast.error(error.message || "Failed to add club", { id: creationToast });
    }
  };

  return (
    <AddClubUI
      name={name}
      description={description}
      stravaUsername={stravaUsername}
      instagramUsername={instagramUsername}
      avatarFileId={avatarFileId}
      isUploaded={isUploaded}
      isOpen={isOpen}
      step={step}
      totalSteps={totalSteps}
      handleNameChange={(e) => setName(e.target.value)}
      handleDescriptionChange={(e) => setDescription(e.target.value)}
      handleStravaUsernameChange={(e) => setStravaUsername(e.target.value)}
      handleInstagramUsernameChange={handleInstagramUsernameChange}
      handleUploadChange={handleUploadChange}
      handleSubmit={handleSubmit}
      handleClose={handleClose}
      setIsOpen={setIsOpen}
      nextStep={nextStep}
      prevStep={prevStep}
    />
  );
}
