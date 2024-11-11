import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import ReactDOMServer from "react-dom/server";
import Link from "next/link";
import { Run } from "@/lib/types/Run";
import { Club } from "@/lib/types/Club";
import SelectedClubHeader from "./clubs/SelectedClubHeader";

interface MapProps {
  runs: Run[];
  clubs: Club[];
}

const Map = ({ runs, clubs }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Run | null>(null);

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
        center: runs[0]?.location || { lat: 52.5155235, lng: 13.4049124 },
        zoom: 12,
        mapId: "55c1e732e0359b58",
      });

      const infoWindow = new InfoWindow();

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      runs.forEach((run: Run) => {
        const marker = new Marker({
          map,
          position: run.location,
          title: run.id,
          icon: {
            url: "/icons/ClubUnselected.svg",
            scaledSize: new google.maps.Size(50, 50),
          },
        });

        marker.addListener("click", () => {
          setSelectedLocation(run);

          const associatedClub = clubs.find((club) => club.id === run.clubId);

          if (associatedClub) {
            infoWindow.setContent(
              ReactDOMServer.renderToString(
                <div className="cursor-pointer">
                  <Link href={`/club/${associatedClub.slug}`}>
                    <strong>{associatedClub.name}</strong>
                  </Link>
                  <p>{associatedClub.description}</p>
                </div>
              )
            );
            infoWindow.open(map, marker);
          } else {
            infoWindow.setContent("Club information not available.");
            infoWindow.open(map, marker);
          }
        });

        markersRef.current.push(marker);
      });
    };

    initMap();
  }, [runs, ]);

  return (
    <div className="h-screen w-full">
      {selectedLocation && (
        <SelectedClubHeader
          run={runs.find((run) => run.id === selectedLocation.id)!}
        />
      )}
      <div style={{ height: "100vh" }} ref={mapRef} />
    </div>
  );
};

export default Map;