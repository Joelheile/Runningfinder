import { compareClubs } from "./useCompareClubs";
import useGetProfileImage from "./useGetProfileImage";

export async function scrapeRuns() {
  const scrapedData = await fetch("https://runningfinder.joel-heil-escobar.workers.dev/", {
    method: "GET",
  }).then((r) => r.json())

  console.log("scrapedData", scrapedData);

  let counter = 0;
  for (const run of scrapedData) {
    if (counter >= 1) break;
    counter++;

    console.log("run", run);
    const message = await compareClubs({ clubName: run.clubName });

    if (message === "true") {
      console.log("club already exists", run.clubName);
    } else {
      const { profileImageId, profileImageUrl } = await useGetProfileImage(run.instagramUsername);
    }
        // const addclubs = await fetch("/api/clubs", {
        //   method: "POST",
        //   body: JSON.stringify({
        //       id: v4(),
        //       name: run.name,
        //       location: { lat: run.lat, lng: run.lng },
        //       description: "",
        //       instagramUsername: run.instagramUsername,
        //       websiteUrl: run.locationLink,
        //       stravaUsername: run.stravaUsername,
        //       avatarFileId: "",
        //     }),
        //   }).then((r) => r.json());
        }
      
    


      
      
    
        
    //     // check if run is already in the database (filer)
    //     const runs = await fetch("/api/runs/").then((r) => r.json());
        
    //     const existingRun = runs.find(
    //       (existingRun: any) =>
    //         existingRun.title === run.title && existingRun.date === run.date
    //     );
        
    //     if (!existingRun) {
    //       // if not, add it
    //       console.log("existing runs", existingRun);
    //     } else {
    //   console.log("run already exists", existingRun);
    // }

    // check for clubs and if not inside, add running club
  
  
  return scrapedData;
}
