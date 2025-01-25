import { useState } from "react";

export function useUploadAvatar() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadAvatar = async (file: File, avatarId: string): Promise<string> => { // Ensure it returns a Promise<string>
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        const fileData = event.target?.result;
        setIsLoading(true);

        if (fileData) {
          const presignedURL = new URL(
            "/api/upload/presignedUrl",
            window.location.href,
          );
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
            resolve(json.signedUrl.split("?")[0]); // Resolve the promise with the URL
          } catch (error) {
            setIsLoading(false);
            console.error("Error uploading file:", error);
            reject(error); // Reject the promise on error
          }
        } else {
          setIsLoading(false);
          reject(new Error("File data is not available")); // Reject if file data is not available
        }
      };
    });
  };

  return { uploadedUrl, isLoading, uploadAvatar };
}
