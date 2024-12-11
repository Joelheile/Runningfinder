import { Club } from "@/lib/types/Club";
import { Run } from "@/lib/types/Run";
import { Loader } from "@googlemaps/js-api-loader";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import MapUI from "./MapUI";
import mapboxgl from "mapbox-gl";
import SelectedClubHeaderLogic from "../Clubs/SelectedClubHeaderLogic";

const Map = ({ runs, clubs }: { runs: Run[]; clubs: Club[] }) => {
  const mapContainerRef = useRef(null);
  const [zoom, setZoom] = useState(9);
  const [lng, setLng] = useState(-87.65);
  const [lt, setLt] = useState(41.84);
  const [selectedLocation, setSelectedLocation] = useState<Run | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lt],
      zoom: zoom,
    });

    map.on("load", function () {
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);

          map.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: geoJson.map((point) => ({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [point.long, point.lat],
                },
                properties: {
                  title: `Point ${point.c + 1}`,
                },
              })),
            },
          });

          map.addSource("line", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: geoJson.map((point) => [point.long, point.lat]),
              },
            },
          });

          map.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });

          map.addLayer({
            id: "line",
            type: "line",
            source: "line",
            layout: {},
            paint: {
              "line-color": "blue",
              "line-width": 2,
            },
          });
        }
      );
    });

    return () => map.remove();
  }, []);

  return (
    <div className="h-screen w-full">
      {selectedLocation && runs.length !== 0 && (
        <SelectedClubHeaderLogic
          run={runs.find((run) => run.id === selectedLocation.id)!}
        />
      )}
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lt} | Zoom: {zoom}
      </div>
      <div className="map-container" ref={mapContainerRef} />
    </div>
  );
};

export default Map;
