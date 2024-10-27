"use client";
// clubhub/src/components/Map.tsx
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import SelectedClubHeader from "./Clubs/SelectedClubHeader";
import { Club } from "@/lib/types/club";



const Map = ({ clubs }: { clubs: Club[] }) => {
  console.log("map data:", clubs);
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Club | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS!,
        version: "weekly",
      });

      const { Map } = await loader.importLibrary("maps");
      const { Marker } = (await loader.importLibrary(
        "marker",
      )) as google.maps.MarkerLibrary;
      const { InfoWindow } = await loader.importLibrary("maps");

      const map = new Map(mapRef.current as HTMLDivElement, {
        center: clubs[0]?.position || { lat: 52.5155235, lng: 13.4049124 },
        zoom: 12,
        mapId: "55c1e732e0359b58",
      });

      const infoWindow = new InfoWindow();

      clubs.forEach((club: Club) => {
        const marker = new Marker({
          map,
          position: club.position,
          title: club.name,
        });

        marker.addListener("click", () => {
          setSelectedLocation(club);
          infoWindow.setContent(club.name);
          infoWindow.open(map, marker);
        });
      });
    };

    initMap();
  }, [clubs]);

  return (
    <div className="h-screen w-full">
      {selectedLocation && (
        <SelectedClubHeader
          id={selectedLocation.id}
          name={selectedLocation.name}
          description={selectedLocation.description}
        />
      )}
      <div style={{ height: "90vh" }} ref={mapRef} />
    </div>
  );
};

export default Map;
