import { Club } from "@/lib/types/Club";
import { v4 as uuidv4 } from "uuid";

export function createClub({
  name,
  description,
  websiteUrl,
  instagramUsername,
  isUploaded,
}: {
  name: string;
  description: string;
  websiteUrl: string;
  instagramUsername: string;
  isUploaded: boolean;
}): Club | string {
  if (
    !name ||
    !description ||
    !websiteUrl ||
    !instagramUsername ||
    !isUploaded
  ) {
    return "Please fill out all fields and upload an avatar";
  }

  return {
    id: uuidv4(),
    name,
    description,
    location: { lat: 0, lng: 0 },
    instagramUsername,
    memberCount: 0,
    avatarFileId: uuidv4(),
    avatarUrl: "",
    websiteUrl,
    creationDate: new Date().toISOString(),
    slug: name.toLowerCase().replace(/ /g, "-"),
  };
}
