import LikeButton from "../icons/LikeButton";
import { Input } from "../ui/input";

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

  return (
    <div className="flex bg-white gap-x-5 border p-3 rounded-md">
      <LikeButton />
      {placeholder()}
      <p>{distance} km </p>
      {placeholder()}
      {/* <p>{location} </p> */}
    </div>
  );
}
