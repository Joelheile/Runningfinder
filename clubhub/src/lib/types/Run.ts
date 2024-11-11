

export type Run = {
  id: string;
  name: string;
  difficulty: string;
  clubId: string;
  date: Date | null;
  location: {
    lat: number;
    lng: number;
  };
  interval: string;
  intervalDay: number;
  startDescription: string;
  startTime: string;
  distance: number;
  membersOnly: boolean;
};
