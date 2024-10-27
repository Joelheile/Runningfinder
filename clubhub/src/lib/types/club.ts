export type Club = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  creationDate: string;
  instagramUsername: string;
  memberCount: number;
  avatarUrl: string;
  websiteUrl: string;
};
