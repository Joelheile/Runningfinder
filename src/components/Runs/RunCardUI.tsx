import { weekdays } from "@/lib/weekdays";
import LikeButton from "../Icons/LikeButton";
import { Button } from "../UI/button";

interface RunCardUIProps {
  intervalDay: number;
  name: string;
  time: string;
  distance: number;
  difficulty: string;
  startDescription: string;
  googleMapsUrl: string;
  likeFilled: boolean;
  handleClick: () => void;
}

export default function RunCardUI({
  intervalDay,
  name,
  time,
  distance,
  difficulty,
  startDescription,
  googleMapsUrl,
  likeFilled,
  handleClick,
}: RunCardUIProps) {
  return (
    <div className="mt-2">
      <strong className="ml-1">{weekdays[intervalDay - 1].name}</strong>
      <div className="flex bg-white mt-2 border justify-between p-2 rounded-md">
        <div className="flex gap-x-5 items-center pl-2">
          <LikeButton onClick={handleClick} isFilled={likeFilled} />
          <strong>{name}</strong>
          <p className="text-medium">|</p>
          <p>{time}</p>
          <p className="text-medium">|</p>
          <p>{distance} km</p>
          <p className="text-medium">|</p>
          <p>{difficulty}</p>
        </div>
        <div>
          <Button
            className="min-w-28 w-auto"
            onClick={() => window.open(googleMapsUrl, "_blank")}
          >
            {startDescription}
          </Button>
        </div>
      </div>
    </div>
  );
}
