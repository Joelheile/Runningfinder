import FilterBar from "@/components/FilterBar";
import FilledHeart from "@/components/icons/FilledHeart";
import Map from "@/components/Map";
import Image from "next/image";
import Link from "next/link";

import React from "react";

const MapPage = () => {
  const id = 1;
  return (
    <div className="h-screen">
      <Link
        href={`/pages/run/likedruns`}
        className="absolute z-20   right-2   bottom-60"
      >
        <FilledHeart />
      </Link>
      <FilterBar />
      <Map />
    </div>
  );
};

export default MapPage;
