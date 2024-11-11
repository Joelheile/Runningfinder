import { useDropzone } from "react-dropzone";
import { LoadingSpinner } from "../ui/loadingSpinner";

interface AvatarUploaderUIProps {
  onDrop: (files: File[]) => void;
  isLoading: boolean;
  uploadedUrl: string | null;
}

const AvatarUploaderUI: React.FC<AvatarUploaderUIProps> = ({
  onDrop,
  isLoading,
  uploadedUrl,
}) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="p-6 border-2 border-dashed rounded-lg">
      <input {...getInputProps()} />
      {!uploadedUrl ? (
        <p>Drag & drop a file here, or click to select one</p>
      ) : (
        <p className="mt-4">
          File uploaded! View it
          <a href={uploadedUrl} className="underline">
            here
          </a>
          .
        </p>
      )}

      {isLoading && (
        <div className="flex gap-x-2">
          <LoadingSpinner />
          Uploading file
        </div>
      )}
    </div>
  );
};

export default AvatarUploaderUI;
