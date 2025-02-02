import { MapPin, Trash } from "lucide-react";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Button } from "../UI/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../UI/tooltip";

interface RunCardUIProps {
  userId?: string;
  id: string;
  key: string;
  datetime: Date | null;
  name: string;
  distance: string;
  difficulty: string;
  startDescription: string;
  locationLat: number;
  locationLng: number;
  mapsLink?: string | null;
  handleDeleteRun?: () => void;
  isAdmin?: boolean;
  isCompact?: boolean;
}

const getMapContainerStyle = (isCompact: boolean) => ({
  width: "100%",
  height: isCompact ? "150px" : "250px",
});

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
  locationLat,
  locationLng,
  mapsLink,
  handleDeleteRun,
  isAdmin,
  isCompact = false,
}: RunCardUIProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const difficultyInfo = getDifficultyInfo(difficulty);

  console.log("passed run", {
    datetime,
    name,
    distance,
    difficulty,
    startDescription,
    locationLat,
    locationLng,
    mapsLink,
  });

  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current) return;

    // Parse location coordinates ensuring they are numbers
    const lat = parseFloat(String(locationLat));
    const lng = parseFloat(String(locationLng));

    const validLocation = {
      lat: !isNaN(lat) ? lat : 52.52,
      lng: !isNaN(lng) ? lng : 13.405,
    };

    console.log("Setting map location to:", validLocation);

    // If map doesn't exist, create it
    if (!map) {
      const mapInstance = new window.google.maps.Map(
        mapRef.current as HTMLElement,
        {
          center: validLocation,
          zoom: 15,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        }
      );
      setMap(mapInstance);

      const markerInstance = new window.google.maps.Marker({
        position: validLocation,
        map: mapInstance,
        title: startDescription || name,
        animation: window.google.maps.Animation.DROP,
      });
      setMarker(markerInstance);
    } else {
      // Update existing map and marker positions
      map.setCenter(validLocation);
      if (marker) {
        marker.setPosition(validLocation);
        marker.setTitle(startDescription || name);
      }
    }
  }, [isScriptLoaded, locationLat, locationLng, name]);

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
        <div
          className={`flex ${isCompact ? "flex-col" : "flex-col lg:flex-row"}`}
        >
          <div className={`flex-1 ${isCompact ? "p-3" : "p-6"}`}>
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

              <div className="flex items-center gap-2">
                <MapPin
                  className={`${isCompact ? "w-3 h-3" : "w-4 h-4"} text-gray-500`}
                />
                {mapsLink ? (
                  <Button
                    variant="link"
                    size={isCompact ? "sm" : "default"}
                    className="p-0 h-auto font-normal"
                    onClick={() => window.open(mapsLink, "_blank")}
                  >
                    <span
                      className={`${isCompact ? "text-xs" : "text-sm"} text-blue-600 hover:text-blue-800`}
                    >
                      {startDescription}
                    </span>
                  </Button>
                ) : (
                  <span
                    className={`${isCompact ? "text-xs" : "text-sm"} text-gray-700`}
                  >
                    {startDescription}
                  </span>
                )}

                {isAdmin && handleDeleteRun && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={handleDeleteRun}
                  >
                    <Trash className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {!isCompact && (
            <div className="w-full lg:w-[500px] h-64 lg:h-auto relative">
              <div
                ref={mapRef}
                style={getMapContainerStyle(false)}
                className="rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none"
              />
            </div>
          )}
        </div>
      </div>

      {!isCompact && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
          onLoad={() => setIsScriptLoaded(true)}
        />
      )}
    </div>
  );
}
