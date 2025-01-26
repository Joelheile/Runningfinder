export type Club = {
  id: string;
  name: string;
  slug: string;

  description: string;
  creationDate: string;
  instagramUsername: string | null;
  stravaUsername: string | null;
  avatarFileId: string | null;
  avatarUrl: string;
  websiteUrl?: string;
  isApproved: boolean;
};
