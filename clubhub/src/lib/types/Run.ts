export type Run = {
    id: string;
    clubId: string;
    date: Date;
    location: {
        lat: number;
        lng: number;
      };
    interval: string;
    intervalDay: number;
    startDescription: string;
    startTime: Date;
    distance: number;
   

  };
  