"use client";
import { useFetchClubs } from "@/lib/hooks/useFetchClubs";
import Map from "@/components/Map/MapLogic";
import React, { useState } from "react";
import { useFetchRuns } from "@/lib/hooks/useFetchRuns";
import FilterBar from "@/components/runs/FilterBarLogic";
import { Session } from "next-auth";
import { Plus } from "lucide-react";
import Link from "next/link";

const MapPage = ({ session }: { session: Session | null }) => {
  const [filters, setFilters] = useState<{
    minDistance?: number;
    maxDistance?: number;
    days?: number[];
    difficulty?: string;
  }>({}); // No filters at initial render
  console.log("session", session);
  const { data: runs, isLoading, error } = useFetchRuns(filters);

  const handleFilterChange = (newFilters: {
    minDistance?: number;
    maxDistance?: number;
    days?: number[];
    difficulty?: string;
  }) => {
    setFilters(newFilters);
  };

  const { data: clubs } = useFetchClubs();

  return (
    <div className="h-screen">
      <FilterBar onFilterChange={handleFilterChange} />
      <Map runs={runs || []} clubs={clubs || []} />
      <script id="session-info" type="application/json">
        {JSON.stringify(session)}
      </script>
    </div>
  );
};

export default MapPage;
