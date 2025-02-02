import { Run } from "@/lib/types/Run";
import React, { useEffect, useState } from "react";
import { SelectedClubHeaderLogic } from "../Clubs/SelectedCluLogic";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

interface MapViewProps {
  mapRef: React.RefObject<HTMLDivElement>;
  selectedLocation: Run | null;
  runs: Run[];
}

const MapUI = ({ mapRef, selectedLocation, runs }: MapViewProps) => {
  const [isClubHeaderVisible, setIsClubHeaderVisible] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Show header when a new location is selected, but only on desktop
  useEffect(() => {
    if (selectedLocation && isDesktop) {
      setIsClubHeaderVisible(true);
    }
  }, [selectedLocation, isDesktop]);

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
