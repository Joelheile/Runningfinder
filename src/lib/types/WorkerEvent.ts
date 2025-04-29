export interface WorkerEvent {
  eventName: string;
  clubName: string;
  datetime: string;
  location: string;
  locationUrl: string;
  difficulty: string;
  distance: string;
  isRecurrent?: boolean;
  location_latitude?: number;
  location_longitude?: number;
  instagramUsername?: string;
  stravaUsername?: string;
}
