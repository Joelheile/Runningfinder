"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LocationPicker from "location-picker";
import { useState } from "react";
import Script from "next/script";

export default function addClubPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  // TODO: it should only be possible to submit as an admin

  const defaultPosition = () => {
    var locationPicker = new LocationPicker(
      "map",
      {
        setCurrentPosition: true,
        lat: 52.52,
        lng: 13.405,
      },
      {
        zoom: 12,
      }
    );

    google.maps.event.addListener(
      locationPicker.map,
      "idle",
      function (event: google.maps.MapMouseEvent) {
        // Get current location and show it in HTML
        var location = locationPicker.getMarkerPosition();
        console.log(
          "The chosen location is " + location.lat + "," + location.lng
        );
        console.log(location);
        setLocation(location.lat + ", " + location.lng);
      }
    );

    console.log(locationPicker);
  };

  return (
    <div className=" flex justify-center items-start h-screen">
      <div className="mt-20 flex-col w-5/6 space-y-10">
        <h1>Add club</h1>
        <div className="flex">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex">
          <Label>Website Url (https://)</Label>
          <Input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>
        <div className="flex">
          <Label>Instagram Username</Label>
          <Input
            value={instagramUsername}
            onChange={(e) => setInstagramUsername(e.target.value)}
          />
        </div>

        <div className="App">
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`}
            onError={() => console.log("onError")}
            onLoad={defaultPosition}
          />
          <h1>Location Picker</h1>
          <h2>React Location Picker Example</h2>
          <div id="map" style={{ height: "400px", marginBottom: 20 }} />
          Location: <b>{location}</b>
        </div>
      </div>
    </div>
  );
}
