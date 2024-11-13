"use client";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import AvatarUploader from "@/components/Upload/AvatarUploaderLogic";
import { useAddClub } from "@/lib/hooks/useAddClub";
import { Club } from "@/lib/types/Club";
import { useState } from "react";
import { v4 } from "uuid";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";

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
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="flex flex-col">
            <Label>Club Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <Label>Club Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <Label>Website Url (https://)</Label>
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <Label>Instagram Username</Label>
            <Input
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>

          <AvatarUploader
            id={avatarFileId}
            onUploadChange={handleUploadChange}
          />
          <Button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Add club
          </Button>
        </div>
        <div className="App mt-8"></div>
      </form>
    </div>
  );
}
