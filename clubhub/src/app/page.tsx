"use client";
import {  useFetchClubs } from "@/lib/hooks/useFetchClubs";
import FilterBar from "@/components/FilterBar";

import LikeButton from "@/components/icons/LikeButton";

import Map from "@/components/Map";
import Image from "next/image";
import Link from "next/link";

import React from "react";

const MapPage = () => {
  const handleLikeButtonClick = () => {};
  const { data: clubs, isLoading, isError, error } = useFetchClubs();

  return (
    <div className="h-screen">
      <Link
        href={`/pages/run/likedruns`}
        className="absolute z-20   right-2   bottom-60"
      >
        <LikeButton />
      </Link>
      {/* <FilterBar /> 
      // TODO: Not needed for prototype
      */}

      <Map clubs={clubs || []} />
    </div>
  );
};

export default MapPage;
