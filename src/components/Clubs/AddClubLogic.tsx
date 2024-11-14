"use client";

import { Club } from "@/lib/types/Club";
import { useState } from "react";
import { v4 } from "uuid";

import { useAddClub } from "@/lib/hooks/clubs/useAddClub";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AddClubUI from "./AddClubUI";

export default function AddClub() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [avatarFileId] = useState(v4());
  const [isUploaded, setIsUploaded] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name ||
      !description ||
      !websiteUrl ||
      !instagramUsername ||
      !isUploaded
    ) {
      isUploaded
        ? toast.error("Please fill out all fields")
        : toast.error("Please upload an avatar");

      return;
    } else {
      const formData: Club = {
        name,
        description,
        location: { lat: 0, lng: 0 },
        instagramUsername,
        memberCount: 0,
        avatarFileId: avatarFileId,
        avatarUrl: "",
        websiteUrl,
        id: "",
        creationDate: "",
        slug: "",
      };
      mutation.mutate(formData);
      router.push("/clubs");
      toast.success("Club added successfully");
    }
  };

  const mutation = useAddClub();

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
      handleUploadChange={handleUploadChange}
      handleSubmit={handleSubmit}
    />
  );
}
