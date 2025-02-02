import { db } from "@/lib/db/db";
import { clubs, runs } from "@/lib/db/schema";
import { Run } from "@/lib/types/Run";
import { eq } from "drizzle-orm";
import { v4 } from "uuid";
import { Club } from "../types/Club";

const SCRAPING_WORKER_URL =
  "https://runningfinder.joel-heil-escobar.workers.dev/";

interface WorkerEvent {
  eventName: string;
  clubName: string;
  datetime: string;
  location: string;
  locationUrl: string;
  difficulty: string;
  distance: string;
  isRecurrent?: boolean;
  location_latitude?: number;
  location_longitude?: number;
  instagramUsername?: string;
  stravaUsername?: string;
}

interface WorkerResponse {
  totalClubs: number;
  totalEvents: number;
  averageEventsPerClub: number;
  lastUpdated: string;
  clubs: Array<{
    clubName: string;
    events: WorkerEvent[];
    totalEvents: number;
    instagramUsername?: string;
    stravaUsername?: string;
  }>;
}

interface InstagramProfile {
  profileImageUrl: string | null;
  profileDescription: string | null;
  recentPosts: Array<{
    url: string;
    displayUrl: string;
    caption?: string;
  }>;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

async function getInstagramProfile(
  instagramUsername: string,
): Promise<InstagramProfile | null> {
  if (!instagramUsername || !process.env.APIFY_KEY) {
    console.log("Skipping Instagram fetch - missing username or API key");
    return null;
  }

  console.log(`Starting Instagram profile fetch for ${instagramUsername}...`);
  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${process.env.APIFY_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usernames: [instagramUsername],
          resultsLimit: 6,
        }),
      },
    );

    if (!response.ok) {
      console.error(
        `Instagram API error: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    console.log("Instagram API response received, parsing data...");
    const instagramData = await response.json();

    if (!Array.isArray(instagramData) || instagramData.length === 0) {
      console.log("No Instagram data found in response");
      return null;
    }

    const firstItem = instagramData[0];
    if (!firstItem) {
      console.log("No profile data in Instagram response");
      return null;
    }

    console.log("Successfully parsed Instagram profile data");
    return {
      profileImageUrl:
        firstItem.profilePicUrlHD || firstItem.profilePicUrl || null,
      profileDescription: firstItem.biography || null,
      recentPosts: (firstItem.latestPosts || [])
        .slice(0, 6)
        .map((post: any) => ({
          url: post.url,
          displayUrl: post.displayUrl,
          caption: post.caption,
        })),
    };
  } catch (error) {
    console.error("Failed to fetch Instagram profile:", error);
    return null;
  }
}

export async function scrapeRuns() {
  try {
    console.log("Fetching data from worker...");
    const response = await fetch(SCRAPING_WORKER_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    if (!text.trim()) {
      throw new Error("Empty response from worker");
    }

    let data: WorkerResponse;
    try {
      data = JSON.parse(text);
      console.log("Successfully parsed worker response");
    } catch (error) {
      console.error("Failed to parse worker response:", error);
      throw error;
    }

    if (!data || !data.clubs) {
      throw new Error("Invalid data format from worker");
    }

    console.log(
      `Found ${data.totalEvents} events from ${data.totalClubs} clubs`,
    );
    console.log("Clubs found:", data.clubs.map((c) => c.clubName).join(", "));

    // Get existing runs to avoid duplicates
    const existingRuns = await db.select().from(runs);
    console.log(`Found ${existingRuns.length} existing runs in database`);

    // Get existing clubs to check which ones need to be created
    const existingClubs = await db.select().from(clubs);
    console.log(`Found ${existingClubs.length} existing clubs in database`);

    let addedRuns = 0;
    let skippedRuns = 0;
    let addedClubs = 0;
    let updatedClubs = 0;
    let clubId: string = "";

    for (const clubData of data.clubs) {
      try {
        console.log(`\nProcessing club: ${clubData.clubName}`);

        // Generate slug for lookup
        const clubSlug = generateSlug(clubData.clubName);

        // Check if club exists by slug
        const existingClub = existingClubs.find(
          (c: Club) => c.slug === clubSlug,
        );
        if (existingClub) {
          console.log(
            `Club with slug ${clubSlug} already exists, skipping creation`,
          );
          clubId = existingClub.id;
        } else {
          console.log(`Club ${clubData.clubName} does not exist in database`);

          // Initialize club data
          let clubInsertData: any = {
            id: v4(),
            name: clubData.clubName,
            slug: clubSlug,
            creationDate: new Date(),
            stravaUsername: clubData.stravaUsername || "",
            instagramUsername: clubData.instagramUsername || "",
            avatarUrl: "",
            description: "",
            isApproved: false, // Will be set to true if Instagram avatar is fetched
          };

          // Only fetch and set Instagram data if username is provided
          if (
            clubData.instagramUsername &&
            clubData.instagramUsername.trim() !== ""
          ) {
            console.log(
              `Starting Instagram data fetch for ${clubData.clubName} (${clubData.instagramUsername})...`,
            );
            try {
              const instagramProfile = await getInstagramProfile(
                clubData.instagramUsername,
              );

              if (instagramProfile) {
                console.log("Instagram profile data retrieved successfully");
                clubInsertData.avatarUrl = instagramProfile.profileImageUrl;
                clubInsertData.description = instagramProfile.profileDescription;
                // Automatically approve club if it has an avatar URL
                if (instagramProfile.profileImageUrl) {
                  console.log("Auto-approving club due to valid Instagram avatar");
                  clubInsertData.isApproved = true;
                }
              } else {
                console.log("No Instagram profile data available");
              }
            } catch (error) {
              console.error(
                `Error fetching Instagram data for ${clubData.clubName}:`,
                error,
              );
            }
          } else {
            console.log(
              "No Instagram username provided, skipping profile fetch",
            );
          }

          // Create new club
          console.log(
            `Creating new club: ${clubData.clubName} with slug: ${clubInsertData.slug}`,
          );
          try {
            await db.insert(clubs).values(clubInsertData);
            const newClub = await db
              .select()
              .from(clubs)
              .where(eq(clubs.name, clubData.clubName))
              .limit(1);
            clubId = newClub[0].id;
            console.log(`Successfully created club: ${clubData.clubName}`);
            addedClubs++;
          } catch (error: any) {
            console.error(`Failed to create club ${clubData.clubName}:`, error);
            throw error;
          }
        }

        // Process events for this club
        console.log(
          `Processing ${clubData.events.length} events for ${clubData.clubName}`,
        );
        for (const event of clubData.events) {
          try {
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

            if (!eventName || !datetime || !clubData.clubName) {
              console.log(`Skipping event - missing required fields:`, {
                eventName,
                datetime,
                clubName: clubData.clubName,
              });
              skippedRuns++;
              continue;
            }

            const dateObject = new Date(datetime);

            // Check for duplicate runs
            const existingRun = existingRuns.find(
              (r: Run) =>
                r.name === eventName &&
                r.clubId === clubId &&
                new Date(r.datetime!).getDate() === dateObject.getDate() &&
                new Date(r.datetime!).getMonth() === dateObject.getMonth() &&
                new Date(r.datetime!).getFullYear() ===
                  dateObject.getFullYear(),
            );

            if (existingRun) {
              console.log(`Skipping duplicate run: ${eventName}`);
              skippedRuns++;
              continue;
            }

            const numLocationLat = location_latitude
              ? parseFloat(location_latitude.toString())
              : 52.52; // Default to Berlin coordinates
            const numLocationLng = location_longitude
              ? parseFloat(location_longitude.toString())
              : 13.405;

            const startDescription = location
              ? location
              : "Location TBD - check club's social media for updates";

            // Insert the run into the database
            await db.insert(runs).values({
              id: v4(),
              name: eventName,
              difficulty: difficulty.toLowerCase(),
              clubId: clubId,
              datetime: dateObject,
              weekday: ((dateObject.getDay() + 6) % 7) + 1,
              startDescription,
              locationLat: numLocationLat,
              locationLng: numLocationLng,
              mapsLink: locationUrl || null,
              isRecurrent: isRecurrent || false,
              isApproved: true,
              distance: distance === "0" || distance === "" ? "N/A" : distance,
            });

            console.log(`Successfully added run: ${eventName}`);
            addedRuns++;
          } catch (error) {
            console.error(`Failed to process event:`, error);
            skippedRuns++;
          }
        }
      } catch (error) {
        console.error(`Failed to process club ${clubData.clubName}:`, error);
      }
    }

    console.log(`\nScraping completed:
- Added ${addedRuns} runs
- Skipped ${skippedRuns} runs
- Added ${addedClubs} new clubs
- Updated ${updatedClubs} existing clubs`);
  } catch (error) {
    console.error("Failed to scrape runs:", error);
    throw error;
  }
}
