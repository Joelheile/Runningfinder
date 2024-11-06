"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LocationPicker from "location-picker";
import { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { useAddClub } from "@/lib/hooks/useAddClub";
import { Club } from "@/lib/types/club";
import { ConsoleLogWriter } from "drizzle-orm";
import { v4 } from "uuid";
import AvatarUploader from "@/components/Upload/AvatarUploader";
import { Textarea } from "@/components/ui/textarea";

export default function addClubPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ lat: 52.52, lng: 13.405 });
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [avatarFileId] = useState(v4());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: Club = {
      name,
      description,
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      instagramUsername,
      memberCount: 0,
      avatarFileId: avatarFileId,
      avatarUrl: "",
      websiteUrl,
      id: "",
      creationDate: "",
      slug: "",
    };
    mutation.mutate(formData);
  };

  const mutation = useAddClub();

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
      },
    );

    google.maps.event.addListener(
      locationPicker.map,
      "idle",
      function (event: google.maps.MapMouseEvent) {
        // Get current location and show it in HTML
        var location = locationPicker.getMarkerPosition();
        console.log(
          "The chosen location is " + location.lat + "," + location.lng,
        );
        console.log(location);
        setLocation({ lat: location.lat, lng: location.lng });
      },
    );

    console.log(locationPicker);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-10">
      <h1 className="text-2xl font-bold mb-4">Add Club</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="flex flex-col">
            <Label>Club Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <Label>Club Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <Label>Website Url (https://)</Label>
            <Input
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <div className="flex flex-col">
            <Label>Instagram Username</Label>
            <Input
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
              className="mt-1 p-2 border rounded"
            />
          </div>
          <AvatarUploader id={avatarFileId} />
          <Button
            type="submit"
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            Add club
          </Button>
        </div>
        <div className="App mt-8">
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`}
            onError={() => console.log("onError")}
            onLoad={defaultPosition}
          />
          <h2 className="text-xl font-semibold mb-2">Location Picker</h2>
          <div
            id="map"
            style={{ height: "400px", marginBottom: 20 }}
            className="border rounded"
          />
          <p>
            Location: <b>{location.lat + " | " + location.lng}</b>
          </p>
        </div>
      </form>
    </div>
  );
}