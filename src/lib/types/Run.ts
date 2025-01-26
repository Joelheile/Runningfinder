export type Run = {
  id: string;
  name: string;
  difficulty: string;
  clubId: string;
  date: Date | null;
  weekday: number;
  startDescription: string;
  location: {
    lat: number;
    lng: number;
  };
  mapsLink: string | null;
  distance: string;
  temperature: number | null;
  isRecurrent: boolean;
  wind: number | null;
  uv_index: number | null;
  membersOnly: boolean;
};
