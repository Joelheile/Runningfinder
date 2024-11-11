import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import ReactDOMServer from "react-dom/server";
import { Run } from "@/lib/types/Run";
import { Club } from "@/lib/types/Club";

import Link from "next/link";
import MapUI from "./MapUI";

interface MapContainerProps {
  runs: Run[];
  clubs: Club[];
}

const MapContainer = ({ runs, clubs }: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Run | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS!,
      version: "weekly",
    });

    const initializeMap = async () => {
      const { Map } = await loader.importLibrary("maps");
      const { Marker } = (await loader.importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;
      const { InfoWindow } = await loader.importLibrary("maps");

      const map = new Map(mapRef.current as HTMLDivElement, {
        center: runs[0]?.location || { lat: 52.5155235, lng: 13.4049124 },
        zoom: 12,
        mapId: "55c1e732e0359b58",
      });

      const infoWindow = new InfoWindow();
      clearMarkers();

      runs.forEach((run: Run) => {
        const marker = createMarker(map, run, Marker);
        marker.addListener("click", () =>
          handleMarkerClick(run, marker, map, infoWindow),
        );
        markersRef.current.push(marker);
      });
    };

    const clearMarkers = () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };

    const createMarker = (map: google.maps.Map, run: Run, Marker: any) => {
      return new Marker({
        map,
        position: run.location,
        title: run.id,
        icon: {
          url: "/icons/ClubUnselected.svg",
          scaledSize: new google.maps.Size(50, 50),
        },
      });
    };

    const handleMarkerClick = (
      run: Run,
      marker: google.maps.Marker,
      map: google.maps.Map,
      infoWindow: google.maps.InfoWindow,
    ) => {
      setSelectedLocation(run);
      const associatedClub = clubs.find((club) => club.id === run.clubId);

      infoWindow.setContent(
        associatedClub
          ? ReactDOMServer.renderToString(
              <div className="cursor-pointer">
                <Link href={`/club/${associatedClub.slug}`}>
                  <strong>{associatedClub.name}</strong>
                </Link>
                <p>{associatedClub.description}</p>
              </div>,
            )
          : "Club information not available.",
      );
      infoWindow.open(map, marker);
    };

    initializeMap();
  }, [runs, clubs]);

  return (
    <MapUI mapRef={mapRef} selectedLocation={selectedLocation} runs={runs} />
  );
};

export default MapContainer;
