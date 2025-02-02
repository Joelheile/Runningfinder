import { MapPin } from "lucide-react";
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

  isAdmin?: boolean;
  isCompact?: boolean;
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
  datetime,
  name,
  distance,
  difficulty,
  startDescription,
  mapsLink,
  isAdmin,
  isCompact = false,
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

  return (
    <div className={`w-full mx-auto ${isCompact ? "mb-2" : "mb-4"}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className={`flex ${isCompact ? "p-3" : "p-6"} h-full`}>
          <div className="flex-1">
            <div
              className={`text-gray-500 ${isCompact ? "text-xs" : "text-sm"} mb-2`}
            >
              {formatDate(datetime)}
            </div>
            <div className={`space-y-${isCompact ? "2" : "4"}`}>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`font-semibold ${isCompact ? "text-base" : "text-xl"} text-gray-900`}
                >
                  {name}
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="flex items-center">
                    {distance ? `${distance} km` : "N/A"}
                  </span>
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

          <div className="ml-4 pl-4 flex flex-col justify-between min-w-[200px]">
            <div className="flex items-start gap-2">
              <MapPin
                className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} text-gray-500 mt-1`}
              />
              <span
                className={`${isCompact ? "text-xs" : "text-sm"} text-gray-700`}
              >
                {startDescription}
              </span>
            </div>

            {mapsLink && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size={isCompact ? "sm" : "default"}
                  className="w-full justify-center gap-2 text-gray-700 hover:text-gray-900"
                  onClick={() => window.open(mapsLink, "_blank")}
                >
                  <span className={`${isCompact ? "text-xs" : "text-sm"}`}>
                    Open in Maps
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
