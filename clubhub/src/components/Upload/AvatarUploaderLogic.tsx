"use client";

import { useUploadAvatar } from "@/lib/hooks/useUploadAvatar";
import AvatarUploaderUI from "./AvatarUploaderUI";


interface AvatarUploaderProps {
  id: string;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ id }) => {
  const { uploadedUrl, isLoading, uploadAvatar } = useUploadAvatar();

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      uploadAvatar(files[0], id);
    }
  };

  return (
    <AvatarUploaderUI onDrop={handleDrop} isLoading={isLoading} uploadedUrl={uploadedUrl} />
  );
};

export default AvatarUploader;