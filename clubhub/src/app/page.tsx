"use client";
import { useClubs } from "@/app/hooks/useClubs";
import FilterBar from "@/components/FilterBar";
import LikeButton from "@/components/icons/LikeButton";

import Map from "@/components/Map";
import Image from "next/image";
import Link from "next/link";

import React from "react";

const MapPage: React.FC = () => {
  const handleLikeButtonClick = () => {};
  const { data: clubs, isLoading, isError, error } = useClubs();

  // TODO einfach datenbank call direkt hier rein schreiben und testen, ob es klappt

  return (
    <div className="h-screen">
      <Link
        href={`/pages/run/likedruns`}
        className="absolute z-20   right-2   bottom-60"
      >
        {/* <LikeButton /> */}
      </Link>
      <FilterBar />
      <Map clubs={clubs} />
    </div>
  );
};

export default MapPage;
