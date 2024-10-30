"use client";
// clubhub/src/components/Map.tsx
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import SelectedClubHeader from "./Clubs/SelectedClubHeader";
import { Club } from "@/lib/types/club";
import Image from "next/image";

const Map = ({ clubs }: { clubs: Club[] }) => {
  console.log("map data:", clubs);
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLocation, setSelectedLocation] = useState<Club | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

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
        center: clubs[0]?.location || { lat: 52.5155235, lng: 13.4049124 },
        zoom: 12,
        mapId: "55c1e732e0359b58",
      });

      const infoWindow = new InfoWindow();

      const newMarkers = clubs.map((club: Club) => {
        const marker = new Marker({
          map,
          position: club.location,
          title: club.name,
          icon: {
            url: "/icons/ClubUnselected.svg", // Default icon
            scaledSize: new google.maps.Size(50, 50),
          },
        });

        marker.addListener("click", () => {
          setSelectedLocation(club);

          infoWindow.setContent(
            `<div>
              <img src="${club.avatarUrl}" alt="${club.name}" style="width:50px;height:50px;"/>
                <br/>
              <strong>${club.name}</strong>
            </div>`,
          );
          infoWindow.open(map, marker);
        });

        return marker;
      });

      setMarkers(newMarkers);
    };

    initMap();
  }, [clubs]);

  useEffect(() => {
    markers.forEach((marker) => {
      const iconUrl =
        selectedLocation && marker.getTitle() === selectedLocation.name
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
      {selectedLocation && (
        <SelectedClubHeader
          id={selectedLocation.id}
          name={selectedLocation.name}
          description={selectedLocation.description}
          avatar={selectedLocation.avatarUrl || ""}
        />
      )}
      <div style={{ height: "100vh" }} ref={mapRef} />
    </div>
  );
};

export default Map;
