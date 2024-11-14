"use client";
import { useAddClub } from "@/lib/hooks/clubs/useAddClub";
import { Club } from "@/lib/types/Club";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import AddClubUI from "./AddClubUI";

export default function AddClub() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [avatarFileId] = useState(uuidv4());
  const [isUploaded, setIsUploaded] = useState(false);

  const router = useRouter();

  const mutation = useAddClub();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      !description ||
      !websiteUrl ||
      !instagramUsername ||
      !isUploaded
    ) {
      if (!isUploaded) {
        toast.error("Please upload an avatar");
      } else {
        toast.error("Please fill out all fields");
      }
      return;
    }

    const formData: Club = {
      name,
      description,
      location: { lat: 0, lng: 0 },
      instagramUsername,
      memberCount: 0,
      avatarFileId,
      avatarUrl: "",
      websiteUrl,
      id: "",
      creationDate: "",
      slug: "",
    };

    mutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Club added successfully");
        router.push("/clubs");
      },
      onError: (error) => {
        toast.error("Failed to add club");
        console.error(error);
      },
    });
  };

  const handleUploadChange = (uploaded: boolean) => {
    setIsUploaded(uploaded);
  };

  return (
    <AddClubUI
      name={name}
      description={description}
      websiteUrl={websiteUrl}
      instagramUsername={instagramUsername}
      avatarFileId={avatarFileId}
      isUploaded={isUploaded}
      handleNameChange={(e) => setName(e.target.value)}
      handleDescriptionChange={(e) => setDescription(e.target.value)}
      handleWebsiteUrlChange={(e) => setWebsiteUrl(e.target.value)}
      handleInstagramUsernameChange={(e) =>
        setInstagramUsername(e.target.value)
      }
      handleUploadChange={handleUploadChange}
      handleSubmit={handleSubmit}
    />
  );
}
