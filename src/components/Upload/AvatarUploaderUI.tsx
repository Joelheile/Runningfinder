import React from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { LoadingSpinner } from "../UI/loadingSpinner";

interface AvatarUploaderUIProps {
  onDrop: (files: File[]) => void;
  isLoading: boolean;
  uploadedUrl: string | null;
}

export default function AvatarUploaderUI({
  onDrop,
  isLoading,
  uploadedUrl,
}: AvatarUploaderUIProps) {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="p-6 w-full border-2 border-dashed rounded-lg"
    >
      <input {...getInputProps()} />
      {!uploadedUrl ? (
        <p>Drag & drop a file here, or click to select one</p>
      ) : (
        <div className="flex justify-center">
          <div className="lg:w-80 sm:w-40">
            <Image
              width={500}
              height={500}
              src={uploadedUrl}
              alt="Uploaded file"
              className="h-32 w-auto object-cover rounded-md"
            />
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex gap-x-2">
          <LoadingSpinner />
          Uploading file
        </div>
      )}
    </div>
  );
}
