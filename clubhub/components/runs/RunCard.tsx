interface RunCardProps {
  isLiked: boolean;
  date: Date;
  time: number;
  distance: number;
  location: string;
}

export default function RunCard({
  isLiked,
  date,
  time,
  distance,
  location,
}: RunCardProps) {
  return (
    <div className="flex-row w-full bg-white">
      <div>
        <img>heart icon</img>
        Date
        <p>{"Distance"} </p>
      </div>
    </div>
  );
}
