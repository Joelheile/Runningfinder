import puppeteer from 'puppeteer-core';

export const maxDuration = 20; 

export async function POST(request: Request) {
  const { siteUrl } = await request.json();

  const isLocal = !!process.env.NEXT_PUBLIC_CHROME_EXECUTABLE_PATH;

  const browser = await puppeteer.launch({
    // args: isLocal ? puppeteer.defaultArgs() : chromium.args,
    // defaultViewport: chromium.defaultViewport,
    executablePath: process.env.NEXT_PUBLIC_CHROME_EXECUTABLE_PATH,
    // executablePath: process.env.NEXT_PUBLIC_CHROME_EXECUTABLE_PATH || await chromium.executablePath('https://runningfinder.s3.amazonaws.com/chromium-v126.0.0-pack.tar'),
    headless: false,
    slowMo: 250,
    // headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto(siteUrl);
  const pageTitle = await page.title();

  const buttonSelector = 'button.text-primary.underline';
  await page.waitForSelector(buttonSelector, { visible: true });
  const button = await page.$(buttonSelector);
  if (button) {
    await button.click();
  } else {
    console.error('Button not found');
  }

  const runData = await page.evaluate(() => {
    const runs = Array.from(document.querySelectorAll(".rounded-lg.border.bg-card.text-card-foreground.shadow-sm.mb-4"));
    return runs.map((run) => {
      const title = run.querySelector(".text-2xl.font-semibold.leading-none.tracking-tight")?.textContent?.trim() || "";
      const clubName = run.querySelector(".font-medium")?.textContent?.trim() || "";
      const instagramUsername = run.querySelector('a[href*="instagram.com"]')?.getAttribute("href") || "";
      const stravaUsername = run.querySelector('a[href*="strava.com"]')?.getAttribute("href") || "";

      const rawDateElement = Array.from(run.querySelectorAll("div")).find(div => div.textContent?.includes("When:"));
      const rawDate = rawDateElement?.textContent?.trim() || "";
      const dateObj = new Date(rawDate.replace("When:", "").trim());
      const date = isNaN(dateObj.getTime()) ? "" : dateObj.toISOString();

      const rawDifficulty = run.querySelector(".p-6.pt-0 div:nth-child(3)")?.textContent?.trim() || "";
      const difficulty = rawDifficulty.replace("Difficulty:", "").replace("km", "").trim();

      const rawDistance = run.querySelector(".p-6.pt-0 div:nth-child(4)")?.textContent?.trim() || "";
      const distance = rawDistance.replace("Distance:", "").trim();

      const locationElement = run.querySelector(".p-6.pt-0 div:nth-child(1) a");
      const location = locationElement?.textContent?.trim() || "";
      const locationLink = locationElement?.getAttribute("href") || "";
      
      return {
        title,
        clubName,
        instagramUsername,
        stravaUsername,
        date,
        difficulty,
        distance,
        location,
        locationLink,
        latitude: null as number | null,
        longitude: null as number | null
      };
    });
  });

  for (const run of runData) {
    if (run.locationLink) {
      const response = await fetch(run.locationLink, { redirect: 'follow' });
      const locationUrl = new URL(response.url);
      const latLngMatch = locationUrl.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      const latitude = latLngMatch ? parseFloat(latLngMatch[1]) : null;
      const longitude = latLngMatch ? parseFloat(latLngMatch[2]) : null;

      run.latitude = latitude;
      run.longitude = longitude;
    }
  }

  await browser.close();

  return Response.json({
    siteUrl,
    pageTitle,
    runData,
  });
}
