import { scrapeRuns } from "@/lib/scraping/scrapeRuns";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const isVercelCron = request.headers.get("x-vercel-cron") === "true";

    if (
      !isVercelCron &&
      (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`)
    ) {
      console.error("Unauthorized request:", authHeader);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("Starting scraping process...");
    console.log("Environment check:");
    console.log("- CRON_SECRET:", process.env.CRON_SECRET ? "✓" : "✗");
    console.log("- APIFY_KEY:", process.env.APIFY_KEY ? "✓" : "✗");

    await scrapeRuns();

    console.log("Scraping completed successfully");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Scraping failed with error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to scrape runs",
      },
      { status: 500 },
    );
  }
}
