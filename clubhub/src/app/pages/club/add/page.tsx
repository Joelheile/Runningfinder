"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LocationPicker from "location-picker";
import { useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { useAddClub } from "@/app/hooks/useAddClub";
import { Club } from "@/lib/types/club";
import { ConsoleLogWriter } from "drizzle-orm";

export default function addClubPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({ lat: 52.52, lng: 13.405 });
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  // TODO: it should only be possible to submit as an admin
  // TODO: Needs to be redesigned




  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        console.log("avatar base 64", base64String);
        setAvatar(base64String.split(",")[1]); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("avatar", avatar);
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
      avatar: avatar,
      websiteUrl,
      id: "",
      creationDate: "",
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
        setLocation({ lat: location.lat, lng: location.lng });
      }
    );

    console.log(locationPicker);
  };

  return (
    <div className=" flex justify-center items-start h-screen">
      <form className="mt-20 flex-col w-5/6 space-y-10" onSubmit={handleSubmit}>
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
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <Button type="submit">Add club</Button>

        <div className="App">
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS}`}
            onError={() => console.log("onError")}
            onLoad={defaultPosition}
          />
          <h1>Location Picker</h1>
          <h2>React Location Picker Example</h2>
          <div id="map" style={{ height: "400px", marginBottom: 20 }} />
          Location: <b>{location.lat + " | " + location.lng}</b>
        </div>
      </form>
    </div>
  );
}
