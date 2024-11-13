import { Skeleton } from "../ui/skeleton";

export default function ClubCardSkeleton() {
  return (
    <div className="flex flex-col items-center mt-32">
      <Skeleton className="w-1/3 h-48 mb-4" />
      <Skeleton className="w-1/4 h-6 mb-2" />
      <Skeleton className="w-1/4 h-6 mb-2" />
      <Skeleton className="w-1/4 h-6 mb-2" />
    </div>
  );
}
