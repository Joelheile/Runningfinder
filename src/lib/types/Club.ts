export type Club = {
  id: string;
  name: string;
  slug: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  creationDate: string;
  instagramUsername: string;
  stravaUsername: string;
  memberCount: number;
  avatarFileId: string;
  avatarUrl: string;
  websiteUrl: string;
  isApproved: boolean;
};
