import Link from "next/link";
import LikeButton from "../icons/LikeButton";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { weekdays } from "@/lib/weekdays";

interface RunCardProps {
  time: string;
  distance: number;
  location: { lat: number; lng: number };
  intervalDay: number;
  name: string;
  startDescription: string;
  difficulty: string;
}

export default function RunCard({
  time,
  distance,
  location,
  intervalDay,
  name,
  startDescription,
  difficulty,
}: RunCardProps) {
  function placeholder() {
    return <p className=" text-medium ">|</p>;
  }
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;

  return (
    <div className="mt-2 ">
      <strong className="ml-1">{weekdays[intervalDay-1].name}</strong>
      <div className="flex bg-white mt-2 border justify-between p-2 rounded-md">
        <div className="flex gap-x-5 items-center pl-2">
          <LikeButton />
          <strong>{name} </strong>
          {placeholder()}
          <p>{time} </p>
          {placeholder()}

          <p>{distance} km </p>

          {placeholder()}
          <p>{difficulty} </p>
        </div>
        <div>
          <Button
            className=" min-w-28 w-auto"
            onClick={() => window.open(googleMapsUrl, "_blank")}
          >
            {startDescription}
          </Button>
        </div>
      </div>
    </div>
  );
}
