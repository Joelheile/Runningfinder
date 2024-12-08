"use client";
import React from "react";
import { useUploadAvatar } from "@/lib/hooks/avatars/useUploadAvatar";
import { useEffect } from "react";
import AvatarUploaderUI from "./AvatarUploaderUI";

interface AvatarUploaderProps {
  id: string;
  onUploadChange: (isUploaded: boolean) => void;
}

export default function AvatarUploader({
  id,
  onUploadChange,
}: AvatarUploaderProps) {
  const { uploadedUrl, isLoading, uploadAvatar } = useUploadAvatar();

  useEffect(() => {
    onUploadChange(!!uploadedUrl);
  }, [uploadedUrl, onUploadChange]);

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      uploadAvatar(files[0], id);
    }
  };

  return (
    <AvatarUploaderUI
      onDrop={handleDrop}
      isLoading={isLoading}
      uploadedUrl={uploadedUrl}
    />
  );
}
