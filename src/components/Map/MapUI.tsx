import React from "react";

import { Run } from "@/lib/types/Run";
import SelectedClubHeader from "../Clubs/SelectedClubHeaderLogic";

interface MapViewProps {
  mapRef: React.RefObject<HTMLDivElement>;
  selectedLocation: Run | null;
  runs: Run[];
}

const MapUI = ({ mapRef, selectedLocation, runs }: MapViewProps) => {
  return (
    <div className="h-screen w-full">
      <div style={{ height: "100vh" }} ref={mapRef} />
    </div>
  );
};

export default MapUI;
