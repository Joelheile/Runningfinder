import { Run } from "@/lib/types/Run";
import React from "react";
import SelectedClubHeader from "../Clubs/SelectedClubHeaderLogic";

interface MapViewProps {
  mapRef: React.RefObject<HTMLDivElement>;
  selectedLocation: Run | null;
  runs: Run[];
}

const MapUI = ({ mapRef, selectedLocation, runs }: MapViewProps) => {
  return (
    <div className="fixed inset-0 w-full h-full">
      {selectedLocation && runs.length !== 0 && (
        <SelectedClubHeader
          run={runs.find((run) => run.id === selectedLocation.id)!}
        />
      )}
      <div className="absolute inset-0" ref={mapRef} />
    </div>
  );
};

export default MapUI;
