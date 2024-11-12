import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import ReactDOMServer from "react-dom/server";
import Link from "next/link";
import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import MapUI from "./MapUI";

const Map = ({ runs, clubs }: { runs: Run[]; clubs: Club[] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Run | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!runs || runs.length === 0) {
      console.error("Runs data is not available.");
      return;
    }

    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS!,
        version: "weekly",
      });

      const { Map } = (await loader.importLibrary(
        "maps"
      )) as google.maps.MapsLibrary;
      const { Marker } = (await loader.importLibrary(
        "marker"
      )) as google.maps.MarkerLibrary;
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

      const map = new Map(mapRef.current as HTMLDivElement, {
        center,
        zoom: 12,
        mapId: "55c1e732e0359b58",
      });

      const infoWindow = new InfoWindow();

      const newMarkers = runs
        .map((run: Run) => {
          const lat = Number(run.location.lat);
          const lng = Number(run.location.lng);

          const marker = new Marker({
            map,
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
            infoWindow.setContent(
              ReactDOMServer.renderToString(
                <div className="cursor-pointer">
                  <Link href={`/club/${club?.slug}`}>
                    <img
                      src={club?.avatarUrl}
                      alt={run.name}
                      className="h-20 w-full mb-2 rounded-sm"
                    />
                    <strong>{run.name}</strong>
                    <p>{run.distance} km</p>
                    <p className="capitalize">{run.difficulty}</p>
                  </Link>
                </div>
              )
            );
            infoWindow.open(map, marker);
          });

          return marker;
        })
        .filter((marker) => marker !== null) as google.maps.Marker[];

      setMarkers(newMarkers);
    };

    initMap();
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
    <div className="h-screen w-full">
      <MapUI mapRef={mapRef} selectedLocation={selectedLocation} runs={runs} />
    </div>
  );
};

export default Map;
