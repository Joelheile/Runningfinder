"use client";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Label } from "@/components/UI/label";
import { Textarea } from "@/components/UI/textarea";
import AvatarUploader from "@/components/Upload/AvatarUploaderLogic";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../UI/card";

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
  handleInstagramUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Club</CardTitle>
          <CardDescription>
            Add your running club to help others find and join your community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avatar" className="block">Club Logo</Label>
                <div className="mt-1">
                  <AvatarUploader
                    id={avatarFileId}
                    onUploadChange={handleUploadChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Club Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g., Berlin Running Crew"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Club Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={handleDescriptionChange}
                  placeholder="Tell us about your club, your community, and what makes you unique..."
                  className="w-full min-h-[100px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={websiteUrl}
                  onChange={handleWebsiteUrlChange}
                  placeholder="https://your-club-website.com"
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramUsername">Instagram Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    @
                  </span>
                  <Input
                    id="instagramUsername"
                    value={instagramUsername}
                    onChange={handleInstagramUsernameChange}
                    className="w-full pl-8"
                    placeholder="your.club.handle"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!isUploaded}
            >
              Create Club
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
