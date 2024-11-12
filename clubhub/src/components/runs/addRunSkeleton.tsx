import { Skeleton } from "../ui/skeleton";

export default function AddRunSkeleton() {
  return (
    <div>
      <div className="grid gap-4">
        <div className="flex flex-col">
          <Skeleton className="h-8 mt-1 w-full" />
        </div>
        <div className="flex flex-col">
          <Skeleton className="h-8 mt-1 w-full" />
        </div>
        <div className="flex flex-col">
          <Skeleton className="h-8 mt-1 w-full" />
        </div>
        <div className="flex flex-col">
          <Skeleton className="h-8 mt-1 w-full" />
        </div>
        <div className="flex flex-col">
          <Skeleton className="h-8 mt-1 w-full" />
        </div>
        <div className="flex flex-col">
          <Skeleton className="h-8 mt-1 w-full" />
        </div>
        <div className="flex flex-col">
          <Skeleton className="h-8 mt-1 w-full" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 mt-1 w-6" />
        </div>
      </div>

      <Skeleton className="h-10 mt-4 w-full" />
      <div className="App mt-8">
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}
