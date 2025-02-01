import { Skeleton } from "../UI/skeleton";

export default function RunCardUISkeleton() {
  return (
    <div className="mt-2">
      <Skeleton className="ml-1 h-6 w-20" />
      <div className="flex bg-white mt-2 border justify-between p-2 rounded-md">
        <div className="flex gap-x-5 items-center pl-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex gap-x-2 items-center pl-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
