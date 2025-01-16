export async function scrapeRuns() {


  const scrapedData = await fetch("/api/runs/scrape", {
    method: "POST",
    body: JSON.stringify({
      siteUrl: "https://runningfomo.com",
    }),
  }).then((r) => r.json());

  //  const addClubMutation = useAddClub();
  for (const run of scrapedData.runData) {
    console.log("run", run);
    const clubSlug = run.clubName.toLowerCase().replace(/ /g, "-");
    console.log("clubSlug", clubSlug);

    const clubs = await fetch("/api/clubs/").then((r) => r.json());
    console.log("clubs", clubs);
    
    const clubNames = clubs.map((club: any) => club.name).join(', ');
    const message = `Imagine you are a comparison bot and your only task is to compare if an input string can be found inside of an array. This is the input (a running club): ${run.clubName}. It has to be very similar, but if for example Berlin is appended, and you can find it in the array, it is the same. Output only true or false.
        Array: ${clubNames}`;

    const sendMessage = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ message }),
    }).then((r) => r.json());

  console.log(sendMessage)

    // check if run is already in the database (filer)
    const runs = await fetch("/api/runs/").then((r) => r.json());
    
    const existingRun = runs.find(
      (existingRun: any) =>
      existingRun.title === run.title && existingRun.date === run.date
    );

    if (!existingRun) {
      // if not, add it
      console.log("existing runs" , existingRun);
    }else{
      console.log("run already exists", existingRun);
    }



    // check for clubs and if not inside, add running club
  }
const results = {scrapedData};
  return {results};
}
