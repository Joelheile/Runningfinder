import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import { Loader } from "@googlemaps/js-api-loader";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, memo } from "react";
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
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS!,
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
      markers.forEach(marker => marker.setMap(null));

      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS!,
        version: "weekly",
      });

      const { Marker } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;

      const newMarkers = runs
        .map((run: Run) => {
          const lat = Number(run.location.lat);
          const lng = Number(run.location.lng);

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
            infoWindowRef.current?.setContent(
              ReactDOMServer.renderToString(
                <div className="cursor-pointer center">
                  <Link href={`/clubs/${club?.slug}`}>
                    <Image
                      width={100}
                      height={100}
                      src={
                        club?.avatarUrl || "/assets/default-fallback-image.png"
                      }
                      alt={run.name}
                      className=" mb-2  object-cover rounded-sm"
                    />
                    <strong>{run.name}</strong>
                    <p>{run.distance} km</p>
                    <p className="capitalize">{run.difficulty}</p>
                  </Link>
                </div>
              )
            );
            infoWindowRef.current?.open(mapInstanceRef.current, marker);
          });

          return marker;
        })
        .filter((marker) => marker !== null) as google.maps.Marker[];

      setMarkers(newMarkers);
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

  return <MapUI mapRef={mapRef} selectedLocation={selectedLocation} runs={runs} />;
});

Map.displayName = 'Map';

export default Map;
