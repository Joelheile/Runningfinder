export default function ClubHeadersSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm absolute top-0 left-0 z-10 w-full text-card-foreground shadow-sm lg:p-6 sm:p-4 space-y-4 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div className="flex flex-col sm:flex-row w-full">
          <div className="rounded-md bg-gray-300 w-auto max-w-48 sm:w-1/6 h-48 object-cover mb-4 sm:mb-0 sm:mr-6"></div>
          <div className="flex flex-col justify-between w-full sm:w-2/3">
            <div>
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded mt-2 w-1/2"></div>
            </div>
            <div className="flex space-x-4 mt-4">
              <div className="h-8 bg-gray-300 rounded w-24"></div>
              <div className="h-8 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
        <div className="flex md:self-center mt-4">
          <div className="h-6 bg-gray-300 rounded w-12"></div>
          <div className="h-6 bg-gray-300 rounded w-6 ml-2"></div>
        </div>
      </div>
    </div>
  );
}
