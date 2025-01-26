import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import { Loader } from "@googlemaps/js-api-loader";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import MapUI from "./MapUI";

const Map = memo(({ runs, clubs }: { runs: Run[]; clubs: Club[] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Run | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

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
      });

      infoWindowRef.current = new InfoWindow();
    };

    initMap();
  }, []); // Empty dependency array means this only runs once

  // Update markers when runs or clubs change
  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapInstanceRef.current || !infoWindowRef.current) return;

      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null));

      // Only load the Marker library if we need to create new markers
      if (runs.length > 0) {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: "weekly",
        });

        const { Marker } = (await loader.importLibrary(
          "marker"
        )) as google.maps.MarkerLibrary;

        const newMarkers = runs
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
              const club = clubs.find((club) => club.id === run.clubId);

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
                          className="mb-4 rounded-full object-cover"
                        />
                        <strong className="block">{run.name}</strong>
                        <p className="mt-2">
                          {new Date(run.date).toLocaleDateString()} -{" "}
                          {new Date(run.date).toLocaleTimeString([], {
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
          .filter((marker): marker is google.maps.Marker => marker !== null);

        setMarkers(newMarkers);
      } else {
        setMarkers([]);
      }
    };

    updateMarkers();
  }, [clubs, runs]);

  useEffect(() => {
    markers.forEach((marker) => {
      const iconUrl =
        selectedLocation && marker.getTitle() === selectedLocation.id
          ? "/icons/ClubSelected.svg"
          : "/icons/ClubUnselected.svg";
      marker.setIcon({
        url: iconUrl,
        scaledSize: new google.maps.Size(50, 50),
      });
    });
  }, [selectedLocation, markers]);

  return (
    <MapUI mapRef={mapRef} selectedLocation={selectedLocation} runs={runs} />
  );
});

Map.displayName = "Map";

export default Map;
