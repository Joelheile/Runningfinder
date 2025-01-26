import { Club } from "@/lib/types/Club";
import { useState } from "react";
import toast from "react-hot-toast";
import { v4 } from "uuid";
import { useAddClub } from "../clubs/useAddClub";
import useGetProfileImage from "./useGetInstagramProfile";

export function useScrapeRuns() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImageId, setProfileImageId] = useState<string | null>(null);
  const [profileDescription, setProfileDescription] = useState<string | null>(null);
  const getProfileImage = useGetProfileImage();
  const mutation = useAddClub();

  const scrapeRuns = async () => {
    const scrapedData = await fetch("https://runningfinder.joel-heil-escobar.workers.dev/", {
      method: "GET",
    }).then((r) => r.json());

    console.log("scrapedData", scrapedData);

    let counter = 0;
    for (const run of scrapedData) {
      if (counter >= 1) break;
      counter++;

      const {
        clubName,
        instagramUsername,
        stravaUsername,
        eventName,
        datetime,
        location,
        locationUrl,
        difficulty,
        distance,
        isRecurrent,
        location_latitude,
        location_longitude,
      } = run;
      console.log("run", run);

      if (instagramUsername !== null) {
        const { profileImageId, profileImageUrl, profileDescription } = await getProfileImage({ instagramUsername });
        setProfileDescription(profileDescription);
        setProfileImageUrl(profileImageUrl);
      }

      const createClub = async () => {

      const formData: Club = {
        name: clubName,
        description: profileDescription || "",
        location: { lat: location_latitude, lng: location_longitude },
        instagramUsername: instagramUsername || "",
        stravaUsername: stravaUsername || "",
        memberCount: 0,
        avatarFileId: profileImageId || "",
        avatarUrl: profileImageUrl || "",
        websiteUrl: "",
        id: v4(),
        creationDate: new Date().toISOString(),
        slug: clubName.toLowerCase().replace(/ /g, "-"),
      };

      mutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Club added successfully");
        },
        onError: (error) => {
          toast.error("Failed to add club");
          console.error(error);
        },
      });
    }
    createClub();}
    
    const createRun = async () => {
      // check if run already exists in db
    }

    return scrapedData;
  };

  return { scrapeRuns, profileImageUrl, profileImageId, profileDescription };
}
