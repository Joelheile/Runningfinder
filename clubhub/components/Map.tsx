"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

interface Location {
  id: number;
  name: string;
  position: { lat: number; lng: number };
  description: string;
}

const locations: Location[] = [
  {
    id: 1,
    name: "Location 1",
    position: { lat: 52.5206301, lng: 13.4083387 },
    description: "Description for Location 1",
  },
  {
    id: 2,
    name: "Location 2",
    position: { lat: 52.477982, lng: 13.435625 },
    description: "Description for Location 2",
  },
  // Add more locations as needed
];

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

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
        center: locations[0].position,
        zoom: 10,
        mapId: "55c1e732e0359b58",
      });

      const infoWindow = new InfoWindow();

      locations.forEach((location) => {
        const marker = new Marker({
          map,
          position: location.position,
          title: location.name,
        });

        marker.addListener("click", () => {
          infoWindow.setContent(`
            <h3>${location.name}</h3>
            <p>${location.description}</p>
          `);
          infoWindow.open(map, marker);
          setSelectedLocation(location);
        });
      });

      // Fit the map to show all markers
      const bounds = new google.maps.LatLngBounds();
      locations.forEach((location) => bounds.extend(location.position));
      map.fitBounds(bounds);
    };

    initMap();
  }, []);

  return (
    <div className="relative h-screen w-full">
      <div className="absolute top-0 left-0 z-10 p-4 bg-white shadow-md">
        {selectedLocation ? (
          <div>
            <h2 className="text-lg font-bold">{selectedLocation.name}</h2>
            <p>{selectedLocation.description}</p>
          </div>
        ) : (
          <p>Select a location to see more information</p>
        )}
      </div>
      <div className="h-full w-full" ref={mapRef} />
    </div>
  );
}
