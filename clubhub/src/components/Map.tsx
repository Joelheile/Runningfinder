"use client";
// clubhub/src/components/Map.tsx
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface Location {
  id: number;
  name: string;
  position: { lat: number; lng: number };
  description: string;
  date: string;
  time: string;
  distance: string;
}

interface MapProps {
  clubs: Location[];
}

const Map: React.FC<MapProps> = ({ clubs }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
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

      clubs.forEach((location: Location) => {
        const marker = new Marker({
          map,
          position: location.position,
          title: location.name,
        });

        marker.addListener("click", () => {
          setSelectedLocation(location);
          setPopoverOpen(true);
          setPopoverPosition({
            x: location.position.lat,
            y: location.position.lng,
          });
          infoWindow.setContent(location.name);
          infoWindow.open(map, marker);
        });
      });
    };

    initMap();
  }, [clubs]);

  return (
    <div className="h-screen w-full">
      <div ref={mapRef} className="h-full w-full"></div>
      {selectedLocation && (
        <div className="absolute top-0 left-0 z-10 bg-card text-card-foreground shadow-sm rounded-lg p-4 w-full ">
          <img
            src="/assets/midnightrunners.jpg"
            className="w-48 h-48"
            alt="Midnight Runners"
          />
          <h2 className="">{selectedLocation.name}</h2>
          <p>{selectedLocation.description}</p>
          <p>
            <b>Date(s):</b> {selectedLocation.date}
          </p>
          <p>
            <b>Time(s):</b> {selectedLocation.time}
          </p>
          <p>
            <b>Distance:</b> {selectedLocation.distance}
          </p>
        </div>
      )}
    </div>
  );
};

export default Map;
