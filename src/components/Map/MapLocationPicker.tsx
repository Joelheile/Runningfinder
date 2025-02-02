import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "../UI/command";

interface MapLocationPickerProps {
  onSelect: (
    lat: number,
    lng: number,
    placeUrl: string,
    formattedAddress: string,
  ) => void;
  onCancel: () => void;
  location: { lat: number; lng: number };
}

interface SearchResult {
  place_id: string;
  description: string;
}

export default function MapLocationPicker({
  onSelect,
  onCancel,
  location,
}: MapLocationPickerProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const searchService = useRef<google.maps.places.AutocompleteService | null>(
    null,
  );
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current) return;

    const initMap = async () => {
      try {
        // Default to a central location if no location is provided
        const defaultLocation = {
          lat: location?.lat || 52.52,
          lng: location?.lng || 13.405,
        };

        const mapInstance = new window.google.maps.Map(
          mapRef.current as HTMLElement,
          {
            center: defaultLocation,
            zoom: 14,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          },
        );

        const markerInstance = new window.google.maps.Marker({
          map: mapInstance,
          position: defaultLocation,
          draggable: true,
        });

        // Ensure marker dragging is enabled
        markerInstance.setDraggable(true);
        markerInstance.addListener("dragend", () => {
          const position = markerInstance.getPosition();
          if (!position) return;

          const lat = position.lat();
          const lng = position.lng();

          const placeUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
          onSelect(lat, lng, placeUrl, "");
        });

        setMap(mapInstance);
        setMarker(markerInstance);

        // Initialize services
        searchService.current =
          new window.google.maps.places.AutocompleteService();
        placesService.current = new window.google.maps.places.PlacesService(
          mapInstance,
        );
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    const timer = setTimeout(() => {
      if (window.google?.maps) {
        initMap();
      } else {
        console.error("Google Maps not loaded yet");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isScriptLoaded, location]);

  useEffect(() => {
    if (!map || !marker || !location) return;

    const position = new google.maps.LatLng(location.lat, location.lng);
    marker.setPosition(position);
    map.setCenter(position);
  }, [map, marker, location]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!searchService.current || value.length < 3) {
      setSearchResults([]);
      return;
    }

    searchService.current.getPlacePredictions(
      { input: value },
      (predictions, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSearchResults(
            predictions.map((prediction) => ({
              place_id: prediction.place_id,
              description: prediction.description,
            })),
          );
        } else {
          setSearchResults([]);
        }
      },
    );
  };

  const handleSelectPlace = (placeId: string) => {
    if (!placesService.current || !marker) return;

    placesService.current.getDetails(
      {
        placeId: placeId,
        fields: ["geometry", "name", "formatted_address", "place_id"],
      },
      (place, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          place &&
          place.geometry?.location
        ) {
          const location = place.geometry.location;
          marker.setPosition(location);
          map?.setCenter(location);

          const lat = location.lat();
          const lng = location.lng();
          const placeUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place.place_id}`;

          onSelect(
            lat,
            lng,
            placeUrl,
            place.name || place.formatted_address || "",
          );
          setSearchValue(place.name || "");
          setSearchResults([]);
        }
      },
    );
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="relative">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={() => setIsScriptLoaded(true)}
        onError={(e) => console.error("Google Maps script failed to load:", e)}
      />

      <div
        ref={mapRef}
        style={{ width: "100%", height: "300px" }}
        className="rounded-lg border shadow-sm"
      />

      <div className="absolute top-2 left-2 right-2 z-10">
        <Command
          shouldFilter={false}
          className="rounded-lg border shadow-sm bg-white"
        >
          <CommandInput
            id="location-search"
            value={searchValue}
            onValueChange={handleSearch}
            placeholder="Search for a location..."
          />
          <CommandList className="bg-white">
            {searchResults.map((result) => (
              <CommandItem
                key={result.place_id}
                value={result.place_id}
                onSelect={() => handleSelectPlace(result.place_id)}
              >
                {result.description}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </div>
    </div>
  );
}
