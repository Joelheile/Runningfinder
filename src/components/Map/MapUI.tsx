import { Run } from "@/lib/types/Run";
import React, { useEffect, useState } from "react";
import { SelectedClubHeaderLogic } from "../Clubs/SelectedClubHeaderLogic";

interface MapViewProps {
  mapRef: React.RefObject<HTMLDivElement>;
  selectedLocation: Run | null;
  runs: Run[];
}

const MapUI = ({ mapRef, selectedLocation, runs }: MapViewProps) => {
  const [isClubHeaderVisible, setIsClubHeaderVisible] = useState(false);

  // Show header when a new location is selected
  useEffect(() => {
    if (selectedLocation) {
      setIsClubHeaderVisible(true);
    }
  }, [selectedLocation]);

  const handleMapClick = (e: React.MouseEvent) => {
    // Only hide if clicking directly on the map container, not its children
    if (e.target === e.currentTarget) {
      setIsClubHeaderVisible(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full">
      {selectedLocation &&
        runs.length !== 0 &&
        isClubHeaderVisible &&
        (() => {
          const selectedRun = runs.find(
            (run) => run.id === selectedLocation.id,
          );
          return selectedRun ? (
            <SelectedClubHeaderLogic
              run={selectedRun}
              onClose={() => setIsClubHeaderVisible(false)}
            />
          ) : null;
        })()}
      <div className="absolute inset-0" ref={mapRef} onClick={handleMapClick} />
    </div>
  );
};

export default MapUI;
