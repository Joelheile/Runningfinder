import LikeButton from "@/src/components/icons/LikeButton";
import RunCard from "@/src/components/runs/RunCard";
import { ChevronLeft, Pencil, Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ClubDetailPage = () => {
  const name = "Midnight Runners";
  const description = "Love to run";
  const id = 1;
  const carouselImages = ["", ""];

  return (
    // TODO: Refactor Nav
    <div className="flex-col bg-light w-screen h-screen p-8">
      <nav className="flex justify-between ">
        <div className="flex">
          <ChevronLeft className="stroke-primary stroke" />
          <span className="Back text-primary">Back</span>
        </div>

        <div className="flex gap-2">
          <Link href={`/pages/club/${id}/admin`}>
            <Pencil className="stroke-primary" />
          </Link>
          <Share className="stroke-primary" />
        </div>
      </nav>

      <div className="mt-10">
        <Image src={"/"} width={200} height={100} alt={""} className="w-3/4 " />
        <div className="flex">
          <LikeButton />
          <div className="flex-col ml-4">
            <h1>{name}</h1>
            <p>{description}</p>
          </div>
        </div>
        <div className="flex w-full mt-4">
          {carouselImages.map((imageUrl, index) => (
            <Image
              key={index}
              src={imageUrl}
              width={100}
              height={100}
              alt={`Carousel image ${index + 1}`}
              className="w-1/4"
            />
          ))}
        </div>
      </div>

      <div className="">
        <h2 className="mb-2">Upcoming runs</h2>
        {/* Mapped to API output */}
        <RunCard
          date={"Fr, 2.1"}
          time={0}
          distance={5}
          location={"Warschauer Straße"}
        />
      </div>
    </div>
  );
};

export default ClubDetailPage;
