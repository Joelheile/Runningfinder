import { useState } from "react";

export function useUploadAvatar() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadAvatar = async (file: File, avatarId: string) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target?.result;
      setIsLoading(true);

      if (fileData) {
        const presignedURL = new URL("/api/upload/presignedUrl", window.location.href);
        presignedURL.searchParams.set("fileName", file.name);
        presignedURL.searchParams.set("contentType", file.type);

        try {
          const res = await fetch(presignedURL.toString());
          const json = await res.json();
          const body = new Blob([fileData], { type: file.type });

          await fetch(json.signedUrl, {
            body,
            method: "PUT",
          });

          await fetch("/api/upload/avatar/club", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              objectId: avatarId,
              objectName: file.name,
              objectUrl: json.signedUrl.split("?")[0],
            }),
          });

          setUploadedUrl(json.signedUrl.split("?")[0]);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error("Error uploading file:", error);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return { uploadedUrl, isLoading, uploadAvatar };
}