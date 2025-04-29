import { WorkerEvent } from "./WorkerEvent";

export interface WorkerResponse {
    totalClubs: number;
    totalEvents: number;
    averageEventsPerClub: number;
    lastUpdated: string;
    clubs: Array<{
      clubName: string;
      events: WorkerEvent[];
      totalEvents: number;
      instagramUsername?: string;
      stravaUsername?: string;
    }>;
  }