"use client";
import { useFetchClubs } from "@/lib/hooks/useFetchClubs";

import LikeButton from "@/components/icons/LikeButton";
import Map from "@/components/Map/MapLogic";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useFetchRuns } from "@/lib/hooks/useFetchRuns";
import FilterBar from "@/components/runs/FilterBarLogic";

const MapPage = () => {
  const [filters, setFilters] = useState<{
    minDistance: number;
    maxDistance: number;
    days: number[];
  }>({
    minDistance: 0,
    maxDistance: 10,
    days: [],
  });

  const {
    data: runs,
    isLoading,
    error,
  } = useFetchRuns({
    minDistance: filters.minDistance,
    maxDistance: filters.maxDistance,
    days: filters.days,
  });

  const handleFilterChange = (
    newFilters: React.SetStateAction<{
      minDistance: number;
      maxDistance: number;
      days: number[];
    }>,
  ) => {
    setFilters(newFilters);
  };

  const {
    data: clubs,
    isLoading: clubsLoading,
    error: clubsError,
  } = useFetchClubs();

  return (
    <div className="h-screen">
      {/* <Link
        href={`/pages/run/likedruns`}
        className="absolute z-20 right-2 bottom-60"
      >
        <LikeButton />
      </Link> */}
      <FilterBar onFilterChange={handleFilterChange} />

      <Map runs={runs || []} clubs={clubs || []} />
    </div>
  );
};

export default MapPage;
