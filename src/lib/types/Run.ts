export interface Run {
  id: string;
  name: string;
  difficulty: string;
  clubId: string;
  date: Date;
  weekday: number | null;
  startDescription: string;
  locationLat: number;
  locationLng: number;
  mapsLink: string | null;
  distance: string;
  isRecurrent: boolean;
  isApproved: boolean;
}
