export type Club = {
  id: string;
  name: string;
  slug: string;

  description: string;
  creationDate: string;
  instagramUsername?: string;
  stravaUsername?: string;
  avatarFileId?: string;
  avatarUrl: string;
  websiteUrl?: string;
  isApproved: boolean;
};
