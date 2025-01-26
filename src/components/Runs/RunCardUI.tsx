import { weekdays } from "@/lib/weekdays";
import { Trash } from "lucide-react";
import { Button } from "../UI/button";
import calculateCalories from "./CaloriesCalculator";

interface RunCardUIProps {
  userId?: string;
  id: string;
  key: string;
  date: Date | null;
  weekday: number;
  name: string;
  distance: string;
  difficulty: string;
  startDescription: string;
  location: any;

  mapsLink?: string | null;
  handleDeleteRun?: () => void;
  isAdmin?: boolean;
}

export default function RunCardUI({
  weekday,
  name,
  distance,
  difficulty,
  startDescription,
  mapsLink,
  // handleRegistration,
  handleDeleteRun,
  isAdmin,
}: RunCardUIProps) {
  const difficultyColor =
    difficulty == "easy"
      ? "bg-green-300"
      : difficulty == "intermediate"
        ? "bg-yellow-300"
        : "bg-red-300";

  const caloriesBurned = calculateCalories(difficulty, parseFloat(distance));

  return (
    <div className="mt-2">
      {weekday ? (
        <strong className="ml-1">{weekdays[weekday - 1].name}</strong>
      ) : null}

      <div className="flex bg-white mt-2 border justify-between p-2 rounded-md">
        <div className="flex gap-x-5 items-center pl-2">
          {/* <LikeButton onClick={handleRegistration} isFilled={likeFilled} /> */}
          <strong>{name}</strong>
          <p className="text-medium">|</p>
          <p>{distance} km</p>
          <p className="text-medium">|</p>
          <p className={`p-1 px-2 rounded-md ${difficultyColor}`}>
            {difficulty}
          </p>
          {/* <p className="  text-gray-400">~ {caloriesBurned} kcal</p> */}
        </div>
        <div className="flex gap-x-2 items-center pl-2">
          <Button
            className="min-w-28 w-auto"
            onClick={() => mapsLink && window.open(mapsLink, "_blank")}
          >
            {startDescription}
          </Button>
          {isAdmin && (
            <button
              type="button"
              className="stroke-primary"
              onClick={handleDeleteRun}
            >
              <Trash className="stroke-primary hover:bg-slate-200 rounded-sm" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
