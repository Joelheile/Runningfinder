import { useState } from "react";
import toast from "react-hot-toast";
import { v4 } from "uuid";
import { useAddClub } from "../clubs/useAddClub";

import { useAddRun } from "../runs/useAddRun";

import { Run } from "@/lib/types/Run";
import { useFetchClubs } from "../clubs/useFetchClubs";
import { useFetchRuns } from "../runs/useFetchRuns";
import useGetProfileImage from "./useGetInstagramProfile";

const SCRAPING_WORKER_URL = "https://runningfinder.joel-heil-escobar.workers.dev/";

export function useScrapeRuns() {
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [profileImageId, setProfileImageId] = useState<string | null>(null);
  const [profileDescription, setProfileDescription] = useState<string | null>(null);
  const { getProfileImage } = useGetProfileImage();
  const clubMutation = useAddClub();
  const runMutation = useAddRun();
  const { data: existingRuns } = useFetchRuns({});
  const { data: existingClubs } = useFetchClubs();

  const scrapeRuns = async () => {
    try {
      const response = await fetch(SCRAPING_WORKER_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
        
      if (!text.trim()) {
        throw new Error("Empty response from worker");
      }

      let scrapedData;
      try {
        scrapedData = JSON.parse(text);
      } catch (error) {
        console.error("Failed to parse worker response:", error);
        throw error;
      }

      if (!scrapedData || !scrapedData.clubs || !Array.isArray(scrapedData.clubs)) {
        throw new Error("Invalid data structure from worker");
      }

      if (scrapedData.clubs.length === 0) {
        throw new Error("No clubs found in scraped data");
      }

      for (const { clubName, instagramUsername, stravaUsername, events } of scrapedData.clubs) {
        let clubId = null;
        let clubProfileDescription = null;
        let clubProfileImageUrl = null;
        let clubProfileImageId = null;

        // Check if club already exists
        const existingClub = existingClubs?.find(
          (c) => c.name === clubName
        );

        if (existingClub) {
          clubId = existingClub.id;
        } else {
          // Fetch Instagram profile for new clubs
          // First try club level username, then check first event's username as fallback
          const username = instagramUsername || events[0]?.instagramUsername;
          if (username) {
            try {
              const profileData = await getProfileImage({ instagramUsername: username });
              if (profileData) {
                clubProfileDescription = profileData.profileDescription;
                clubProfileImageUrl = profileData.profileImageUrl;
              }
            } catch (error) {
              console.error(`Failed to fetch Instagram profile for ${clubName}:`, error);
              // Continue with default values if Instagram fetch fails
            }
          }

          // Create new club
          const clubData = {
            id: v4(),
            name: clubName,
            description: clubProfileDescription || "",
            avatarUrl: clubProfileImageUrl || "",
            avatarFileId: clubProfileImageId || "",
            instagramUsername: instagramUsername || null,
            stravaUsername: stravaUsername || null,
            slug: clubName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            creationDate: new Date().toISOString(),
            isApproved: false
          };

          try {
            const result = await clubMutation.mutateAsync(clubData);
            
            if (!result || !result.id) {
              throw new Error('Club creation failed: No club ID returned');
            }
            
            clubId = result.id;
          } catch (error: any) {
            console.error("Failed to add club:", error);
            toast.error(`Failed to add club: ${error.message}`);
            continue; // Skip processing events for this club
          }
        }

        // Verify clubId before processing events
        if (!clubId) {
          console.error(`No valid clubId for "${clubName}". Existing club:`, existingClub);
          toast.error(`Failed to process runs for ${clubName}: Missing club ID`);
          continue;
        }

        // Process events for the club
        for (const event of events) {
          const {
            eventName,
            datetime,
            location,
            locationUrl,
            difficulty,
            distance,
            isRecurrent,
            location_latitude,
            location_longitude,
          } = event;

          try {
            if (!datetime) {
              console.error(`Skipping run ${eventName} because datetime is missing`);
              continue;
            }

            const dateObject = parseDate(datetime);
            if (!dateObject) {
              console.error(`Skipping run ${eventName} because datetime is invalid:`, datetime);
              continue;
            }

            // Check if run already exists first
            const existingRun = existingRuns?.find((r: Run) => 
              r.name === eventName && 
              r.clubId === clubId && 
              new Date(r.datetime).toDateString() === dateObject.toDateString()
            );

            if (existingRun) {
              console.log(`Run ${eventName} already exists for date ${dateObject.toDateString()}, skipping...`);
              continue;
            }

            // Extract coordinates from URL if they're not provided
            let locationLat = location_latitude;
            let locationLng = location_longitude;

            // If coordinates aren't in the event data, try to extract from URL
            if ((!locationLat || !locationLng) && locationUrl) {
              console.log(`Attempting to extract coordinates for ${eventName} from URL:`, locationUrl);
              const coordinates = await extractCoordinatesFromUrl(locationUrl);
              if (coordinates) {
                locationLat = coordinates.lat;
                locationLng = coordinates.lng;
                console.log(`Successfully extracted coordinates for ${eventName}:`, coordinates);
              } else {
                console.log(`Failed to extract coordinates from URL for ${eventName}`);
              }
            }

            // Skip events without valid coordinates
            if (!locationLat || !locationLng) {
              console.log(`Skipping run "${eventName}" - missing coordinates`);
              continue;
            }

            // Create a descriptive start location
            const startDescription = location

            // Extract time from dateObject if it exists
            const time = dateObject ? 
              dateObject.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) 
              : null;

            const runData = {
              id: v4(),
              name: eventName,
              datetime: dateObject,
              time,
              location: {
                lat: locationLat,
                lng: locationLng
              },
              difficulty: difficulty.toLowerCase() ,
              distance: distance || "0",
              isRecurrent,
              clubId,
              weekday: dateObject.getDay() || 0,
              startDescription,
              mapsLink: locationUrl,
              isApproved: true
            };

            try {
              const result = await runMutation.mutateAsync(runData);
              toast.success(`Run ${eventName} added successfully`);
            } catch (error: any) {
              console.error("Failed to add run:", error);
              toast.error(`Failed to add run: ${error.message}`);
            }
          } catch (error: any) {
            console.error("Failed to process event:", error);
          }
        }
      }

      toast.success("Scraping completed successfully");
    } catch (error: any) {
      console.error("Scraping failed:", error);
      toast.error(`Scraping failed: ${error.message}`);
      throw error;
    }
  };

  async function extractCoordinatesFromUrl(url: string): Promise<{ lat: number; lng: number } | null> {
    try {
      // Make a request to your worker endpoint with the location URL
      const response = await fetch(`${SCRAPING_WORKER_URL}location?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        console.error('Worker response not ok:', response.status);
        return null;
      }

      const data = await response.json();
      console.log('Worker response:', data);

      if (data && data.latitude && data.longitude) {
        return {
          lat: parseFloat(data.latitude),
          lng: parseFloat(data.longitude)
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to extract coordinates from worker:', error);
      return null;
    }
  }

  const parseDate = (dateString: string): Date | null => {
    try {
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split(".");
      const [hours, minutes] = timePart.split(":");
      const datetime = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );
      return datetime;
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  };

  return { scrapeRuns, profileImageUrl, profileImageId, profileDescription };
}
