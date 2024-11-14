import { Skeleton } from "../UI/skeleton";

export default function ClubHeaderSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 z-10 w-full text-card-foreground shadow-sm lg:p-6 sm:p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="flex flex-col sm:flex-row w-full">
          <Skeleton className="rounded-md w-auto max-w-48 sm:w-1/6 h-48 object-cover mb-4 sm:mb-0 sm:mr-6" />
          <div className="flex flex-col justify-between w-full sm:w-2/3">
            <div>
              <Skeleton className="h-6 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/2 rounded mt-2" />
            </div>
            <div className="flex space-x-4 mt-4">
              <Skeleton className="h-8 w-24 rounded" />
              <Skeleton className="h-8 w-24 rounded" />
            </div>
          </div>
        </div>
        <div className="flex md:self-center mt-4">
          <Skeleton className="h-6 w-12 rounded" />
          <Skeleton className="h-6 w-6 rounded ml-2" />
        </div>
      </div>
    </div>
  );
}
