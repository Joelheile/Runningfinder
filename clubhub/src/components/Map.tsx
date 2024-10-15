"use client";
// clubhub/src/components/Map.tsx
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import SelectedClubHeader from "./Clubs/SelectedClubHeader";

// Define the Location type
type Club = {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  description: string;
  creationDate: string;
  instagramUsername: string;
  memberCount: number;
  profileImageUrl: string;
  websiteUrl: string;
};

type MapProps = {
  clubs: Club[];
};



const Map = ({ clubs }: { clubs: Club[] }) => {
  console.log("map data:", clubs);
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Club | null>(
    null
  );
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
        "marker"
      )) as google.maps.MarkerLibrary;
      const { InfoWindow } = await loader.importLibrary("maps");

      const map = new Map(mapRef.current as HTMLDivElement, {
        center: clubs[0]?.position || { lat: 0, lng: 0 },
        zoom: 10,
        mapId: "55c1e732e0359b58",
      });

      const infoWindow = new InfoWindow();

      clubs.forEach((location: Club) => {
        const marker = new Marker({
          map,
          position: location.position,
          title: location.name,
        });

        marker.addListener("click", () => {
          setSelectedLocation(location);
          infoWindow.setContent(location.name);
          infoWindow.open(map, marker);
        });
      });
    };

    initMap();
  }, []);

  return (
    <div className="h-screen w-full">
      <div ref={mapRef} className="h-full w-full"></div>
      {selectedLocation && (
        <SelectedClubHeader
          id={selectedLocation.id}
          name={selectedLocation.name}
          description={selectedLocation.description}
        />
      )}
      <div className="h-full w-full" ref={mapRef} />
    </div>
  );
};

export default Map;
