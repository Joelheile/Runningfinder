export interface Run {
  id: string;
  name: string;
  difficulty: string;
  clubId: string;
  date: Date;
  startDescription: string;
  location: {
    lat: number;
    lng: number;
  };
  mapsLink: string | null;
  distance: string;
  temperature: number | null;
  wind: number | null;
  uv_index: number | null;
  membersOnly: boolean;
  isRecurrent: boolean;
}
