"use client";
import getInstagramProfile from "@/lib/hooks/admin/useGetInstagramProfile";
import { useAddClub } from "@/lib/hooks/clubs/useAddClub";
import { Club } from "@/lib/types/Club";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (isOpen) {
      posthog.startSessionRecording();
      posthog.capture("club_creation_started", {
        $recording_enabled: true,
      });
    }
  }, [isOpen]);

  const handleInstagramUsernameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const username = e.target.value;
    setInstagramUsername(username);

    if (username && !isUploaded) {
      try {
        const data = await getInstagramProfile({ instagramUsername: username });
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
    if (step === 1 && !validateRequiredFields()) {
      posthog.capture("club_creation_validation_failed", {
        $recording_enabled: true,
        step: step,
        missing_fields: [
          !name.trim() ? "name" : null,
          !description.trim() ? "description" : null,
        ].filter(Boolean),
      });
      return;
    }

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
    posthog.capture("club_creation_submitted", {
      fields_completed: {
        has_name: !!name.trim(),
        has_description: !!description.trim(),
        has_instagram: !!instagramUsername.trim(),
        has_strava: !!stravaUsername.trim(),
        has_avatar: isUploaded || !!avatarUrl,
      },
      time_spent: Date.now() - (window as any).__clubCreationStartTime,
    });
    e.preventDefault();

    if (step !== totalSteps) {
      return;
    }

    if (!validateRequiredFields()) return;

    const creationToast = toast.loading("🏗️ Creating your running club...");

    try {
      if (instagramUsername && !isUploaded) {
        console.log("📸 Fetching Instagram profile for:", instagramUsername);
        try {
          const data = await getInstagramProfile({ instagramUsername });
          console.log("📱 Instagram profile data:", data);

          if (data.profileImageUrl) {
            console.log(
              "🖼️ Setting avatar URL from Instagram:",
              data.profileImageUrl
            );
            setAvatarUrl(data.profileImageUrl);
            setIsUploaded(false);
          } else {
            console.warn("⚠️ No profile image URL returned from Instagram");
          }
        } catch (error) {
          console.error("❌ Failed to fetch Instagram data:", error);
        }
      } else {
      }

      const formData: Club = {
        id: "",
        name,
        description,
        instagramUsername: instagramUsername.trim() || "",
        stravaUsername: stravaUsername.trim() || "",
        avatarFileId: isUploaded ? avatarFileId : "",
        avatarUrl: avatarUrl || "",
        creationDate: "",
        slug: "",
        isApproved: false,
        websiteUrl: "",
      };

      await mutation.mutateAsync(formData);

      posthog.capture("club_created", {
        $recording_enabled: true,
        club_name: name,
        has_instagram: !!instagramUsername,
        has_strava: !!stravaUsername,
        has_avatar: isUploaded || !!avatarUrl,
      });

      toast.success(
        "Club added successfully 🎉 It will now be reviewed by our team",
        { id: creationToast }
      );
      resetForm();
      setIsOpen(false);
      router.refresh();
    } catch (error: any) {
      posthog.capture("club_creation_failed", {
        $recording_enabled: true,
        error_message: error.message || "Unknown error",
        fields_completed: {
          has_name: !!name.trim(),
          has_description: !!description.trim(),
          has_instagram: !!instagramUsername.trim(),
          has_strava: !!stravaUsername.trim(),
          has_avatar: isUploaded || !!avatarUrl,
        },
      });
      toast.error(error.message || "Failed to add club", { id: creationToast });
    }
  };

  useEffect(() => {
    if (isOpen) {
      (window as any).__clubCreationStartTime = Date.now();
      posthog.capture("club_creation_modal_opened");
    }
  }, [isOpen]);

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
