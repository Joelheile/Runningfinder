"use client";
import FilterBar from "@/components/FilterBar";
import LikeButton from "@/components/icons/LikeButton";

import Map from "@/components/Map";
import Image from "next/image";
import Link from "next/link";

import React from "react";

const MapPage = () => {
  const handleLikeButtonClick = () => {};

  const id = 1;
  return (
    <div className="h-screen">
      <Link
        href={`/pages/run/likedruns`}
        className="absolute z-20   right-2   bottom-60"
      >
        <LikeButton />
      </Link>
      <FilterBar />
      <Map />
    </div>
  );
};

export default MapPage;
