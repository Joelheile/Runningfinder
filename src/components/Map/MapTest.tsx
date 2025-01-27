"use client";
import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

export default function MapTest() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const testMap = async () => {
      try {
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
          version: "weekly",
        });

        await loader.load();
        console.log("Google Maps API loaded successfully!");

        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center: { lat: 52.52, lng: 13.405 }, // Berlin coordinates
            zoom: 12,
          });
          console.log("Map instance created successfully!");
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    testMap();
  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ height: "400px", width: "100%" }} />
    </div>
  );
}
