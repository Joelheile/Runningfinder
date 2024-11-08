import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { LoadingSpinner } from "../ui/loadingSpinner";

const AvatarUploader = ({ id }: { id: string }) => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarId] = useState(id);

  const onDrop = async (files: File[]) => {
    const file = files[0];

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target?.result;
      setIsLoading(true);
      //TODO: convert into hooks
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
          console.log("signedUrl:", json.signedUrl.split("?")[0]);

          await fetch(json.signedUrl, {
            body,
            method: "PUT",
          });

          await fetch("/api/upload/avatar", {
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

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="p-6 border-2 border-dashed rounded-lg">
      <input {...getInputProps()} />
      <p>Drag & drop a file here, or click to select one</p>
      {isLoading && (
        <div className="flex gap-x-2">
          <LoadingSpinner className="" />
          Uploading file
        </div>
      )}
      {uploadedUrl && (
        <p className="mt-4">
          File uploaded! View it{" "}
          <a href={uploadedUrl} className="underline">
            here
          </a>
          .
        </p>
      )}
    </div>
  );
};

export default AvatarUploader;
