import { Button } from "../UI/button";
import { Input } from "../UI/input";
import { Label } from "../UI/label";
import { Textarea } from "../UI/textarea";
import AvatarUploader from "../Upload/AvatarUploaderLogic";

interface AddClubUIProps {
  name: string;
  description: string;
  websiteUrl: string;
  instagramUsername: string;
  avatarFileId: string;
  isUploaded: boolean;
  handleUploadChange: (uploaded: boolean) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function AddClubUI({
  name,
  isUploaded,
  description,
  websiteUrl,
  instagramUsername,
  avatarFileId,
  handleUploadChange,
  handleSubmit,
}: AddClubUIProps) {
  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="flex flex-col">
              <Label>Club Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <Label>Club Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <Label>Website Url (https://)</Label>
              <Input
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="mt-1 p-2 border rounded"
              />
            </div>
            <div className="flex flex-col">
              <Label>Instagram Username</Label>
              <Input
                value={instagramUsername}
                onChange={(e) => setInstagramUsername(e.target.value)}
                className="mt-1 p-2 border rounded"
              />
            </div>

            <AvatarUploader
              id={avatarFileId}
              onUploadChange={handleUploadChange}
            />
            <Button
              type="submit"
              className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
              Add club
            </Button>
          </div>
          <div className="App mt-8"></div>
        </form>
      </div>
    </div>
  );
}
