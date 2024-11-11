import { useState } from "react";
import LocationPicker from "location-picker";
import Script from "next/script";
import { on } from "events";

interface MapLocationPickerProps {
  onSelect: (lat: number, lng: number) => void;
  onCancel: () => void;
}

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  onSelect,
  onCancel,
}) => {
  const [location, setLocation] = useState({ lat: 52.52, lng: 13.405 });

  console.log("test");

  const defaultPosition = () => {
    var locationPicker = new LocationPicker(
      "map",
      {
        setCurrentPosition: true,
        lat: 52.52,
        lng: 13.405,
      },
      {
        zoom: 12,
      },
    );

    google.maps.event.addListener(
      locationPicker.map,
      "idle",
      function (event: google.maps.MapMouseEvent) {
        // Get current location and show it in HTML
        var location = locationPicker.getMarkerPosition();
        console.log(
          "The chosen location is " + location.lat + "," + location.lng,
        );
        console.log(location);
        setLocation({ lat: location.lat, lng: location.lng });
      },
    );

    console.log(locationPicker);
  };

  return (
    <div className="App mt-8">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`}
        onError={() => console.log("onError")}
        onLoad={defaultPosition}
      />
      <h2 className="text-xl font-semibold mb-2">Location Picker</h2>
      <div
        id="map"
        style={{ height: "400px", marginBottom: 20 }}
        className="border rounded"
      />
      <p>
        Location: <b>{location.lat + " | " + location.lng}</b>
      </p>
    </div>
  );
};
