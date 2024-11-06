"use client";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import SelectedClubHeader from "./clubs/SelectedClubHeader";

import Image from "next/image";
import ReactDOMServer from "react-dom/server";
import { Club } from "@/lib/types/Club";
import Link from "next/link";

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
          title: club.id,
          icon: {
            url: "/icons/ClubUnselected.svg", // Default icon
            scaledSize: new google.maps.Size(50, 50),
          },
        });

        marker.addListener("click", () => {
          setSelectedLocation(club);

          infoWindow.setContent(
            ReactDOMServer.renderToString(
              <div className="cursor-pointer">
                <Link href={`/club/${club.slug}`}>
                  <img
                    src={club.avatarUrl}
                    alt={club.name}
                    className="h-20 w-full mb-2 rounded-sm"
                  />
                  <strong>{club.name}</strong>
                </Link>
              </div>,
            ),
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
      {selectedLocation && (
        <SelectedClubHeader
          {...clubs.find((club) => club.id === selectedLocation.id)!}
        />
      )}
      <div style={{ height: "100vh" }} ref={mapRef} />
    </div>
  );
};

export default Map;
