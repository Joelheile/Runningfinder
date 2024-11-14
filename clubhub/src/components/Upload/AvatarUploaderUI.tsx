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
    <div {...getRootProps()} className="p-6 border-2 border-dashed rounded-lg">
      <input {...getInputProps()} />
      {!uploadedUrl ? (
        <p>Drag & drop a file here, or click to select one</p>
      ) : (
        <>
          <img
            src={uploadedUrl}
            alt="Uploaded file"
            className="h-32 w-auto rounded-md"
          />
        </>
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
