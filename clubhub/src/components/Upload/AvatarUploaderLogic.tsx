"use client";

import { useUploadAvatar } from "@/lib/hooks/useUploadAvatar";
import AvatarUploaderUI from "./AvatarUploaderUI";
import { useEffect } from "react";

interface AvatarUploaderProps {
  id: string;
  onUploadChange: (isUploaded: boolean) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ id, onUploadChange }) => {
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
};

export default AvatarUploader;