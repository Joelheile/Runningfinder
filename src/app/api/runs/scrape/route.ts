import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';
export const maxDuration = 20; 
export async function POST(request: Request) {
  const { siteUrl } = await request.json();

  const isLocal = !!process.env.NEXT_PUBLIC_CHROME_EXECUTABLE_PATH;

  const browser = await puppeteer.launch({
    args: isLocal ? puppeteer.defaultArgs() : chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.NEXT_PUBLIC_CHROME_EXECUTABLE_PATH || await chromium.executablePath('https://<Bucket Name>.s3.amazonaws.com/chromium-v126.0.0-pack.tar'),
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  await page.goto(siteUrl);
  const pageTitle = await page.title();
  await page.click('button.text-primary.underline');

  const runData = await page.evaluate(() => {
    const runs = Array.from(document.querySelectorAll(".rounded-lg.border.bg-card.text-card-foreground.shadow-sm.mb-4"));
    return runs.map((run) => {
      const rawDate = run.querySelector(".p-6.pt-0 div:nth-child(3)")?.textContent?.trim() || "";
      const date = rawDate.replace("When:", "").trim();
      const rawDifficulty = run.querySelector(".p-6.pt-0 div:nth-child(4)")?.textContent?.trim() || "";
      const difficulty = rawDifficulty.replace("Difficulty:", "").trim();
      const rawDistance = run.querySelector(".p-6.pt-0 div:nth-child(5)")?.textContent?.trim() || "";
      const distance = rawDistance.replace("Distance:", "").trim();
  
      return {
        title: run.querySelector(".text-2xl.font-semibold.leading-none.tracking-tight")?.textContent?.trim() || "",
        clubName: run.querySelector(".font-medium")?.textContent?.trim() || "",
        instagram: run.querySelector('a[href*="instagram.com"]')?.getAttribute("href") || "",
        strava: run.querySelector('a[href*="strava.com"]')?.getAttribute("href") || "",
        date,
        difficulty,
        distance
      };
    });
  });
  
  await browser.close();

  return Response.json({
    siteUrl,
    pageTitle,
    runData,
  })
}