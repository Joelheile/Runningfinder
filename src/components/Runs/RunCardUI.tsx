import { ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import LikeButton from "../Icons/LikeButton";
import { Button } from "../UI/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../UI/tooltip";

interface RunCardUIProps {
  userId?: string;
  id: string;
  datetime: Date | null;
  name: string;
  distance: string;
  difficulty: string;
  startDescription: string;
  mapsLink?: string | null;
  isRegistered?: boolean;
  isRegistering?: boolean;
  onLikeRun?: () => void;
  onUnregister?: () => void;
  isAdmin?: boolean;
  isCompact?: boolean;
  clubSlug?: string;
}

const getDifficultyInfo = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return {
        icon: "",
        description:
          "Social run, perfect for beginners. Usually under 10km at a conversational pace.",
        className: "bg-green-100 text-green-700",
      };
    case "intermediate":
      return {
        icon: "",
        description:
          "More structured run, typically 10-15km. Good for regular runners looking for a challenge.",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "advanced":
      return {
        icon: "",
        description:
          "Technical workout (intervals, hills) or long distance run (>15km). For experienced runners.",
        className: "bg-red-100 text-red-700",
      };
    default:
      return {
        icon: "",
        description: "Difficulty level not specified",
        className: "bg-gray-100 text-gray-700",
      };
  }
};

export default function RunCardUI({
  userId,
  id,
  datetime,
  name,
  distance,
  difficulty,
  startDescription,
  mapsLink,
  isRegistered,
  isRegistering,
  onLikeRun,
  onUnregister,
  isAdmin,
  isCompact = false,
  clubSlug,
}: RunCardUIProps) {
  const difficultyInfo = getDifficultyInfo(difficulty);

  const formatDate = (datetime: Date | null) => {
    if (!datetime) return "";
    const d = new Date(datetime);
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(d);
    const time = d.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    const fullDate = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
    return (
      <>
        <span className="font-bold">{weekday}</span> - {time} ({fullDate})
      </>
    );
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    if (onLikeRun) {
      e.preventDefault();
      e.stopPropagation();
      onLikeRun();

      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const handleMapsClick = (e: React.MouseEvent) => {
    if (mapsLink) {
      e.preventDefault();
      e.stopPropagation();
      window.open(mapsLink, "_blank");
    }
  };

  const CardContent = (
    <>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div className={`text-gray-500 ${isCompact ? "text-xs" : "text-sm"}`}>
            {formatDate(datetime)}
          </div>
        </div>

        <div className={`space-y-${isCompact ? "2" : "4"}`}>
          <div className="flex flex-wrap items-center gap-2">
            {onLikeRun && (
              <div className="z-10">
                <LikeButton
                  onClick={handleLikeClick}
                  isFilled={isRegistered || false}
                  isLoading={isRegistering}
                />
              </div>
            )}
            <h3
              className={`font-semibold ${isCompact ? "text-base" : "text-xl"} text-gray-900`}
            >
              {name}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="flex items-center">
              {distance ? `${distance} km` : "N/A"}
            </span>
            <div>
              <Tooltip>
                <TooltipTrigger>
                  <span
                    className={`px-2 py-1 rounded-full ${isCompact ? "text-xs" : "text-sm"} font-medium ${difficultyInfo.className}`}
                  >
                    {difficultyInfo.icon} {difficulty}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{difficultyInfo.description}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`
          flex flex-col justify-between
          ${isCompact ? "min-w-0" : "sm:min-w-[200px]"}
          mt-3 sm:mt-0
          pt-3 sm:pt-0
          border-t sm:border-t-0
          sm:ml-4 sm:pl-4
        `}
      >
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-start gap-1 hover:text-blue-600 transition-colors cursor-pointer">
              <MapPin
                className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} mt-0.5 flex-shrink-0`}
              />
              <span
                className={`${isCompact ? "text-xs leading-tight" : "text-sm"} text-gray-700`}
              >
                {startDescription}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm">Meeting point for the run</p>
          </TooltipContent>
        </Tooltip>

        {mapsLink && (
          <div className="flex flex-col gap-2 sm:gap-3 mt-2 sm:mt-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size={isCompact ? "sm" : "default"}
                  className="w-full justify-center gap-1 hover:bg-blue-600 hover:text-white transition-colors text-xs py-2 sm:py-1.5"
                  onClick={handleMapsClick}
                >
                  <span>Open in Maps</span>
                  <ExternalLink
                    className={`${isCompact ? "w-3 h-3" : "w-4 h-4"}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-sm">
                  View the route on Google Maps
                </p>
              </TooltipContent>
            </Tooltip>

            <div className="flex items-center justify-center text-gray-500 transition-colors cursor-pointer ">
              <span className="text-[12px]">Check Instagram for updates</span>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className={`w-full mx-auto ${isCompact ? "mb-2" : "mb-4"}`}>
      {clubSlug ? (
        <Link href={`/clubs/${clubSlug}`} className="block">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer">
            <div
              className={`flex flex-col sm:flex-row ${isCompact ? "p-3" : "p-4 sm:p-6"} h-full`}
            >
              {CardContent}
            </div>
          </div>
        </Link>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
          <div
            className={`flex flex-col sm:flex-row ${isCompact ? "p-3" : "p-4 sm:p-6"} h-full`}
          >
            {CardContent}
          </div>
        </div>
      )}
    </div>
  );
}
