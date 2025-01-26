import { MapPin, Trash } from "lucide-react";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Button } from "../UI/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../UI/tooltip";

interface RunCardUIProps {
  userId?: string;
  id: string;
  key: string;
  date: Date | null;
  name: string;
  distance: string;
  difficulty: string;
  startDescription: string;
  locationLat: number;
  locationLng: number;
  mapsLink?: string | null;
  handleDeleteRun?: () => void;
  isAdmin?: boolean;
}

const mapContainerStyle = {
  width: "100%",
  height: "250px",
};

const getDifficultyInfo = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return {
        icon: "🟢",
        description:
          "Social run, perfect for beginners. Usually under 10km at a conversational pace.",
        className: "bg-green-100 text-green-700",
      };
    case "intermediate":
      return {
        icon: "🟡",
        description:
          "More structured run, typically 10-15km. Good for regular runners looking for a challenge.",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "advanced":
      return {
        icon: "🔴",
        description:
          "Technical workout (intervals, hills) or long distance run (>15km). For experienced runners.",
        className: "bg-red-100 text-red-700",
      };
    default:
      return {
        icon: "⚪",
        description: "Difficulty level not specified",
        className: "bg-gray-100 text-gray-700",
      };
  }
};

export default function RunCardUI({
  date,
  name,
  distance,
  difficulty,
  startDescription,
  locationLat,
  locationLng,
  mapsLink,
  handleDeleteRun,
  isAdmin,
}: RunCardUIProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const difficultyInfo = getDifficultyInfo(difficulty);

  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current) return;

    const initMap = async () => {
      try {
        // Validate location coordinates and use fallback if invalid
        const validLocation = {
          lat:
            typeof locationLat === "number" && isFinite(locationLat)
              ? locationLat
              : 52.52,
          lng:
            typeof locationLng === "number" && isFinite(locationLng)
              ? locationLng
              : 13.405,
        };

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

        const markerInstance = new window.google.maps.Marker({
          position: validLocation,
          map: mapInstance,
          title: name,
        });

        setMap(mapInstance);
        setMarker(markerInstance);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();
  }, [isScriptLoaded, locationLat, locationLng, name]);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const d = new Date(date);
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
    <div className="w-full mx-auto mb-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 p-6">
            <div className="text-gray-500 text-sm mb-3">{formatDate(date)}</div>
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="font-semibold text-xl text-gray-900">{name}</h3>
                <div className="flex items-center gap-3 text-gray-600">
                  <span className="flex items-center">
                    {distance ? `${distance} km` : "N/A"}
                  </span>
                  <Tooltip>
                    <TooltipTrigger>
                      <span
                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${difficultyInfo.className}`}
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
                <MapPin className="w-4 h-4 text-gray-500" />
                <Button
                  variant="outline"
                  className="text-sm"
                  onClick={() => mapsLink && window.open(mapsLink, "_blank")}
                >
                  {startDescription}
                </Button>
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

          <div className="w-full lg:w-[500px] h-64 lg:h-auto relative">
            <div
              ref={mapRef}
              style={mapContainerStyle}
              className="rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none"
            />
          </div>
        </div>
      </div>

      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
        onLoad={() => setIsScriptLoaded(true)}
      />
    </div>
  );
}
