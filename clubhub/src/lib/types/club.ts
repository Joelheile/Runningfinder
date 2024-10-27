export type Club = {
    id: string;
    name: string;
    position: {
      lat: number;
      lng: number;
    };
    description: string;
    creationDate: string;
    instagramUsername: string;
    memberCount: number;
    profileImageUrl: string;
    websiteUrl: string;
  };