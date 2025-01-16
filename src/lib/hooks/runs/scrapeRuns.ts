export async function scrapeRuns() {
  const scrapedData = await fetch("/api/runs/scrape", {
    method: "POST",
    body: JSON.stringify({
      siteUrl: "https://runningfomo.com",
    }),
  }).then((r) => r.json());


  //  const addClubMutation = useAddClub();
  let counter = 0;
  for (const run of scrapedData.runData) {
    if (counter >= 1) break;
    counter++;
    
    console.log("run", run);
    const clubSlug = run.clubName.toLowerCase().replace(/ /g, "-");
    console.log("clubSlug", clubSlug);

    const clubs = await fetch("/api/clubs/").then((r) => r.json());
    console.log("clubs", clubs);

    const clubNames = clubs.map((club: any) => club.name).join(", ");
    const message = `Imagine you are a comparison bot and your only task is to compare if an input string can be found inside of an array. This is the input (a running club): ${run.clubName}. It has to be very similar, but if for example Berlin is appended, and you can find it in the array, it is the same. Output only true or false.
        Array: ${clubNames}`;

    const sendMessage = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ message }),
    }).then((r) => r.json());

    if (message === "true") {
      console.log("club already exists", run.clubName);
    } else {
      // call instagram api / scrape it
      const instagramData = await fetch(`https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items?token=${process.env.NEXT_PUBLIC_APIFY_KEY}`, {
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ usernames: ["optimisticrunners"] }),
      }).then((r) => r.json());
      console.log("instagramData", instagramData);

      // const scrapedData = await fetch("/api/runs/scrape", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     id: "",
      //     name: "",
      //     location: { lat: 0, lng: 0 },
      //     description: "",
      //     instagramUsername: "",
      //     websiteUrl: "",
      //     avatarFileId: "",
      //   }),
      // }).then((r) => r.json());
    }

    // check if run is already in the database (filer)
    const runs = await fetch("/api/runs/").then((r) => r.json());

    const existingRun = runs.find(
      (existingRun: any) =>
        existingRun.title === run.title && existingRun.date === run.date
    );

    if (!existingRun) {
      // if not, add it
      console.log("existing runs", existingRun);
    } else {
      console.log("run already exists", existingRun);
    }

    // check for clubs and if not inside, add running club
  }
  const results = { scrapedData };
  return { results };
}
