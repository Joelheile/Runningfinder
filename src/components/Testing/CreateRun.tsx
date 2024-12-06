import { Run } from "@/lib/types/Run";
import { v4 as uuidv4 } from "uuid";

export function createRun({
  name,
  difficulty,
  clubId,
  location,
  interval,
  intervalDay,
  startDescription,
  startTime,
  distance,
  membersOnly,
}: {
  name: string;
  difficulty: string;
  clubId: string;
  location: { lat: number; lng: number };
  interval: string;
  intervalDay: number;
  startDescription: string;
  startTime: string;
  distance: number;
  membersOnly: boolean;
}): Run | string {
  if (
    !name ||
    !difficulty ||
    !clubId ||
    !location ||
    !interval ||
    !intervalDay ||
    !startDescription ||
    !startTime ||
    !distance
  ) {
    return "Please fill out all fields";
  }

  const run: Run = {
    id: uuidv4(),
    name,
    difficulty,
    clubId,
    location,
    interval,
    intervalDay,
    startDescription,
    startTime,
    distance,
    membersOnly,
    date: null,
  };

  return run;
}
