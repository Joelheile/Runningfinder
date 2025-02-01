export interface Run {
  id: string;
  name: string;
  difficulty: string;
  clubId: string;
  datetime: Date;
  weekday: number | null;
  startDescription: string;
  location: {
    lat: number;
    lng: number;
  };
  mapsLink: string | null;
  distance: string;
  isRecurrent: boolean;
  isApproved: boolean;
}
