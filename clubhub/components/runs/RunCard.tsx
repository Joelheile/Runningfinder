import LikeButton from "../icons/LikeButton";
import { Input } from "../ui/input";

interface RunCardProps {
  date: string;
  time: number;
  distance: number;
  location: string;
}

export default function RunCard({
  date,
  time,
  distance,
  location,
}: RunCardProps) {
  return (
    <div className="flex bg-white gap-x-5 border p-3 rounded-md">
      <LikeButton />
      <p>{date}</p>
      <p className=" text-medium ">|</p>

      <p>{distance} km </p>
      <p className=" text-medium ">|</p>
      <p>{location} </p>
    </div>
  );
}
