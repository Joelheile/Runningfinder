import { useFetchClubs } from "@/lib/hooks/clubs/useFetchClubs";
import { Run } from "@/lib/types/Run";
import { Loader } from "@googlemaps/js-api-loader";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import MapUI from "./MapUI";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  version: "weekly",
});

const Map = memo(({ runs }: { runs: Run[] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Run | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string>("");

  // Initialize map only once
  useEffect(() => {
    const initMap = async () => {
      if (mapInstanceRef.current) return;

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        version: "weekly",
      });

      const { Map } = (await loader.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      const { InfoWindow } = (await loader.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;

      const defaultCenter = { lat: 52.5155235, lng: 13.4049124 };
      const center =
        runs[0]?.location?.lat && runs[0]?.location?.lng
          ? {
              lat: Number(runs[0].location.lat),
              lng: Number(runs[0].location.lng),
            }
          : defaultCenter;

      mapInstanceRef.current = new Map(mapRef.current as HTMLDivElement, {
        center,
        zoom: 12,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
        disableDefaultUI: true, // Disable all default UI elements
        zoomControl: false, // Keep zoom control
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy", // Makes map fully draggable on mobile
      });

      infoWindowRef.current = new InfoWindow();

      // Initialize user location tracking
      if (navigator.geolocation) {
        const { Marker } = (await loader.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

        // Create user marker but don't set position yet
        userMarkerRef.current = new Marker({
          map: mapInstanceRef.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 2,
          },
          zIndex: 1000, // Keep user marker on top
        });

        // Watch user's position
        navigator.geolocation.watchPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(newLocation);
            setLocationError("");

            if (userMarkerRef.current) {
              userMarkerRef.current.setPosition(newLocation);
            }
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocationError(error.message);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 27000,
          }
        );
      } else {
        setLocationError("Geolocation is not supported by this browser.");
      }
    };

    initMap();
  }, []); // Empty dependency array means this only runs once

  const {
    data: clubs,
    error: clubError,
    isLoading: clubLoading,
  } = useFetchClubs();

  // Update markers when runs change
  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapInstanceRef.current || !infoWindowRef.current) return;

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Only proceed if we have runs to display
      if (runs.length === 0) return;

      try {
        const { Marker } = (await loader.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

        const newMarkers: google.maps.Marker[] = runs
          .map((run: Run) => {
            if (!run.location?.lat || !run.location?.lng) return null;

            const lat = Number(run.location.lat);
            const lng = Number(run.location.lng);

            if (isNaN(lat) || isNaN(lng)) return null;

            const marker = new Marker({
              map: mapInstanceRef.current,
              position: { lat, lng },
              title: run.id,
              icon: {
                url: "/icons/ClubUnselected.svg",
                scaledSize: new google.maps.Size(50, 50),
              },
            });

            marker.addListener("click", () => {
              setSelectedLocation(run);

              const club = clubs?.find((club) => club.id === run.clubId);

              if (infoWindowRef.current) {
                infoWindowRef.current.setContent(
                  ReactDOMServer.renderToString(
                    <div className="cursor-pointer center">
                      <Link href={`/clubs/${club?.slug}`}>
                        <Image
                          width={100}
                          height={100}
                          src={
                            club?.avatarUrl ||
                            "/assets/default-fallback-image.png"
                          }
                          alt={run.name}
                          className="mb-4 rounded-lg object-cover"
                        />
                        <strong className="block">{run.name}</strong>
                        <p className="mt-2">
                          {new Date(run.datetime).toLocaleDateString()} -{" "}
                          {new Date(run.datetime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="mt-2">{run.distance} km</p>
                        <span
                          className={`inline-block rounded-lg px-2 py-1 text-xs font-medium mt-2 ${
                            run.difficulty === "easy"
                              ? "bg-green-100 text-green-700"
                              : run.difficulty === "intermediate"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {run.difficulty}
                        </span>
                      </Link>
                    </div>
                  )
                );
                infoWindowRef.current.open(mapInstanceRef.current, marker);
              }
            });

            return marker;
          })
          .filter(
            (marker): marker is google.maps.Marker =>
              marker !== null && marker instanceof google.maps.Marker
          );

        // Store markers in ref
        markersRef.current = newMarkers;
      } catch (error) {
        console.error("Error updating markers:", error);
        markersRef.current = [];
      }
    };

    updateMarkers();
  }, [runs, clubs]);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersRef.current.length) return;

    const bounds = new google.maps.LatLngBounds();
    markersRef.current.forEach((marker) => {
      const position = marker.getPosition();
      if (position) bounds.extend(position);
    });

    mapInstanceRef.current?.fitBounds(bounds);
  }, [runs]); // Update bounds when runs change

  useEffect(() => {
    markersRef.current.forEach((marker) => {
      const iconUrl =
        selectedLocation && marker.getTitle() === selectedLocation.id
          ? "/icons/ClubSelected.svg"
          : "/icons/ClubUnselected.svg";
      marker.setIcon({
        url: iconUrl,
        scaledSize: new google.maps.Size(50, 50),
      });
    });
  }, [selectedLocation]);

  // Function to center map on user location
  const centerOnUser = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.panTo(userLocation);
      mapInstanceRef.current.setZoom(15);
    }
  };

  return (
    <div className="relative w-full h-full">
      <MapUI mapRef={mapRef} selectedLocation={selectedLocation} runs={runs} />
      {userLocation && (
        <button
          onClick={centerOnUser}
          className="absolute bottom-24 right-4 z-10 p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Center on my location"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.671 4.329l-3.042 3.042" />
            <path d="M7.371 16.629l-3.042 3.042" />
            <path d="M19.671 19.671l-3.042-3.042" />
            <path d="M7.371 7.371l-3.042-3.042" />
          </svg>
        </button>
      )}
      {locationError && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
          {locationError}
        </div>
      )}
    </div>
  );
});

Map.displayName = "Map";

export default Map;
