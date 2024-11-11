import { useEffect, useState } from "react";
import LocationPicker from "location-picker";
import Script from "next/script";
import { Button } from "../ui/button";

interface MapLocationPickerProps {
  onSelect: (lat: number, lng: number) => void;
  onCancel: () => void;
}

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  onSelect,
  onCancel,
}) => {
  const [location, setLocation] = useState({ lat: 52.52, lng: 13.405 });
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (isScriptLoaded && typeof window !== "undefined") {
      initializeMap();
    }
  }, [isScriptLoaded]);

  const initializeMap = () => {
    if (typeof google === "undefined") {
      console.error("Google Maps JavaScript API not loaded.");
      return;
    }

    const locationPicker = new LocationPicker(
      "map",
      {
        setCurrentPosition: true,
        lat: 52.52,
        lng: 13.405,
      },
      {
        zoom: 12,
      }
    );

    const idleListener = google.maps.event.addListener(
      locationPicker.map,
      "idle",
      function (event: google.maps.MapMouseEvent) {
        const currentLocation = locationPicker.getMarkerPosition();
        setLocation({ lat: currentLocation.lat, lng: currentLocation.lng });
      }
    );

    console.log(locationPicker);

    // Cleanup listener on unmount
    return () => {
      google.maps.event.removeListener(idleListener);
    };
  };

  const selectLocation = () => {
    onSelect(location.lat, location.lng);
    onCancel();
    console.log("location", location);
  };

  return (
    <div className="App mt-8" onDrag={selectLocation}>
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
Location: {location.lat}, {location.lng}
      </p>

    </div>
  );
};