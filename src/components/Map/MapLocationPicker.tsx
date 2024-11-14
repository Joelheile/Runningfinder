import LocationPicker from "location-picker";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

interface MapLocationPickerProps {
  onSelect: (lat: number, lng: number) => void;
  onCancel: () => void;
  location: { lat: number; lng: number };
}

export default function MapLocationPicker({
  onSelect,
  onCancel,
  location,
}: MapLocationPickerProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const mapRef = useRef<LocationPicker | null>(null);

  const initializeMap = () => {
    if (typeof google === "undefined") {
      console.error("Google Maps JavaScript API not loaded.");
      return;
    }

    mapRef.current = new LocationPicker(
      "map",
      {
        setCurrentPosition: true,
        lat: location.lat,
        lng: location.lng,
      },
      {
        zoom: 12,
      },
    );

    const idleListener = google.maps.event.addListener(
      mapRef.current.map,
      "idle",
      function (event: google.maps.MapMouseEvent) {
        const currentLocation = mapRef.current!.getMarkerPosition();
        onSelect(currentLocation.lat, currentLocation.lng);
      },
    );

    return () => {
      google.maps.event.removeListener(idleListener);
    };
  };

  useEffect(() => {
    if (isScriptLoaded && typeof window !== "undefined") {
      initializeMap();
    }
  }, [isScriptLoaded]);

  return (
    <div className="App mt-8">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`}
        strategy="lazyOnload"
        onLoad={() => setIsScriptLoaded(true)}
        onError={() => console.error("Google Maps script failed to load.")}
      />
      <h2 className="text-xl font-semibold mb-2">Location Picker</h2>
      <div
        id="map"
        style={{ height: "400px", marginBottom: 20 }}
        className="border rounded"
      />
      <p>
        <strong>Location:</strong> {location.lat}, {location.lng}
      </p>
    </div>
  );
}
