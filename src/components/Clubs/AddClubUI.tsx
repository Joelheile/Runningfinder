"use client";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Textarea } from "@/components/UI/textarea";
import AvatarUploader from "@/components/Upload/AvatarUploaderLogic";

interface AddClubUIProps {
  name: string;
  description: string;
  websiteUrl: string;
  instagramUsername: string;
  avatarFileId: string;
  isUploaded: boolean;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleWebsiteUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInstagramUsernameChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleUploadChange: (uploaded: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function AddClubUI({
  name,
  description,
  websiteUrl,
  instagramUsername,
  avatarFileId,
  isUploaded,
  handleNameChange,
  handleDescriptionChange,
  handleWebsiteUrlChange,
  handleInstagramUsernameChange,
  handleUploadChange,
  handleSubmit,
}: AddClubUIProps) {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="flex flex-col">
            <Label htmlFor="name">Club Name</Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              className="mt-1 p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="description">Club Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              className="mt-1 p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="websiteUrl">Website URL (https://)</Label>
            <Input
              id="websiteUrl"
              type="url"
              value={websiteUrl}
              onChange={handleWebsiteUrlChange}
              className="mt-1 p-2 border rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="instagramUsername">Instagram Username</Label>
            <Input
              id="instagramUsername"
              value={instagramUsername}
              onChange={handleInstagramUsernameChange}
              className="mt-1 p-2 border rounded"
              required
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
            Add Club
          </Button>
        </div>
      </form>
    </div>
  );
}
